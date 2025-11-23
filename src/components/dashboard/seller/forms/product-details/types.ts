import { Category, Country, SubCategory } from "@prisma/client";
import { UseFormReturn } from "react-hook-form";
import { ProductFormSchema } from "@/lib/schemas";
import { ProductWithVariantType } from "@/lib/types";
import * as z from "zod";

// Type for the form data
export type ProductFormData = z.input<typeof ProductFormSchema>;

// Base props that most form components need
export interface BaseFormProps {
  form: UseFormReturn<ProductFormData>;
  isLoading: boolean;
  isNewVariantPage: boolean;
}

// Props for the main ProductDetails component
export interface ProductDetailsProps {
  data?: Partial<ProductWithVariantType>;
  categories: Category[];
  subcategories: SubCategory[];
  storeUrl: string;
  countries: Country[];
}

// Props for ProductBasicInfo component
export interface ProductBasicInfoProps extends BaseFormProps {
  data: Partial<ProductWithVariantType> | undefined;
  categories: Category[];
  subcategories: SubCategory[];
  subCategories: SubCategory[];
}

// Props for ProductImages component
export type ProductImagesProps = BaseFormProps;

// Props for VariantDetails component
export interface VariantDetailsProps extends BaseFormProps {
  colors: { color: string }[];
  setColors: (colors: { color: string }[]) => void;
  sizes: { size: string; price: number; quantity: number; discount: number }[];
  setSizes: (sizes: { size: string; price: number; quantity: number; discount: number }[]) => void;
  keywords: string[];
  setKeywords: (keywords: string[]) => void;
  handleAddition: (tag: { id: string; className: string; [key: string]: string }) => void;
  handleDeleteKeyword: (index: number) => void;
}

// Props for ProductSpecs component
export interface ProductSpecsProps extends BaseFormProps {
  productSpecs: { name: string; value: string }[];
  setProductSpecs: (specs: { name: string; value: string }[]) => void;
  variantSpecs: { name: string; value: string }[];
  setVariantSpecs: (specs: { name: string; value: string }[]) => void;
  questions: { question: string; answer: string }[];
  setQuestions: (questions: { question: string; answer: string }[]) => void;
}

// Props for ShippingSettings component
export interface ShippingSettingsProps extends BaseFormProps {
  countries: Country[];
  countryOptions: { label: string; value: string }[];
  handleDeleteCountryFreeShipping: (index: number) => void;
}

// Props for FormProgress component
export interface FormProgressProps {
  formProgress: number;
  isNewVariantPage: boolean;
}

// Props for QualityChecks component
export interface QualityChecksProps {
  qualityChecks: {
    checks: Record<string, boolean>;
    passedChecks: number;
    totalChecks: number;
    score: number;
  };
}

// Country option type
export type CountryOption = {
  label: string;
  value: string;
};

// Quality check structure
export interface QualityCheck {
  hasGoodTitle: boolean;
  hasDetailedDescription: boolean;
  hasEnoughImages: boolean;
  hasCompetitivePrice: boolean;
  hasStock: boolean;
  hasGoodKeywords: boolean;
  hasBrand: boolean;
  hasValidWeight: boolean;
}