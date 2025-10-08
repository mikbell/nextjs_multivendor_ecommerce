import { PrismaClient } from '@prisma/client';
import { logger } from '@/lib/logger';

declare global {
  var __prisma: PrismaClient | undefined;
}

class DatabaseConnection {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!DatabaseConnection.instance) {
      if (process.env.NODE_ENV === 'production') {
        DatabaseConnection.instance = new PrismaClient({
          log: ['error'],
        });
      } else {
        if (!global.__prisma) {
          global.__prisma = new PrismaClient({
            log: ['query', 'info', 'warn', 'error'],
          });
        }
        DatabaseConnection.instance = global.__prisma;
      }

      // Add error handling
      DatabaseConnection.instance.$on('error', (e) => {
        logger.error('Database error:', e);
      });

      // Graceful shutdown
      process.on('beforeExit', async () => {
        await DatabaseConnection.instance.$disconnect();
      });
    }

    return DatabaseConnection.instance;
  }

  public static async disconnect(): Promise<void> {
    if (DatabaseConnection.instance) {
      await DatabaseConnection.instance.$disconnect();
    }
  }

  public static async healthCheck(): Promise<boolean> {
    try {
      await DatabaseConnection.instance.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error('Database health check failed:', error);
      return false;
    }
  }
}

export const db = DatabaseConnection.getInstance();
export { DatabaseConnection };