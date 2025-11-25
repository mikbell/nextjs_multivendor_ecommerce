type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
  stack?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, data?: unknown): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
    };

    if (data) {
      entry.data = data;
    }

    if (data instanceof Error) {
      entry.stack = data.stack;
    }

    return entry;
  }

  private output(entry: LogEntry) {
    if (this.isDevelopment) {
      const color = this.getColor(entry.level);
      console.log(
        `${color}[${entry.level.toUpperCase()}]${this.getColor('reset')} ${entry.timestamp} - ${entry.message}`,
        entry.data ? entry.data : ''
      );
    } else {
      // In production, you might want to send to a logging service
      console.log(JSON.stringify(entry));
    }
  }

  private getColor(level: LogLevel | 'reset'): string {
    const colors = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m',  // Green
      warn: '\x1b[33m',  // Yellow
      error: '\x1b[31m', // Red
      reset: '\x1b[0m'   // Reset
    };
    return colors[level] || colors.reset;
  }

  debug(message: string, data?: unknown) {
    this.output(this.formatMessage('debug', message, data));
  }

  info(message: string, data?: unknown) {
    this.output(this.formatMessage('info', message, data));
  }

  warn(message: string, data?: unknown) {
    this.output(this.formatMessage('warn', message, data));
  }

  error(message: string, error?: unknown) {
    this.output(this.formatMessage('error', message, error));
  }
}

export const logger = new Logger();