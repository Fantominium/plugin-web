import { NextResponse } from 'next/server';
import type { ApiError, ApiErrorCode } from '@/app/types/api';

const statusByCode: Record<ApiErrorCode, number> = {
  validation_error: 422,
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  conflict: 409,
  internal_error: 500,
  rate_limited: 429,
  timeout: 504,
};

export function buildApiError(code: ApiErrorCode, message: string, details?: unknown): ApiError {
  return { code, message, details };
}

export function jsonError(error: ApiError): NextResponse {
  return NextResponse.json(
    { error },
    {
      status: statusByCode[error.code],
    },
  );
}

export function jsonData<TData>(data: TData, status = 200): NextResponse {
  return NextResponse.json({ data }, { status });
}
