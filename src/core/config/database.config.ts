/**
 * Database configuration
 */

export interface DatabaseConfig {
  url: string;
  maxConnections?: number;
  connectionTimeout?: number;
  queryTimeout?: number;
  ssl?: boolean;
}

export const databaseConfig: DatabaseConfig = {
  url: process.env.DATABASE_URL || '',
  maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10'),
  connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '30000'),
  queryTimeout: parseInt(process.env.DB_QUERY_TIMEOUT || '60000'),
  ssl: process.env.NODE_ENV === 'production',
};