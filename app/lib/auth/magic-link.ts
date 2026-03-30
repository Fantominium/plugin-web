import { createHash, randomBytes } from 'node:crypto';

interface MagicLinkRecord {
  tokenHash: string;
  expiresAt: number;
  consumedAt?: number;
}

const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;
const magicLinkStore = new Map<string, MagicLinkRecord>();

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function hashToken(rawToken: string): string {
  return createHash('sha256').update(rawToken).digest('hex');
}

export function issueMagicLink(email: string): { token: string; expiresAt: Date } {
  const normalizedEmail = normalizeEmail(email);
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
    return false;
  }

  if (Date.now() > record.expiresAt) {
    return false;
  }

  record.consumedAt = Date.now();
  magicLinkStore.set(key, record);

  return true;
}

export function clearMagicLinkStore(): void {
  magicLinkStore.clear();
}
