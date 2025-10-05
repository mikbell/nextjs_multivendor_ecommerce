import {
  cart as Cart,
  cartitem as CartItem,
  color as Color,
  freeshipping as FreeShipping,
  freeshippingcountry as FreeShippingCountry,
  productvariantimage as ProductVariantImage,
  review as Review,
  reviewimage as ReviewImage,
  shippingaddress as ShippingAddress,
  shippingrate as ShippingRate,
  size as Size,
  user as User,
  country as Country,
  coupon as Coupon,
  store as Store,
  ordergroup as OrderGroup,
  orderitem as OrderItem,
  category as Category,
  subcategory as SubCategory,
  product_shippingFeeMethod,
} from "@prisma/client";

// Re-export Prisma types for convenience
export type {
  Cart,
  CartItem,
  Color,
  FreeShipping,
  FreeShippingCountry,
  ProductVariantImage,
  Review,
  ReviewImage,
  ShippingAddress,
  ShippingRate,
  Size,
  User,
  Country,
  Coupon,
  Store,
  OrderGroup,
  OrderItem,
  Category,
  SubCategory,
  product_shippingFeeMethod,
};

// Enhanced types with relationships
export type CartWithItems = Cart & {
  cartItems: CartItem[];
  coupon: (Coupon & { store: Store }) | null;
};

export type UserWithShippingAddress = ShippingAddress & {
  country: Country;
  user: User;
};

export type ReviewWithDetails = Review & {
  images: ReviewImage[];
  user: User;
};

export type OrderGroupWithItems = OrderGroup & {
  items: OrderItem[];
  store: Store;
  _count: {
    items: number;
  };
  coupon: Coupon | null;
};

export type FreeShippingWithCountries = FreeShipping & {
  eligibaleCountries: FreeShippingCountry[];
};

export type CategoryWithSubCategories = Category & {
  subCategories: SubCategory[];
};