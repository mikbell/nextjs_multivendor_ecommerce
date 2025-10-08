import { NextRequest } from 'next/server';
import { ZodSchema, ZodError } from 'zod';
import { currentUser } from '@clerk/nextjs/server';
import { UserService } from '@/lib/services/user-service';
import { ApiErrors, ApiException, createErrorResponse, createValidationErrorResponse } from './types';
import { logger } from '@/lib/logger';
import { user_role } from '@prisma/client';

// Authentication middleware
export async function withAuth(
  handler: (request: NextRequest, user: any) => Promise<Response>
) {
  return async (request: NextRequest) => {
    try {
      const user = await currentUser();
      
      if (!user) {
        throw ApiErrors.Unauthorized();
      }

      return await handler(request, user);
    } catch (error) {
      if (error instanceof ApiException) {
        return createErrorResponse(error);
      }
      logger.error('Authentication error:', error);
      return createErrorResponse(ApiErrors.InternalError());
    }
  };
}

// Role-based authorization middleware
export function withRole(requiredRole: user_role) {
  return function (
    handler: (request: NextRequest, user: any) => Promise<Response>
  ) {
    return async (request: NextRequest) => {
      try {
        const clerkUser = await currentUser();
        
        if (!clerkUser) {
          throw ApiErrors.Unauthorized();
        }

        const userService = new UserService();
        const user = await userService.getCurrentUser();

        if (!user) {
          throw ApiErrors.Unauthorized();
        }

        const hasPermission = await userService.hasPermission(user.id, requiredRole);
        
        if (!hasPermission) {
          throw ApiErrors.Forbidden();
        }

        return await handler(request, user);
      } catch (error) {
        if (error instanceof ApiException) {
          return createErrorResponse(error);
        }
        logger.error('Authorization error:', error);
        return createErrorResponse(ApiErrors.InternalError());
      }
    };
  };
}

// Validation middleware
export function withValidation<T>(schema: ZodSchema<T>) {
  return function (
    handler: (request: NextRequest, validatedData: T) => Promise<Response>
  ) {
    return async (request: NextRequest) => {
      try {
        let data: any;

        // Handle different request methods
        if (request.method === 'GET') {
          const url = new URL(request.url);
          data = Object.fromEntries(url.searchParams.entries());
        } else {
          const contentType = request.headers.get('content-type') || '';
          
          if (contentType.includes('application/json')) {
            data = await request.json();
          } else if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            data = Object.fromEntries(formData.entries());
          } else {
            throw ApiErrors.BadRequest('Unsupported content type');
          }
        }

        const validatedData = schema.parse(data);
        return await handler(request, validatedData);
      } catch (error) {
        if (error instanceof ZodError) {
          const errors: Record<string, string[]> = {};
          error.errors.forEach((err) => {
            const path = err.path.join('.');
            if (!errors[path]) {
              errors[path] = [];
            }
            errors[path].push(err.message);
          });
          return createValidationErrorResponse(errors);
        }

        if (error instanceof ApiException) {
          return createErrorResponse(error);
        }

        logger.error('Validation error:', error);
        return createErrorResponse(ApiErrors.InternalError());
      }
    };
  };
}

// Rate limiting middleware (simple in-memory implementation)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit(
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
) {
  return function (
    handler: (request: NextRequest) => Promise<Response>
  ) {
    return async (request: NextRequest) => {
      try {
        const identifier = request.ip || 'anonymous';
        const now = Date.now();
        const windowStart = now - windowMs;

        // Clean up old entries
        for (const [key, value] of rateLimitStore.entries()) {
          if (value.resetTime < now) {
            rateLimitStore.delete(key);
          }
        }

        const userLimit = rateLimitStore.get(identifier);

        if (!userLimit) {
          rateLimitStore.set(identifier, {
            count: 1,
            resetTime: now + windowMs,
          });
        } else if (userLimit.resetTime > now) {
          if (userLimit.count >= maxRequests) {
            throw ApiErrors.TooManyRequests();
          }
          userLimit.count++;
        } else {
          // Reset the window
          userLimit.count = 1;
          userLimit.resetTime = now + windowMs;
        }

        return await handler(request);
      } catch (error) {
        if (error instanceof ApiException) {
          return createErrorResponse(error);
        }
        logger.error('Rate limiting error:', error);
        return createErrorResponse(ApiErrors.InternalError());
      }
    };
  };
}

// CORS middleware
export function withCors(
  origins: string[] = ['http://localhost:3000'],
  methods: string[] = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
) {
  return function (
    handler: (request: NextRequest) => Promise<Response>
  ) {
    return async (request: NextRequest) => {
      const origin = request.headers.get('origin');
      const isAllowedOrigin = origins.includes('*') || (origin && origins.includes(origin));

      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': isAllowedOrigin ? (origin || '*') : origins[0],
            'Access-Control-Allow-Methods': methods.join(', '),
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
          },
        });
      }

      const response = await handler(request);

      // Add CORS headers to response
      if (isAllowedOrigin) {
        response.headers.set('Access-Control-Allow-Origin', origin || '*');
        response.headers.set('Access-Control-Allow-Methods', methods.join(', '));
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      }

      return response;
    };
  };
}

// Error handling wrapper
export function withErrorHandling(
  handler: (request: NextRequest) => Promise<Response>
) {
  return async (request: NextRequest) => {
    try {
      return await handler(request);
    } catch (error) {
      if (error instanceof ApiException) {
        return createErrorResponse(error);
      }

      logger.error('Unhandled API error:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        url: request.url,
        method: request.method,
      });

      return createErrorResponse(ApiErrors.InternalError());
    }
  };
}

// Compose multiple middleware functions
export function compose(...middlewares: Array<(handler: any) => any>) {
  return middlewares.reduce((composed, middleware) => middleware(composed));
}

// Helper to create protected API routes
export function createProtectedRoute(
  handler: (request: NextRequest, user: any) => Promise<Response>,
  requiredRole?: user_role
) {
  if (requiredRole) {
    return compose(
      withErrorHandling,
      withRateLimit(),
      withRole(requiredRole)
    )(handler);
  }

  return compose(
    withErrorHandling,
    withRateLimit(),
    withAuth
  )(handler);
}

// Helper to create public API routes
export function createPublicRoute(
  handler: (request: NextRequest) => Promise<Response>
) {
  return compose(
    withErrorHandling,
    withRateLimit(200, 15 * 60 * 1000), // Higher limit for public routes
    withCors()
  )(handler);
}