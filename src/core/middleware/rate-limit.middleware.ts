import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyGenerator?: (req: NextRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  message?: string;
}

class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();
  private config: Required<RateLimitConfig>;

  constructor(config: RateLimitConfig) {
    this.config = {
      keyGenerator: (req) => this.getClientIdentifier(req),
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      message: 'Too many requests, please try again later.',
      ...config,
    };
  }

  private getClientIdentifier(req: NextRequest): string {
    // Try to get the real IP address
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';
    
    // Include user agent for additional fingerprinting
    const userAgent = req.headers.get('user-agent') || '';
    return `${ip}:${userAgent.slice(0, 50)}`;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, data] of this.requests.entries()) {
      if (now > data.resetTime) {
        this.requests.delete(key);
      }
    }
  }

  async isAllowed(req: NextRequest): Promise<{ allowed: boolean; resetTime?: number; remaining?: number }> {
    this.cleanup();

    const key = this.config.keyGenerator(req);
    const now = Date.now();
    const resetTime = now + this.config.windowMs;

    let requestData = this.requests.get(key);

    if (!requestData || now > requestData.resetTime) {
      requestData = { count: 1, resetTime };
      this.requests.set(key, requestData);
      return { allowed: true, resetTime, remaining: this.config.maxRequests - 1 };
    }

    if (requestData.count >= this.config.maxRequests) {
      return { 
        allowed: false, 
        resetTime: requestData.resetTime,
        remaining: 0 
      };
    }

    requestData.count++;
    this.requests.set(key, requestData);
    
    return { 
      allowed: true, 
      resetTime: requestData.resetTime,
      remaining: this.config.maxRequests - requestData.count 
    };
  }
}

// Pre-configured rate limiters for different endpoints
export const rateLimiters = {
  // General API rate limiting
  api: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
  }),

  // Auth endpoints (more restrictive)
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    message: 'Too many authentication attempts, please try again later.',
  }),

  // Search endpoints
  search: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 searches per minute
  }),

  // File upload
  upload: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 uploads per minute
  }),

  // Password reset
  passwordReset: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 attempts per hour
    message: 'Too many password reset attempts, please try again later.',
  }),
};

/**
 * Rate limiting middleware factory
 */
export function createRateLimitMiddleware(
  limiter: RateLimiter,
  options: { 
    onLimitReached?: (req: NextRequest) => NextResponse;
    headers?: boolean;
  } = {}
) {
  return async function rateLimitMiddleware(
    req: NextRequest
  ): Promise<NextResponse | null> {
    try {
      const result = await limiter.isAllowed(req);

      if (!result.allowed) {
        const response = options.onLimitReached?.(req) || new NextResponse(
          JSON.stringify({ 
            success: false,
            error: {
              message: 'Rate limit exceeded',
              statusCode: 429,
              retryAfter: Math.ceil((result.resetTime! - Date.now()) / 1000)
            }
          }),
          { 
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil((result.resetTime! - Date.now()) / 1000).toString(),
            }
          }
        );

        if (options.headers !== false) {
          response.headers.set('X-RateLimit-Limit', limiter['config'].maxRequests.toString());
          response.headers.set('X-RateLimit-Remaining', '0');
          response.headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime! / 1000).toString());
        }

        return response;
      }

      // Add rate limit headers to successful requests
      if (options.headers !== false) {
        const response = NextResponse.next();
        response.headers.set('X-RateLimit-Limit', limiter['config'].maxRequests.toString());
        response.headers.set('X-RateLimit-Remaining', result.remaining!.toString());
        response.headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime! / 1000).toString());
        return response;
      }

      return null; // Continue to next middleware
    } catch (error) {
      console.error('Rate limiting error:', error);
      return null; // Fail open - continue without rate limiting
    }
  };
}

/**
 * Route-specific rate limiting
 */
export function getRateLimiterForPath(pathname: string): RateLimiter | null {
  if (pathname.startsWith('/api/auth')) {
    return rateLimiters.auth;
  }
  
  if (pathname.includes('/search')) {
    return rateLimiters.search;
  }
  
  if (pathname.includes('/upload')) {
    return rateLimiters.upload;
  }
  
  if (pathname.includes('/password-reset')) {
    return rateLimiters.passwordReset;
  }
  
  if (pathname.startsWith('/api/')) {
    return rateLimiters.api;
  }
  
  return null;
}