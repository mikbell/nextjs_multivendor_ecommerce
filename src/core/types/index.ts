// Core types - Sistema centralizzato di tipi TypeScript
export * from './database.types';
export * from './api.types';
export * from './auth.types';

// Common types (excluding Country to avoid conflicts)
export type {
  SortOrder,
  SelectOption,
  PaginationParams,
  SearchParams,
  ApiResponse,
  FormState,
  ImageUploadResult,
  DashboardSidebarMenuItem,
  FilterValue,
  Filter,
  TableColumn,
  TableState,
  DateRange
} from './common.types';

// Business types (renaming Country to avoid conflicts)
export type {
  OrderStatus,
  PaymentStatus,
  ProductStatus,
  StoreStatus,
  ProductVariant,
  ProductWithVariant,
  ProductSimpleVariant,
  ProductWithVariants,
  SimpleProduct,
  CartProduct,
  StoreInfo,
  CountryWithShippingRates as Country,
  ReviewDetails
} from './business.types';
