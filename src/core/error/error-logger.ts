/**
 * Error logging utilities
 */

export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';

export const LOG_LEVELS = {
  ERROR: 'ERROR' as const,
  WARN: 'WARN' as const,
  INFO: 'INFO' as const, 
  DEBUG: 'DEBUG' as const,
};

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp?: Date;
  data?: any;
  error?: Error;
}

export class ErrorLogger {
  private logLevel: LogLevel = 'ERROR';

  constructor(logLevel?: LogLevel) {
    this.logLevel = logLevel || 'ERROR';
  }

  log(entry: LogEntry): void {
    const logEntry = {
      ...entry,
      timestamp: new Date(),
    };

    switch (entry.level) {
      case 'ERROR':
        console.error(logEntry);
        break;
      case 'WARN':
        console.warn(logEntry);
        break;
      case 'INFO':
        console.info(logEntry);
        break;
      case 'DEBUG':
        console.debug(logEntry);
        break;
      default:
        console.log(logEntry);
    }
  }

  error(message: string, data?: any, error?: Error): void {
    this.log({ level: 'ERROR', message, data, error });
  }

  warn(message: string, data?: any): void {
    this.log({ level: 'WARN', message, data });
  }

  info(message: string, data?: any): void {
    this.log({ level: 'INFO', message, data });
  }

  debug(message: string, data?: any): void {
    this.log({ level: 'DEBUG', message, data });
  }
}

export const errorLogger = new ErrorLogger();