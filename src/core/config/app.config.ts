// Application configuration
export const APP_CONFIG = {
  name: "Multivendor E-commerce",
  version: "1.0.0",
  description: "Platform e-commerce multivendor moderna",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  
  // Feature flags
  features: {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
    enableNotifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === "true",
    enableRealtimeUpdates: process.env.NEXT_PUBLIC_ENABLE_REALTIME === "true",
    maintenanceMode: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true",
  },

  // Pagination defaults
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
    pageSizeOptions: [10, 20, 50, 100],
  },

  // File upload limits
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    maxImageWidth: 2048,
    maxImageHeight: 2048,
  },

  // Search configuration
  search: {
    minQueryLength: 2,
    maxResults: 50,
    debounceMs: 300,
  },

  // Performance settings
  performance: {
    cacheExpiration: {
      short: 5 * 60, // 5 minutes
      medium: 30 * 60, // 30 minutes
      long: 24 * 60 * 60, // 24 hours
    },
    requestTimeout: 30000, // 30 seconds
  },
} as const;

// Environment check utilities
export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";
export const isTesting = process.env.NODE_ENV === "test";

// URL builders
export const buildApiUrl = (path: string) => 
  `${APP_CONFIG.url}/api${path.startsWith("/") ? path : `/${path}`}`;

export const buildAssetUrl = (path: string) => 
  `${APP_CONFIG.url}${path.startsWith("/") ? path : `/${path}`}`;

// Validation helpers
export const validateEnvironment = () => {
  const requiredEnvVars = [
    "DATABASE_URL",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "CLERK_SECRET_KEY",
  ];

  const missingVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
};