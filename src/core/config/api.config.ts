/**
 * API configuration
 */

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  pagination: {
    defaultPageSize: number;
    maxPageSize: number;
  };
}

export const apiConfig: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: parseInt(process.env.API_TIMEOUT || '30000'), // 30 seconds
  retryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS || '3'),
  retryDelay: parseInt(process.env.API_RETRY_DELAY || '1000'), // 1 second
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
  pagination: {
    defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE || '20'),
    maxPageSize: parseInt(process.env.MAX_PAGE_SIZE || '100'),
  },
};