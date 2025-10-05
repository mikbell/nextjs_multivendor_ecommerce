// Common utility types
export type SortOrder = "asc" | "desc";

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface SearchParams {
  search?: string;
  category?: string;
  subCategory?: string;
  offer?: string;
  size?: string;
  sort?: string;
}

// Generic API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Form state types
export interface FormState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Image upload types
export interface ImageUploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
}

// Country data structure
export interface Country {
  name: string;
  code: string;
  city: string;
  region: string;
}

// Dashboard sidebar interface
export interface DashboardSidebarMenuItem {
  label: string;
  icon: string;
  link: string;
  children?: DashboardSidebarMenuItem[];
}

// Filter types
export type FilterValue = string | number | boolean | null;

export interface Filter {
  key: string;
  value: FilterValue;
  operator?: 'equals' | 'contains' | 'gt' | 'gte' | 'lt' | 'lte' | 'in';
}

// Table types
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableState {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  filters: Filter[];
}

// Date range type
export interface DateRange {
  from: Date | null;
  to: Date | null;
}