/**
 * Authentication configuration
 */

export interface AuthConfig {
  sessionSecret: string;
  sessionMaxAge: number;
  jwtSecret: string;
  jwtExpiration: string;
  bcryptRounds: number;
  providers: {
    google?: {
      clientId: string;
      clientSecret: string;
    };
    github?: {
      clientId: string;
      clientSecret: string;
    };
  };
}

export const authConfig: AuthConfig = {
  sessionSecret: process.env.NEXTAUTH_SECRET || 'fallback-secret',
  sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE || '86400'), // 24 hours
  jwtSecret: process.env.JWT_SECRET || 'fallback-jwt-secret',
  jwtExpiration: process.env.JWT_EXPIRATION || '1d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  providers: {
    google: process.env.GOOGLE_CLIENT_ID ? {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    } : undefined,
    github: process.env.GITHUB_CLIENT_ID ? {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    } : undefined,
  },
};