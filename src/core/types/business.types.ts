import { Prisma, $Enums } from "@prisma/client";
import { ProductVariantImage, Size, Color } from "./database.types";

// Enums
export enum OrderStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Processing = "Processing",
  Shipped = "Shipped",
  OutforDelivery = "OutforDelivery",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
  Failed = "Failed",
  Refunded = "Refunded",
  Returned = "Returned",
  PartiallyShipped = "PartiallyShipped",
  OnHold = "OnHold",
}

export enum PaymentStatus {
  Pending = "Pending",
  Paid = "Paid",
  Failed = "Failed",
  Declined = "Declined",
  Cancelled = "Cancelled",
  Refunded = "Refunded",
  PartiallyRefunded = "PartiallyRefunded",
  Chargeback = "Chargeback",
}

export enum ProductStatus {
  Pending = "Pending",
  Processing = "Processing",
  ReadyForShipment = "ReadyForShipment",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Canceled = "Canceled",
  Returned = "Returned",
  Refunded = "Refunded",
  FailedDelivery = "FailedDelivery",
  OnHold = "OnHold",
  Backordered = "Backordered",
  PartiallyShipped = "PartiallyShipped",
  ExchangeRequested = "ExchangeRequested",
  AwaitingPickup = "AwaitingPickup",
}

export enum StoreStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  BANNED = "BANNED",
  DISABLED = "DISABLED",
}

// Product related types
export interface ProductVariant {
  variantId: string;
  variantSlug: string;
  variantName: string;
  images: ProductVariantImage[];
  sizes: Size[];
}

export interface ProductWithVariant {
  productId: string;
  variantId: string;
  name: string;
  description: string;
  variantName: string;
  variantDescription: string;
  images: { id?: string; url: string }[];
  variantImage: string;
  categoryId: string;
  offerTagId: string;
  subCategoryId: string;
  isSale: boolean;
  saleEndDate?: string;
  brand: string;
  sku: string;
  weight: number;
  colors: { id?: string; color: string }[];
  sizes: {
    id?: string;
    size: string;
    quantity: number;
    price: number;
    discount: number;
  }[];
  product_specs: { id?: string; name: string; value: string }[];
  variant_specs: { id?: string; name: string; value: string }[];
  keywords: string[];
  questions: { id?: string; question: string; answer: string }[];
  freeShippingForAllCountries: boolean;
  freeShippingCountriesIds: { id?: string; label: string; value: string }[];
  shippingFeeMethod: $Enums.ProductShippingFeeMethod;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductSimpleVariant {
  variantId: string;
  variantSlug: string;
  variantName: string;
  variantImage: string;
  images: ProductVariantImage[];
  sizes: Size[];
}

export interface ProductWithVariants {
  id: string;
  slug: string;
  name: string;
  rating: number;
  sales: number;
  numReviews: number;
  variants: {
    id: string;
    variantName: string;
    variantImage: string;
    slug: string;
    sizes: Size[];
    images: ProductVariantImage[];
  }[];
}

export interface SimpleProduct {
  name: string;
  slug: string;
  variantName: string;
  variantSlug: string;
  price: number;
  image: string;
}

// Cart related types
export interface CartProduct {
  productId: string;
  variantId: string;
  productSlug: string;
  variantSlug: string;
  name: string;
  variantName: string;
  image: string;
  variantImage: string;
  sizeId: string;
  size: string;
  quantity: number;
  price: number;
  stock: number;
  weight: number;
  shippingMethod: string;
  shippingService: string;
  shippingFee: number;
  extraShippingFee: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  isFreeShipping: boolean;
}

// Store related types
export interface StoreInfo {
  name: string;
  description: string;
  email: string;
  phone: string;
  logo: string;
  cover: string;
  url: string;
  defaultShippingService: string;
  defaultDeliveryTimeMax?: number;
  defaultDeliveryTimeMin?: number;
  defaultShippingFeeFixed?: number;
  defaultShippingFeeForAdditionalItem?: number;
  defaultShippingFeePerItem?: number;
  defaultShippingFeePerKg?: number;
  returnPolicy?: string;
}

export interface CountryWithShippingRates {
  countryId: string;
  countryName: string;
  shippingRate: {
    id: string;
    shippingService: string;
    shippingFeePerItem: number;
    shippingFeeForAdditionalItem: number;
    shippingFeePerKg: number;
    shippingFeeFixed: number;
    deliveryTimeMin: number;
    deliveryTimeMax: number;
    returnPolicy: string;
  };
}

// Review related types
export interface ReviewDetails {
  id: string;
  review: string;
  rating: number;
  images: { url: string }[];
  size: string;
  quantity: string;
  variant: string;
  color: string;
}

export interface ReviewFilters {
  rating?: number;
  hasImages?: boolean;
}

export interface ReviewOrder {
  orderBy: "latest" | "oldest" | "highest";
}

// Variant info
export interface VariantInfo {
  variantName: string;
  variantSlug: string;
  variantImage: string;
  variantUrl: string;
  images: ProductVariantImage[];
  sizes: Size[];
  colors: Partial<Color>[];
}

// Search result interface
export interface SearchResult {
  name: string;
  link: string;
  image: string;
}

// Filter types for various entities
export type OrderTableFilter =
  | ""
  | "unpaid"
  | "toShip"
  | "shipped"
  | "delivered";

export type OrderTableDateFilter =
  | ""
  | "last-6-months"
  | "last-1-year"
  | "last-2-years";

export type PaymentTableFilter = "" | "paypal" | "credit-card";

export type PaymentTableDateFilter =
  | ""
  | "last-6-months"
  | "last-1-year"
  | "last-2-years";

export type ReviewFilter = "5" | "4" | "3" | "2" | "1" | "";

export type ReviewDateFilter =
  | ""
  | "last-6-months"
  | "last-1-year"
  | "last-2-years";

// Product size interface
export interface ProductSize {
  size: string;
  price: number;
  discount: number;
  quantity: number;
}