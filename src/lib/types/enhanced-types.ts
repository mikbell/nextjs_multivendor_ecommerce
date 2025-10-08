// Enhanced TypeScript utilities and types

// Utility types for better type inference
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type NonNullable<T> = T extends null | undefined ? never : T;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Required<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object | undefined ? DeepRequired<NonNullable<T[P]>> : T[P];
};

// Brand types for better type safety
export type Brand<T, B> = T & { readonly __brand: B };

export type UserId = Brand<string, 'UserId'>;
export type ProductId = Brand<string, 'ProductId'>;
export type StoreId = Brand<string, 'StoreId'>;
export type CategoryId = Brand<string, 'CategoryId'>;
export type OrderId = Brand<string, 'OrderId'>;

// Helper to create branded types
export const createBrand = <T, B>(value: T): Brand<T, B> => value as Brand<T, B>;

// API Response wrapper with better type inference
export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
  pagination?: PaginationMeta;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
  timestamp: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// Type guards for API responses
export const isApiSuccess = <T>(response: ApiResponse<T>): response is ApiSuccess<T> => {
  return response.success === true;
};

export const isApiError = <T>(response: ApiResponse<T>): response is ApiError => {
  return response.success === false;
};

// Pagination meta
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form types with enhanced validation
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string[]>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  touchedFields: Partial<Record<keyof T, boolean>>;
}

// Event handler types
export type EventHandler<T = void> = (event: Event) => T | Promise<T>;
export type ChangeHandler<T> = (value: T) => void | Promise<void>;
export type SubmitHandler<T> = (data: T) => void | Promise<void>;

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

export interface InteractiveComponentProps extends BaseComponentProps {
  disabled?: boolean;
  loading?: boolean;
  onClick?: EventHandler;
}

// Database model types with enhanced safety
export interface TimestampedModel {
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDeleteModel extends TimestampedModel {
  deletedAt?: Date | null;
  isDeleted: boolean;
}

export interface AuditableModel extends TimestampedModel {
  createdBy?: UserId;
  updatedBy?: UserId;
}

// Query and filter types
export interface BaseQuery {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface DateRangeFilter {
  startDate?: Date;
  endDate?: Date;
}

// Error types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface BusinessError {
  code: string;
  message: string;
  context?: Record<string, unknown>;
}

// Generic CRUD operations
export interface CrudOperations<T, CreateData, UpdateData> {
  findById(id: string): Promise<T | null>;
  findAll(query?: BaseQuery): Promise<{ data: T[]; meta: PaginationMeta }>;
  create(data: CreateData): Promise<T>;
  update(id: string, data: UpdateData): Promise<T>;
  delete(id: string): Promise<void>;
  count(filters?: Record<string, unknown>): Promise<number>;
}

// Type-safe environment variables
export interface AppConfig {
  database: {
    url: string;
    ssl: boolean;
    maxConnections: number;
  };
  auth: {
    jwtSecret: string;
    sessionDuration: number;
    clerkPublishableKey: string;
    clerkSecretKey: string;
  };
  storage: {
    cloudinaryCloudName: string;
    cloudinaryApiKey: string;
    cloudinaryApiSecret: string;
  };
  redis: {
    url: string;
    password?: string;
  };
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    baseUrl: string;
  };
}

// Utility for type-safe object keys
export const typedKeys = <T extends Record<string, unknown>>(obj: T): Array<keyof T> => {
  return Object.keys(obj) as Array<keyof T>;
};

// Utility for type-safe object entries
export const typedEntries = <T extends Record<string, unknown>>(
  obj: T
): Array<[keyof T, T[keyof T]]> => {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
};

// Type-safe omit function
export const typedOmit = <T, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
};

// Type-safe pick function
export const typedPick = <T, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

// Runtime type checking utilities
export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const isArray = <T>(value: unknown, validator?: (item: unknown) => item is T): value is T[] => {
  if (!Array.isArray(value)) return false;
  if (!validator) return true;
  return value.every(validator);
};

// Type assertion with validation
export const assert = <T>(condition: unknown, message?: string): asserts condition is T => {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
};

// Enhanced error handling
export class TypedError<T = unknown> extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: T
  ) {
    super(message);
    this.name = 'TypedError';
  }
}

// Result type for better error handling
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

export const createSuccess = <T>(data: T): Result<T> => ({
  success: true,
  data,
});

export const createError = <T, E = Error>(error: E): Result<T, E> => ({
  success: false,
  error,
});

// Async Result type
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

// Type-safe localStorage wrapper
export interface TypedStorage {
  get<T>(key: string, defaultValue?: T): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
}

export const createTypedStorage = (): TypedStorage => ({
  get<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },

  clear(): void {
    localStorage.clear();
  },
});