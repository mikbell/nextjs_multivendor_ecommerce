"use server";

import { unstable_cache } from "next/cache";
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
					url: `/products/${product.slug}/${variant.variantSlug}`,
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
			let whereClause: Record<string, unknown> = {};
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

	return results.reduce((acc, result) => ({ ...acc, ...result }), {} as Record<string, unknown>);
};

export const getHomeFeaturedCategories = unstable_cache(
	async () => {
		const featuredCategories = await db.category.findMany({
			where: {
				featured: true,
			},
			select: {
				id: true,
				name: true,
				slug: true,
				image: true,
			},
			orderBy: {
				updatedAt: "desc",
			},
			take: 6,
		});

		return featuredCategories.map((category) => ({
			id: category.id,
			name: category.name,
			slug: category.slug,
			image: category.image,
		}));
	},
	["home-featured-categories"],
	{
		revalidate: 3600, // Cache for 1 hour
		tags: ["categories", "home"],
	}
);

export const getHomeFeaturedProducts = unstable_cache(
	async () => {
		const products = await db.product.findMany({
			where: {
				isActive: true,
			},
			select: {
				id: true,
				name: true,
				slug: true,
				rating: true,
				numReviews: true,
				variants: {
					where: {
						isActive: true,
					},
					select: {
						id: true,
						slug: true,
						variantName: true,
						variantImage: true,
						images: {
							select: {
								url: true,
								alt: true,
							},
							orderBy: {
								order: "asc",
							},
							take: 1,
						},
						sizes: {
							select: {
								price: true,
								discount: true,
							},
							orderBy: {
								price: "asc",
							},
							take: 1,
						},
					},
					take: 1,
				},
			},
			orderBy: [
				{ sales: "desc" },
				{ rating: "desc" },
			],
			take: 12,
		});

		return products
			.filter((p) => p.variants.length > 0)
			.map((product) => {
				const variant = product.variants[0];
				const size = variant.sizes[0];
				const image = variant.images[0];
				const price = size ? size.price * (1 - size.discount / 100) : 0;

				return {
					id: product.id,
					name: product.name,
					slug: product.slug,
					rating: product.rating,
					numReviews: product.numReviews,
					variantSlug: variant.slug,
					image: image?.url || variant.variantImage || "",
					price,
				};
			});
	},
	["home-featured-products"],
	{
		revalidate: 1800, // Cache for 30 minutes
		tags: ["products", "home"],
	}
);
