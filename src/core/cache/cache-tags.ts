/**
 * Cache tags for Next.js cache invalidation
 */

export const CACHE_TAGS = {
  PRODUCTS: 'products',
  PRODUCT: (id: string) => `product-${id}`,
  CATEGORIES: 'categories',
  CATEGORY: (id: string) => `category-${id}`,
  USERS: 'users',
  USER: (id: string) => `user-${id}`,
  ORDERS: 'orders',
  ORDER: (id: string) => `order-${id}`,
  SEARCH: 'search',
  REVIEWS: 'reviews',
  REVIEW: (id: string) => `review-${id}`,
} as const;

export type CacheTag = typeof CACHE_TAGS[keyof typeof CACHE_TAGS] | string;