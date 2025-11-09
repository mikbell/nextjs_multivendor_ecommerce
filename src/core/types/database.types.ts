import {
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
  $Enums,
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
  $Enums,
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