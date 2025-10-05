"use server";

import { db } from "@/lib/db";
import {
	ProductSimpleVariantType,
	ProductSize,
	ProductType,
	ProductWithVariants,
	SimpleProduct,
	VariantImageType,
} from "@/lib/types";

type FormatType = "simple" | "full";

type Param = {
	property: "category" | "subCategory" | "offer";
	value: string;
	type: FormatType;
};

type PropertyMapping = {
	[key: string]: string;
};

export const getHomeDataDynamic = async (
	params: Param[]
): Promise<Record<string, SimpleProduct[] | ProductType[]>> => {
	if (!Array.isArray(params) || params.length === 0) {
		throw new Error("Invalid input: params must be a non-empty array.");
	}

	// Define mappings for property names to database fields
	const propertyMapping: PropertyMapping = {
		category: "category.slug",
		subCategory: "subCategory.slug",
		offer: "offerTag.slug",
	};

	const mapProperty = (property: string): string => {
		if (!propertyMapping[property]) {
			throw new Error(
				`Invalid property: ${property}. Must be one of: category, subCategory, offer.`
			);
		}
		return propertyMapping[property];
	};

	// GetCheapestSize
	const getCheapestSize = (
		sizes: ProductSize[]
	): { discountedPrice: number } => {
		if (sizes.length === 0) {
			return { discountedPrice: 0 };
		}

		const sizesWithDiscount = sizes.map((size) => ({
			...size,
			discountedPrice: size.price * (1 - size.discount / 100),
		}));

		const sortedSizes = sizesWithDiscount.sort(
			(a, b) => a.discountedPrice - b.discountedPrice
		);
		return sortedSizes[0] || { discountedPrice: 0 };
	};

	const formatProductData = (
		products: ProductWithVariants[],
		type: FormatType
	): SimpleProduct[] | ProductType[] => {
		if (type === "simple") {
			return products.map((product) => {
				const variant = product.variants[0];
				if (!variant) {
					throw new Error(`Product ${product.name} has no variants`);
				}
				const cheapestSize = getCheapestSize(variant.sizes);
				const image = variant.images[0];
				return {
					name: product.name,
					slug: product.slug,
					variantName: variant.variantName,
					variantSlug: variant.slug,
					price: cheapestSize.discountedPrice,
					image: image?.url || '',
				} as SimpleProduct;
			});
		} else if (type === "full") {
			return products.map((product) => {
				// Transform the filtered variants into the VariantSimplified structure
				const variants: ProductSimpleVariantType[] = product.variants.map(
					(variant) => ({
						variantId: variant.id,
						variantSlug: variant.slug,
						variantName: variant.variantName,
						variantImage: variant.variantImage,
						images: variant.images,
						sizes: variant.sizes,
					})
				);

				// Extract variant images for the product
				const variantImages: VariantImageType[] = variants.map((variant) => ({
					url: `/product/${product.slug}/${variant.variantSlug}`,
					image: variant.variantImage
						? variant.variantImage
						: variant.images[0]?.url || '',
				}));

				return {
					id: product.id,
					slug: product.slug,
					name: product.name,
					rating: product.rating,
					sales: product.sales,
					numReviews: product.numReviews,
					variants,
					variantImages,
				} as ProductType;
			});
		} else {
			throw new Error("Invalid type: must be 'simple' or 'full'.");
		}
	};

	const results = await Promise.all(
		params.map(async ({ property, value, type }) => {
			const dbField = mapProperty(property);

			// Construct the 'where' clause based on the dbField
			let whereClause: any = {};
			if (dbField === "offerTag.slug") {
				whereClause = { offerTag: { slug: value } };
			} else if (dbField === "category.slug") {
				whereClause = { category: { slug: value } };
			} else if (dbField === "subCategory.slug") {
				whereClause = { subCategory: { slug: value } };
			}

			// Query products based on the constructed where clause
			const products = await db.product.findMany({
				where: whereClause,
				select: {
					id: true,
					slug: true,
					name: true,
					rating: true,
					sales: true,
					numReviews: true,
				// Removed variants relation as it doesn't exist in current schema
				},
			});

			// Simplified data formatting (temporary fix)
			const formattedData = products;

			// Determine the output key based on the property and value
			const outputKey = `products_${value.replace(/-/g, "_")}`;

			return { [outputKey]: formattedData };
		})
	);

	return results.reduce((acc, result) => ({ ...acc, ...result }), {}) as any;
};

export const getHomeFeaturedCategories = async () => {
	const featuredCategories = await db.category.findMany({
		where: {
			featured: true,
		},
		select: {
			id: true,
			name: true,
			slug: true,
			image: true,
			// Removed subCategories and _count relations as they don't exist in current schema
		},
		orderBy: {
			updatedAt: "desc",
		},
		take: 6, // Limit categories to 6
	});

	return featuredCategories.map((category) => ({
		id: category.id,
		name: category.name,
		slug: category.slug,
		image: category.image,
		// Removed productCount and subCategories as relations don't exist in current schema
	}));
};
