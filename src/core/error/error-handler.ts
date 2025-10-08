/**
 * Global error handler
 */

import { AppError, isAppError, isOperationalError } from './error-types';

export interface ErrorHandlerConfig {
  logErrors?: boolean;
  exitOnFatalError?: boolean;
  errorReporting?: {
    enabled: boolean;
    service?: 'sentry' | 'bugsnag';
    apiKey?: string;
  };
}

export class ErrorHandler {
  private config: ErrorHandlerConfig;

  constructor(config: ErrorHandlerConfig = {}) {
    this.config = {
      logErrors: true,
      exitOnFatalError: false,
      errorReporting: { enabled: false },
      ...config,
    };
  }

  /**
   * Handle application errors
   */
  handle(error: Error | AppError, context?: Record<string, any>): void {
    // Log error
    if (this.config.logErrors) {
      this.logError(error, context);
    }

    // Report error to external service
    if (this.config.errorReporting?.enabled) {
      this.reportError(error, context);
    }

    // Exit process for non-operational errors in production
    if (!isOperationalError(error) && this.config.exitOnFatalError) {
      process.exit(1);
    }
  }

  /**
   * Handle async errors
   */
  handleAsync = (error: Error | AppError, context?: Record<string, any>): Promise<void> => {
    return new Promise((resolve) => {
      this.handle(error, context);
      resolve();
    });
  };

  /**
   * Log error to console/file
   */
  private logError(error: Error | AppError, context?: Record<string, any>): void {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
      ...(isAppError(error) && {
        code: error.code,
        statusCode: error.statusCode,
        details: error.details,
        isOperational: error.isOperational,
      }),
    };

    if (isAppError(error) && error.isOperational) {
      console.warn('Operational Error:', JSON.stringify(errorInfo, null, 2));
    } else {
      console.error('System Error:', JSON.stringify(errorInfo, null, 2));
    }
  }

  /**
   * Report error to external service
   */
  private reportError(error: Error | AppError, context?: Record<string, any>): void {
    // Placeholder for error reporting service integration
    // Would integrate with Sentry, Bugsnag, etc.
    console.log('Reporting error to external service...', {
      service: this.config.errorReporting?.service,
      error: error.message,
      context,
    });
  }
}

// Global error handler instance
export const globalErrorHandler = new ErrorHandler({
  logErrors: true,
  exitOnFatalError: process.env.NODE_ENV === 'production',
  errorReporting: {
    enabled: process.env.ERROR_REPORTING_ENABLED === 'true',
    service: process.env.ERROR_REPORTING_SERVICE as 'sentry' | 'bugsnag',
    apiKey: process.env.ERROR_REPORTING_API_KEY,
  },
});

// Set up global error handlers
if (typeof window === 'undefined') {
  // Node.js environment
  process.on('uncaughtException', (error) => {
    globalErrorHandler.handle(error, { type: 'uncaughtException' });
  });

  process.on('unhandledRejection', (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    globalErrorHandler.handle(error, { type: 'unhandledRejection' });
  });
}