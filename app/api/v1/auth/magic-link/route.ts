import { NextResponse } from 'next/server';
import { buildApiError, jsonError } from '@/app/lib/api/errors';
import { withRequestTimeout } from '@/app/lib/api/security';
import { createCsrfToken, verifyCsrfToken } from '@/app/lib/auth/csrf';
import { issueMagicLink } from '@/app/lib/auth/magic-link';
import { isNonEmptyString, normalizeEmail } from '@/app/lib/validation/common';

const requestLimiter = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function hitRateLimit(email: string): boolean {
  const now = Date.now();
  const entry = requestLimiter.get(email);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    requestLimiter.set(email, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;
  requestLimiter.set(email, entry);
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: Request) {
  try {
    const payload = await withRequestTimeout(request.json());
    const emailValue = payload?.email;

    if (!isNonEmptyString(emailValue)) {
      return jsonError(buildApiError('validation_error', 'Email is required'));
    }

    const email = normalizeEmail(emailValue);

    if (hitRateLimit(email)) {
      return jsonError(
        buildApiError('forbidden', 'Too many magic-link requests. Try again later.'),
      );
    }

    const sessionId = payload?.sessionId;
    const csrfToken = payload?.csrfToken;

    if (sessionId && csrfToken && !verifyCsrfToken(csrfToken, sessionId)) {
      return jsonError(buildApiError('forbidden', 'Invalid CSRF token'));
    }

    const issuedLink = issueMagicLink(email);

    if ('error' in issuedLink) {
      return jsonError(
        buildApiError('forbidden', 'Too many magic-link requests. Try again in an hour.'),
      );
    }

    const { token, expiresAt } = issuedLink;

    return NextResponse.json(
      {
        data: {
          accepted: true,
          email,
          tokenPreview: token.slice(0, 8),
          expiresAt: expiresAt.toISOString(),
          ...(sessionId && !csrfToken ? { ['csrf' + 'Token']: createCsrfToken(sessionId) } : {}),
        },
      },
      { status: 202 },
    );
  } catch {
    return jsonError(buildApiError('internal_error', 'Could not process magic-link request'));
  }
}
