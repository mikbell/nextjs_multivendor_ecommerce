import { z } from 'zod';

// Base schemas
export const IdSchema = z.string().min(1, 'ID is required');
export const EmailSchema = z.string().email('Invalid email format');
export const UrlSchema = z.string().url('Invalid URL format');
export const SlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format');

// Pagination schema
export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// User schemas
export const UserRoleSchema = z.enum(['USER', 'SELLER', 'ADMIN']);

export const CreateUserSchema = z.object({
  email: EmailSchema,
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  picture: z.string().url('Invalid picture URL'),
  role: UserRoleSchema.default('USER'),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  picture: z.string().url('Invalid picture URL').optional(),
  role: UserRoleSchema.optional(),
});

// Product schemas
export const ProductStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'DRAFT']);
export const ShippingFeeMethodSchema = z.enum(['ITEM', 'WEIGHT', 'FIXED']);

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200, 'Name too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  brand: z.string().min(1, 'Brand is required').max(100, 'Brand too long'),
  categoryId: IdSchema,
  subCategoryId: IdSchema,
  storeId: IdSchema,
  offerTagId: IdSchema.optional(),
  shippingFeeMethod: ShippingFeeMethodSchema.default('ITEM'),
  freeShippingForAllCountries: z.boolean().default(false),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const ProductFilterSchema = z.object({
  categoryId: IdSchema.optional(),
  subCategoryId: IdSchema.optional(),
  storeId: IdSchema.optional(),
  featured: z.boolean().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  search: z.string().optional(),
  inStock: z.boolean().optional(),
});

// Product variant schemas
export const CreateProductVariantSchema = z.object({
  variantName: z.string().min(1, 'Variant name is required'),
  variantDescription: z.string().optional(),
  variantImage: UrlSchema,
  sku: z.string().min(1, 'SKU is required'),
  weight: z.number().min(0, 'Weight must be positive'),
  keywords: z.string().optional(),
  isSale: z.boolean().default(false),
  saleEndDate: z.string().optional(),
});

export const UpdateProductVariantSchema = CreateProductVariantSchema.partial();

// Size schemas
export const CreateSizeSchema = z.object({
  size: z.string().min(1, 'Size is required'),
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
  price: z.number().min(0, 'Price must be positive'),
  discount: z.number().min(0).max(100, 'Discount must be between 0 and 100').default(0),
});

export const UpdateSizeSchema = CreateSizeSchema.partial();

// Color schemas
export const CreateColorSchema = z.object({
  name: z.string().min(1, 'Color name is required'),
  value: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color format'),
});

// Store schemas
export const StoreStatusSchema = z.enum(['PENDING', 'ACTIVE', 'BANNED', 'DISABLED']);

export const CreateStoreSchema = z.object({
  name: z.string().min(1, 'Store name is required').max(100, 'Name too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  email: EmailSchema,
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  logo: UrlSchema,
  cover: UrlSchema,
  url: z.string().min(1, 'URL is required'),
  returnPolicy: z.string().default('Return in 30 days.'),
  defaultShippingService: z.string().default('International Delivery'),
  defaultDeliveryTimeMin: z.number().int().min(1).default(7),
  defaultDeliveryTimeMax: z.number().int().min(1).default(31),
  defaultShippingFeeFixed: z.number().min(0).default(0),
  defaultShippingFeeForAdditionalItem: z.number().min(0).default(0),
  defaultShippingFeePerItem: z.number().min(0).default(0),
  defaultShippingFeePerKg: z.number().min(0).default(0),
});

export const UpdateStoreSchema = CreateStoreSchema.partial();

// Category schemas
export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Name too long'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  image: UrlSchema,
  featured: z.boolean().default(false),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

// Subcategory schemas
export const CreateSubCategorySchema = z.object({
  name: z.string().min(1, 'Subcategory name is required').max(100, 'Name too long'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  image: UrlSchema,
  featured: z.boolean().default(false),
  categoryId: IdSchema,
});

export const UpdateSubCategorySchema = CreateSubCategorySchema.partial();

// Order schemas
export const OrderStatusSchema = z.enum([
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'OutforDelivery',
  'Delivered',
  'Cancelled',
  'Failed',
  'Refunded',
  'Returned',
  'PartiallyShipped',
  'OnHold'
]);

export const PaymentStatusSchema = z.enum([
  'Pending',
  'Paid',
  'Failed',
  'Declined',
  'Cancelled',
  'Refunded',
  'PartiallyRefunded',
  'Chargeback'
]);

export const PaymentMethodSchema = z.enum(['Paypal', 'Stripe']);

export const CreateOrderSchema = z.object({
  shippingAddressId: IdSchema,
  paymentMethod: PaymentMethodSchema,
  items: z.array(z.object({
    productId: IdSchema,
    variantId: IdSchema,
    sizeId: IdSchema,
    quantity: z.number().int().min(1),
  })).min(1, 'At least one item is required'),
});

// Review schemas
export const CreateReviewSchema = z.object({
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  review: z.string().min(10, 'Review must be at least 10 characters').max(1000, 'Review too long'),
  productId: IdSchema,
  variantId: IdSchema,
  sizeId: IdSchema,
  color: z.string().optional(),
  quantity: z.string().optional(),
});

export const UpdateReviewSchema = CreateReviewSchema.partial();

// Cart schemas
export const AddToCartSchema = z.object({
  productId: IdSchema,
  variantId: IdSchema,
  sizeId: IdSchema,
  quantity: z.number().int().min(1).max(999),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(999),
});

// Shipping address schemas
export const CreateShippingAddressSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  address1: z.string().min(5, 'Address must be at least 5 characters'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required').max(50, 'City too long'),
  state: z.string().min(1, 'State is required').max(50, 'State too long'),
  zipCode: z.string().min(3, 'Zip code must be at least 3 characters').max(20, 'Zip code too long'),
  countryId: IdSchema,
  isDefault: z.boolean().default(false),
});

export const UpdateShippingAddressSchema = CreateShippingAddressSchema.partial();

// Wishlist schemas
export const AddToWishlistSchema = z.object({
  productId: IdSchema,
  variantId: IdSchema,
  sizeId: IdSchema.optional(),
});

// Search schemas
export const SearchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Query too long'),
  category: IdSchema.optional(),
  subCategory: IdSchema.optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sortBy: z.enum(['relevance', 'price', 'rating', 'newest']).default('relevance'),
});

// File upload schemas
export const ImageUploadSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' }),
  folder: z.string().optional(),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB default
});

// Export all schemas as a single object for easier imports
export const Schemas = {
  // Base
  Id: IdSchema,
  Email: EmailSchema,
  Url: UrlSchema,
  Slug: SlugSchema,
  Pagination: PaginationSchema,

  // User
  UserRole: UserRoleSchema,
  CreateUser: CreateUserSchema,
  UpdateUser: UpdateUserSchema,

  // Product
  ProductStatus: ProductStatusSchema,
  ShippingFeeMethod: ShippingFeeMethodSchema,
  CreateProduct: CreateProductSchema,
  UpdateProduct: UpdateProductSchema,
  ProductFilter: ProductFilterSchema,
  CreateProductVariant: CreateProductVariantSchema,
  UpdateProductVariant: UpdateProductVariantSchema,

  // Store
  StoreStatus: StoreStatusSchema,
  CreateStore: CreateStoreSchema,
  UpdateStore: UpdateStoreSchema,

  // Category
  CreateCategory: CreateCategorySchema,
  UpdateCategory: UpdateCategorySchema,
  CreateSubCategory: CreateSubCategorySchema,
  UpdateSubCategory: UpdateSubCategorySchema,

  // Order
  OrderStatus: OrderStatusSchema,
  PaymentStatus: PaymentStatusSchema,
  PaymentMethod: PaymentMethodSchema,
  CreateOrder: CreateOrderSchema,

  // Review
  CreateReview: CreateReviewSchema,
  UpdateReview: UpdateReviewSchema,

  // Cart
  AddToCart: AddToCartSchema,
  UpdateCartItem: UpdateCartItemSchema,

  // Shipping
  CreateShippingAddress: CreateShippingAddressSchema,
  UpdateShippingAddress: UpdateShippingAddressSchema,

  // Wishlist
  AddToWishlist: AddToWishlistSchema,

  // Search
  Search: SearchSchema,

  // Upload
  ImageUpload: ImageUploadSchema,

  // Size and Color
  CreateSize: CreateSizeSchema,
  UpdateSize: UpdateSizeSchema,
  CreateColor: CreateColorSchema,
} as const;