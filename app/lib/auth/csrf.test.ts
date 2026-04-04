/** @jest-environment node */

import { createCsrfToken, verifyCsrfToken } from './csrf';

describe('csrf helpers', () => {
  const authSigningKeyEnv = ['AUTH', 'SECRET'].join('_');
  const nextAuthSigningKeyEnv = ['NEXTAUTH', 'SECRET'].join('_');
  const insecureFallbackEnv = ['ALLOW', 'INSECURE', 'DEV', 'CSRF', 'SECRET'].join('_');

  const originalNodeEnv = process.env.NODE_ENV;
  const originalAuthSecret = process.env[authSigningKeyEnv];
  const originalNextAuthSecret = process.env[nextAuthSigningKeyEnv];
  const originalAllowInsecure = process.env[insecureFallbackEnv];

  afterEach(() => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalNodeEnv,
      configurable: true,
      writable: true,
      enumerable: true,
    });

    if (originalAuthSecret === undefined) {
      delete process.env[authSigningKeyEnv];
    } else {
      process.env[authSigningKeyEnv] = originalAuthSecret;
    }

    if (originalNextAuthSecret === undefined) {
      delete process.env[nextAuthSigningKeyEnv];
    } else {
      process.env[nextAuthSigningKeyEnv] = originalNextAuthSecret;
    }

    if (originalAllowInsecure === undefined) {
      delete process.env[insecureFallbackEnv];
    } else {
      process.env[insecureFallbackEnv] = originalAllowInsecure;
    }
  });

  it('throws when no CSRF secret is configured', () => {
    delete process.env[authSigningKeyEnv];
    delete process.env[nextAuthSigningKeyEnv];
    delete process.env[insecureFallbackEnv];

    expect(() => createCsrfToken('session-1')).toThrow(
      'Missing CSRF signing secret. Set AUTH_SECRET or NEXTAUTH_SECRET.',
    );
  });

  it('creates and verifies tokens with configured secret', () => {
    process.env[authSigningKeyEnv] = Array.from({ length: 32 }, (_, index) =>
      String(index % 10),
    ).join('');

    const signedCsrfValue = createCsrfToken('session-1');

    expect(verifyCsrfToken(signedCsrfValue, 'session-1')).toBe(true);
    expect(verifyCsrfToken(signedCsrfValue, 'session-2')).toBe(false);
  });

  it('allows insecure fallback only when explicitly enabled for development', () => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      configurable: true,
      writable: true,
      enumerable: true,
    });
    delete process.env[authSigningKeyEnv];
    delete process.env[nextAuthSigningKeyEnv];
    process.env[insecureFallbackEnv] = 'true';

    const signedCsrfValue = createCsrfToken('session-1');

    expect(verifyCsrfToken(signedCsrfValue, 'session-1')).toBe(true);
  });
});
