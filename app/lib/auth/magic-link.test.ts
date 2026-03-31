import {
  clearMagicLinkRateLimitStore,
  clearMagicLinkStore,
  issueMagicLink,
  verifyMagicLinkToken,
} from '@/app/lib/auth/magic-link';

const ORIGINAL_WARN = console.warn;

type SecurityLogAssertion = {
  event: string;
  contains?: string[];
};

function withMockedSecurityLogger(assertions: SecurityLogAssertion[], run: () => void): void {
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

  try {
    run();

    for (const assertion of assertions) {
      const matchedCall = warnSpy.mock.calls.find((call) =>
        call.some((arg) => typeof arg === 'string' && arg.includes(assertion.event)),
      );
      expect(matchedCall).toBeDefined();

      for (const token of assertion.contains ?? []) {
        expect(JSON.stringify(matchedCall)).toContain(token);
      }
    }
  } finally {
    warnSpy.mockRestore();
  }
}

describe('magic-link', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    clearMagicLinkStore();
    clearMagicLinkRateLimitStore();
    console.warn = ORIGINAL_WARN;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('issues and verifies a single-use token', () => {
    const email = 'organizer@pluginbim.com';
    const issuedLink = issueMagicLink(email);
    expect('error' in issuedLink).toBe(false);

    if ('error' in issuedLink) {
      throw new Error('Expected issued token but got rate-limited response');
    }

    const { token } = issuedLink;

    expect(verifyMagicLinkToken(email, token)).toBe(true);
    expect(verifyMagicLinkToken(email, token)).toBe(false);
  });

  it('rejects expired tokens and logs hashed telemetry', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const email = 'expired@pluginbim.com';
    const issuedLink = issueMagicLink(email);

    if ('error' in issuedLink) {
      throw new Error('Expected issued token but got rate-limited response');
    }

    jest.advanceTimersByTime(15 * 60 * 1000 + 1);

    expect(verifyMagicLinkToken(email, issuedLink.token)).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(
      'auth.magic_link.expired',
      expect.objectContaining({ emailHash: expect.any(String) }),
    );
  });

  it('applies first-writer-wins semantics for concurrent token consumption', async () => {
    const email = 'concurrent@pluginbim.com';
    const issuedLink = issueMagicLink(email);

    if ('error' in issuedLink) {
      throw new Error('Expected issued token but got rate-limited response');
    }

    const results = await Promise.all([
      Promise.resolve(verifyMagicLinkToken(email, issuedLink.token)),
      Promise.resolve(verifyMagicLinkToken(email, issuedLink.token)),
      Promise.resolve(verifyMagicLinkToken(email, issuedLink.token)),
    ]);

    expect(results.filter(Boolean)).toHaveLength(1);
    expect(results.filter((value) => !value)).toHaveLength(2);
  });

  it('enforces per-email rolling-window rate limiting and resets after one hour', () => {
    const email = 'ratelimit@pluginbim.com';

    for (let index = 0; index < 5; index += 1) {
      const issuedLink = issueMagicLink(email);
      expect('error' in issuedLink).toBe(false);
    }

    const denied = issueMagicLink(email);
    expect(denied).toEqual({ error: 'rate_limited' });

    jest.advanceTimersByTime(60 * 60 * 1000 + 1);
    const resetAttempt = issueMagicLink(email);
    expect('error' in resetAttempt).toBe(false);
  });

  it('logs replay and rate-limit denials without exposing plaintext emails', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const email = 'secretsafe@pluginbim.com';
    const issuedLink = issueMagicLink(email);

    if ('error' in issuedLink) {
      throw new Error('Expected issued token but got rate-limited response');
    }

    expect(verifyMagicLinkToken(email, issuedLink.token)).toBe(true);
    expect(verifyMagicLinkToken(email, issuedLink.token)).toBe(false);

    for (let index = 0; index < 5; index += 1) {
      issueMagicLink('burst@pluginbim.com');
    }
    issueMagicLink('burst@pluginbim.com');

    const loggedPayload = warnSpy.mock.calls.map((call) => JSON.stringify(call)).join('\n');

    expect(loggedPayload).toContain('auth.magic_link.replay');
    expect(loggedPayload).toContain('auth.magic_link.rate_limited');
    expect(loggedPayload).not.toContain('secretsafe@pluginbim.com');
    expect(loggedPayload).not.toContain('burst@pluginbim.com');
  });

  it('supports reusable log assertions for auth security events', () => {
    withMockedSecurityLogger(
      [
        {
          event: 'auth.magic_link.replay',
          contains: ['emailHash'],
        },
      ],
      () => {
        console.warn('auth.magic_link.replay', { emailHash: 'abc12345' });
      },
    );
  });
});
