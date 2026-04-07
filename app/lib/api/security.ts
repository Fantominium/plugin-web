import type { NextResponse } from 'next/server';
import { securityConfig } from '@/app/config/security';

export function withCors(response: NextResponse, origin?: string | null): NextResponse {
  const allowedOrigins = securityConfig.cors.allowedOrigins as readonly string[];
  const allowedOrigin =
    origin && allowedOrigins.includes(origin) ? origin : securityConfig.cors.allowedOrigins[0];

  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Vary', 'Origin');
  response.headers.set(
    'Access-Control-Allow-Methods',
    securityConfig.cors.allowedMethods.join(', '),
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    securityConfig.cors.allowedHeaders.join(', '),
  );
  response.headers.set('Access-Control-Max-Age', String(securityConfig.cors.maxAgeSeconds));

  return response;
}

export function withRequestTimeout<T>(
  promise: Promise<T>,
  timeoutMs = securityConfig.requestTimeoutMs,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Request timed out')), timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timeout);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timeout);
        reject(error);
      });
  });
}
