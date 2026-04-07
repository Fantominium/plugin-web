import { createHash, randomBytes } from 'node:crypto';

interface MagicLinkRecord {
  tokenHash: string;
  expiresAt: number;
  consumedAt?: number;
}

interface RateLimitRecord {
  count: number;
  windowStart: number;
}

const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const magicLinkStore = new Map<string, MagicLinkRecord>();
const magicLinkRateLimitStore = new Map<string, RateLimitRecord>();

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function hashToken(rawToken: string): string {
  return createHash('sha256').update(rawToken).digest('hex');
}

function hashEmailIdentifier(email: string): string {
  return createHash('sha256').update(normalizeEmail(email)).digest('hex').slice(0, 8);
}

function checkAndIncrementRateLimit(email: string): boolean {
  const normalizedEmail = normalizeEmail(email);
  const now = Date.now();
  const existing = magicLinkRateLimitStore.get(normalizedEmail);

  if (!existing || now - existing.windowStart >= RATE_LIMIT_WINDOW_MS) {
    magicLinkRateLimitStore.set(normalizedEmail, { count: 1, windowStart: now });
    return true;
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return false;
  }

  existing.count += 1;
  magicLinkRateLimitStore.set(normalizedEmail, existing);
  return true;
}

export function issueMagicLink(
  email: string,
): { token: string; expiresAt: Date } | { error: 'rate_limited' } {
  const normalizedEmail = normalizeEmail(email);

  if (!checkAndIncrementRateLimit(normalizedEmail)) {
    console.warn('auth.magic_link.rate_limited', {
      emailHash: hashEmailIdentifier(normalizedEmail),
    });
    return { error: 'rate_limited' };
  }

  const token = randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  const expiresAt = Date.now() + MAGIC_LINK_TTL_MS;

  magicLinkStore.set(`${normalizedEmail}:${tokenHash}`, {
    tokenHash,
    expiresAt,
  });

  return {
    token,
    expiresAt: new Date(expiresAt),
  };
}

export function verifyMagicLinkToken(email: string, token: string): boolean {
  const normalizedEmail = normalizeEmail(email);
  const tokenHash = hashToken(token);
  const key = `${normalizedEmail}:${tokenHash}`;
  const record = magicLinkStore.get(key);

  if (!record) {
    return false;
  }

  if (record.consumedAt) {
    console.warn('auth.magic_link.replay', {
      emailHash: hashEmailIdentifier(normalizedEmail),
    });
    return false;
  }

  if (Date.now() > record.expiresAt) {
    console.warn('auth.magic_link.expired', {
      emailHash: hashEmailIdentifier(normalizedEmail),
    });
    return false;
  }

  // Single-process Node.js executes this get/check/set sequence synchronously,
  // giving first-writer-wins semantics for MVP deployments.
  record.consumedAt = Date.now();
  magicLinkStore.set(key, record);

  return true;
}

export function clearMagicLinkStore(): void {
  magicLinkStore.clear();
}

export function clearMagicLinkRateLimitStore(): void {
  magicLinkRateLimitStore.clear();
}
