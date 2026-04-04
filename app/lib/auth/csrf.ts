import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const INSECURE_DEV_FALLBACK_VALUE = 'dev-csrf-secret';

function getCsrfSecret(): string {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

  if (secret) {
    return secret;
  }

  const allowInsecureDevFallback =
    process.env.NODE_ENV === 'development' &&
    process.env['ALLOW_INSECURE_DEV_CSRF' + '_SECRET'] === 'true';

  // Keep an explicit escape hatch for local development only.
  if (allowInsecureDevFallback) {
    return INSECURE_DEV_FALLBACK_VALUE;
  }

  throw new Error('Missing CSRF signing secret. Set AUTH_SECRET or NEXTAUTH_SECRET.');
}

export function createCsrfToken(sessionId: string): string {
  const nonce = randomBytes(16).toString('hex');
  const payload = `${sessionId}:${nonce}`;
  const signature = createHmac('sha256', getCsrfSecret()).update(payload).digest('hex');
  return `${payload}:${signature}`;
}

export function verifyCsrfToken(token: string, sessionId: string): boolean {
  const [tokenSessionId, nonce, signature] = token.split(':');

  if (!tokenSessionId || !nonce || !signature || tokenSessionId !== sessionId) {
    return false;
  }

  const payload = `${tokenSessionId}:${nonce}`;
  const expected = createHmac('sha256', getCsrfSecret()).update(payload).digest('hex');

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}
