import { unstable_cache as nextCache } from 'next/cache';
import { APP_CONFIG } from '@/core/config';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
  revalidate?: false | number; // Next.js revalidation
  staleWhileRevalidate?: boolean; // Return stale data while revalidating
}

export interface CacheAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;
  delete(key: string): Promise<void>;
  deleteByTag(tag: string): Promise<void>;
  clear(): Promise<void>;
  exists(key: string): Promise<boolean>;
}

class InMemoryCacheAdapter implements CacheAdapter {
  private cache = new Map<string, { value: any; expiry?: number; tags?: string[] }>();
  private tagToKeys = new Map<string, Set<string>>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check expiry
    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      this.removeFromTags(key, item.tags);
      return null;
    }

    return item.value;
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    const expiry = options?.ttl ? Date.now() + (options.ttl * 1000) : undefined;
    
    // Remove from old tags if key exists
    const existing = this.cache.get(key);
    if (existing?.tags) {
      this.removeFromTags(key, existing.tags);
    }

    this.cache.set(key, { value, expiry, tags: options?.tags });

    // Update tag mappings
    if (options?.tags) {
      for (const tag of options.tags) {
        if (!this.tagToKeys.has(tag)) {
          this.tagToKeys.set(tag, new Set());
        }
        this.tagToKeys.get(tag)!.add(key);
      }
    }
  }

  async delete(key: string): Promise<void> {
    const item = this.cache.get(key);
    this.cache.delete(key);
    
    if (item?.tags) {
      this.removeFromTags(key, item.tags);
    }
  }

  async deleteByTag(tag: string): Promise<void> {
    const keys = this.tagToKeys.get(tag);
    if (keys) {
      for (const key of keys) {
        this.cache.delete(key);
      }
      this.tagToKeys.delete(tag);
    }
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.tagToKeys.clear();
  }

  async exists(key: string): Promise<boolean> {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      this.removeFromTags(key, item.tags);
      return false;
    }
    
    return true;
  }

  private removeFromTags(key: string, tags?: string[]): void {
    if (tags) {
      for (const tag of tags) {
        const keys = this.tagToKeys.get(tag);
        if (keys) {
          keys.delete(key);
          if (keys.size === 0) {
            this.tagToKeys.delete(tag);
          }
        }
      }
    }
  }
}

export class CacheManager {
  private adapter: CacheAdapter;
  private readonly defaultTTL = APP_CONFIG.performance.cacheExpiration.medium;

  constructor(adapter?: CacheAdapter) {
    this.adapter = adapter || new InMemoryCacheAdapter();
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      return await this.adapter.get<T>(key);
    } catch (error) {
      console.error(`Cache get error for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    try {
      const cacheOptions = {
        ttl: this.defaultTTL,
        ...options,
      };
      
      await this.adapter.set(key, value, cacheOptions);
    } catch (error) {
      console.error(`Cache set error for key "${key}":`, error);
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    try {
      await this.adapter.delete(key);
    } catch (error) {
      console.error(`Cache delete error for key "${key}":`, error);
    }
  }

  /**
   * Delete all values with a specific tag
   */
  async deleteByTag(tag: string): Promise<void> {
    try {
      await this.adapter.deleteByTag(tag);
    } catch (error) {
      console.error(`Cache delete by tag error for tag "${tag}":`, error);
    }
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    try {
      await this.adapter.clear();
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  /**
   * Check if key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    try {
      return await this.adapter.exists(key);
    } catch (error) {
      console.error(`Cache exists error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Get or set pattern - retrieve from cache or compute and store
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      // Not in cache, compute value
      const value = await factory();
      
      // Store in cache
      await this.set(key, value, options);
      
      return value;
    } catch (error) {
      console.error(`Cache getOrSet error for key "${key}":`, error);
      // Fallback to direct factory call
      return factory();
    }
  }

  /**
   * Wrap a function with caching using Next.js unstable_cache
   */
  unstable_cache<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    keyParts?: string[],
    options?: {
      revalidate?: number | false;
      tags?: string[];
    }
  ): T {
    return nextCache(fn, keyParts, options) as T;
  }

  /**
   * Create a cached version of a function
   */
  memoize<TArgs extends any[], TReturn>(
    fn: (...args: TArgs) => Promise<TReturn>,
    keyGenerator: (...args: TArgs) => string,
    options?: CacheOptions
  ): (...args: TArgs) => Promise<TReturn> {
    return async (...args: TArgs): Promise<TReturn> => {
      const key = keyGenerator(...args);
      
      return this.getOrSet(
        key,
        () => fn(...args),
        options
      );
    };
  }
}

// Global cache instance
export const cacheManager = new CacheManager();

// Pre-configured cache instances for different use cases
export const shortCache = {
  get: <T>(key: string) => cacheManager.get<T>(key),
  set: <T>(key: string, value: T, tags?: string[]) => 
    cacheManager.set(key, value, { 
      ttl: APP_CONFIG.performance.cacheExpiration.short, 
      tags 
    }),
  delete: (key: string) => cacheManager.delete(key),
  deleteByTag: (tag: string) => cacheManager.deleteByTag(tag),
};

export const mediumCache = {
  get: <T>(key: string) => cacheManager.get<T>(key),
  set: <T>(key: string, value: T, tags?: string[]) => 
    cacheManager.set(key, value, { 
      ttl: APP_CONFIG.performance.cacheExpiration.medium, 
      tags 
    }),
  delete: (key: string) => cacheManager.delete(key),
  deleteByTag: (tag: string) => cacheManager.deleteByTag(tag),
};

export const longCache = {
  get: <T>(key: string) => cacheManager.get<T>(key),
  set: <T>(key: string, value: T, tags?: string[]) => 
    cacheManager.set(key, value, { 
      ttl: APP_CONFIG.performance.cacheExpiration.long, 
      tags 
    }),
  delete: (key: string) => cacheManager.delete(key),
  deleteByTag: (tag: string) => cacheManager.deleteByTag(tag),
};