import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  timestamp: string;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: any;
}

export class ApiException extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: any;

  constructor(message: string, code: string, status: number, details?: any) {
    super(message);
    this.name = 'ApiException';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function createSuccessResponse<T>(
  data: T,
  message?: string,
  pagination?: any
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    pagination,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response);
}

export function createErrorResponse(
  error: string | ApiException,
  status: number = 500
): NextResponse<ApiResponse> {
  if (error instanceof ApiException) {
    const response: ApiResponse = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: error.status });
  }

  const response: ApiResponse = {
    success: false,
    error: typeof error === 'string' ? error : 'Internal server error',
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status });
}

export function createValidationErrorResponse(
  errors: Record<string, string[]>
): NextResponse<ApiResponse> {
  const response: ApiResponse = {
    success: false,
    error: 'Validation failed',
    data: errors,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status: 400 });
}

// Common API errors
export const ApiErrors = {
  NotFound: (resource: string) => new ApiException(`${resource} not found`, 'NOT_FOUND', 404),
  Unauthorized: () => new ApiException('Unauthorized access', 'UNAUTHORIZED', 401),
  Forbidden: () => new ApiException('Access forbidden', 'FORBIDDEN', 403),
  BadRequest: (message: string) => new ApiException(message, 'BAD_REQUEST', 400),
  InternalError: (message: string = 'Internal server error') => new ApiException(message, 'INTERNAL_ERROR', 500),
  Conflict: (message: string) => new ApiException(message, 'CONFLICT', 409),
  TooManyRequests: () => new ApiException('Too many requests', 'TOO_MANY_REQUESTS', 429),
} as const;