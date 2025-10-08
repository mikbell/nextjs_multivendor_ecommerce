"use client";

// Import the new refactored component
import ProductDetailsForm from './product-details/ProductDetailsForm';
import { FC } from 'react';
import { category, country, offertag, subcategory } from "@prisma/client";
import { ProductWithVariantType } from "@/lib/types";

// Interface for backwards compatibility
interface ProductDetailsProps {
	data?: Partial<ProductWithVariantType>;
	categories: category[];
	subcategories: subcategory[];
	offerTags: offertag[];
	storeUrl: string;
	countries: country[];
}

// Wrapper component for backwards compatibility
const ProductDetails: FC<ProductDetailsProps> = (props) => {
	return <ProductDetailsForm {...props} />;
};

export default ProductDetails;