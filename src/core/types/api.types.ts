// API related types
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface ApiSuccess<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiFailure {
  success: false;
  error: ApiError;
}

export type ApiResult<T = any> = ApiSuccess<T> | ApiFailure;

// Request types
export interface CreateCategoryRequest {
  name: string;
  image: { url: string }[];
  url: string;
  slug: string;
  description: string;
  featured: boolean;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: string;
}

export interface CreateSubCategoryRequest {
  name: string;
  image: { url: string }[];
  url: string;
  slug: string;
  description: string;
  featured: boolean;
  categoryId: string;
}

export interface UpdateSubCategoryRequest extends Partial<CreateSubCategoryRequest> {
  id: string;
}

export interface CreateStoreRequest {
  name: string;
  description: string;
  email: string;
  phone: string;
  logo: string;
  cover: string;
  slug: string;
  featured?: boolean;
  returnPolicy: string;
  defaultShippingService: string;
  defaultShippingFee: number;
  defaultDeliveryTimeMin: number;
  defaultDeliveryTimeMax: number;
}

export interface UpdateStoreRequest extends Partial<CreateStoreRequest> {
  id: string;
}

// Response types
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}