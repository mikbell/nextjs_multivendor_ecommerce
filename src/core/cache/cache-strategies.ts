/**
 * Cache strategies for different data types
 */

export interface CacheStrategy {
  ttl: number; // Time to live in seconds
  staleWhileRevalidate?: boolean;
  tags?: string[];
}

export const cacheStrategies = {
  // Product data - cache for 5 minutes
  products: {
    ttl: 300,
    staleWhileRevalidate: true,
    tags: ['products'],
  } as CacheStrategy,

  // Categories - cache for 30 minutes (less frequent changes)
  categories: {
    ttl: 1800,
    staleWhileRevalidate: true,
    tags: ['categories'],
  } as CacheStrategy,

  // User data - cache for 1 minute (more sensitive)
  user: {
    ttl: 60,
    staleWhileRevalidate: false,
    tags: ['user'],
  } as CacheStrategy,

  // Search results - cache for 2 minutes
  search: {
    ttl: 120,
    staleWhileRevalidate: true,
    tags: ['search'],
  } as CacheStrategy,
};