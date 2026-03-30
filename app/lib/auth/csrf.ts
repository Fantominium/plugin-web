import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

function getCsrfSecret(): string {
  return process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? 'dev-csrf-secret';
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
