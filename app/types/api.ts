export type ApiErrorCode =
  | 'validation_error'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'internal_error'
  | 'rate_limited'
  | 'timeout';

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: unknown;
}

export interface ApiResponse<TData> {
  data?: TData;
  error?: ApiError;
}
