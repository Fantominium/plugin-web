export const securityConfig = {
  cors: {
    allowedOrigins: ['http://localhost:3000'],
    allowedMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    maxAgeSeconds: 600,
  },
  requestTimeoutMs: 10_000,
  authRateLimit: {
    windowMs: 60_000,
    maxAttempts: 5,
  },
  uploadRateLimit: {
    windowMs: 60_000,
    maxAttempts: 10,
  },
} as const;
