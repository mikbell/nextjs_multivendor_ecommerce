"use client";

// Import the new refactored component
import ProductDetailsForm from './product-details/ProductDetailsForm';
import { FC } from 'react';
import { Category, Country, OfferTag, SubCategory } from "@prisma/client";
import { ProductWithVariantType } from "@/lib/types";

// Interface for backwards compatibility
interface ProductDetailsProps {
	data?: Partial<ProductWithVariantType>;
	categories: Category[];
	subcategories: SubCategory[];
	offerTags: OfferTag[];
	storeUrl: string;
	countries: Country[];
}

// Wrapper component for backwards compatibility
const ProductDetails: FC<ProductDetailsProps> = (props) => {
	return <ProductDetailsForm {...props} />;
};

export default ProductDetails;