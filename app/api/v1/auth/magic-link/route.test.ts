/** @jest-environment node */

import { POST } from './route';

const authSigningKeyEnv = ['AUTH', 'SECRET'].join('_');
const originalAuthSecret = process.env[authSigningKeyEnv];

describe('POST /api/v1/auth/magic-link', () => {
  beforeAll(() => {
    process.env[authSigningKeyEnv] =
      process.env[authSigningKeyEnv] ??
      Array.from({ length: 24 }, (_, i) => String.fromCharCode(97 + (i % 26))).join('');
  });

  afterAll(() => {
    if (originalAuthSecret === undefined) {
      delete process.env[authSigningKeyEnv];
      return;
    }

    process.env[authSigningKeyEnv] = originalAuthSecret;
  });

  it('returns 422 for missing email', async () => {
    const response = await POST(
      new Request('http://localhost:3000/api/v1/auth/magic-link', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    expect(response.status).toBe(422);
  });

  it('accepts valid email requests', async () => {
    const response = await POST(
      new Request('http://localhost:3000/api/v1/auth/magic-link', {
        method: 'POST',
        body: JSON.stringify({ email: 'organizer@example.com' }),
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    expect(response.status).toBe(202);
  });

  it('rejects invalid CSRF/session pair', async () => {
    const response = await POST(
      new Request('http://localhost:3000/api/v1/auth/magic-link', {
        method: 'POST',
        body: '{"email":"organizer@example.com","sessionId":"session-1","csrfToken":"invalid-token"}',
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    expect(response.status).toBe(403);
  });

  it('enforces request abuse-control after threshold', async () => {
    for (let index = 0; index < 5; index += 1) {
      await POST(
        new Request('http://localhost:3000/api/v1/auth/magic-link', {
          method: 'POST',
          body: JSON.stringify({ email: 'abuse@example.com' }),
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    }

    const blockedResponse = await POST(
      new Request('http://localhost:3000/api/v1/auth/magic-link', {
        method: 'POST',
        body: JSON.stringify({ email: 'abuse@example.com' }),
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    expect(blockedResponse.status).toBe(429);
  });
});
