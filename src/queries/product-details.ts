"use server";

import { db } from "@/lib/db";

export const getProductDetails = async (
	productSlug: string,
	variantSlug: string
) => {
	const product = await db.product.findUnique({
		where: { slug: productSlug, isActive: true },
		select: {
			id: true,
			name: true,
			slug: true,
			description: true,
			brand: true,
			rating: true,
			numReviews: true,
			sales: true,
			category: {
				select: {
					id: true,
					name: true,
					slug: true,
				},
			},
			subCategory: {
				select: {
					id: true,
					name: true,
					slug: true,
				},
			},
			store: {
				select: {
					id: true,
					name: true,
					slug: true,
					logo: true,
					averageRating: true,
				},
			},
			variants: {
				where: { slug: variantSlug, isActive: true },
				select: {
					id: true,
					slug: true,
					variantName: true,
					variantDescription: true,
					variantImage: true,
					sku: true,
					weight: true,
					isSale: true,
					saleEndDate: true,
					images: {
						select: {
							id: true,
							url: true,
							alt: true,
						},
						orderBy: {
							order: "asc",
						},
					},
					sizes: {
						select: {
							id: true,
							size: true,
							price: true,
							discount: true,
							quantity: true,
						},
						orderBy: {
							price: "asc",
						},
					},
					colors: {
						select: {
							id: true,
							name: true,
						},
					},
					specs: {
						select: {
							id: true,
							name: true,
							value: true,
						},
					},
				},
			},
			specs: {
				select: {
					id: true,
					name: true,
					value: true,
				},
			},
			questions: {
				select: {
					id: true,
					question: true,
					answer: true,
				},
			},
		},
	});

	if (!product || product.variants.length === 0) {
		return null;
	}

	// Get all variants for this product (for variant selector)
	const allVariants = await db.productVariant.findMany({
		where: {
			productId: product.id,
			isActive: true,
		},
		select: {
			id: true,
			slug: true,
			variantName: true,
			variantImage: true,
		},
	});

	const variant = product.variants[0];

	return {
		...product,
		variant,
		allVariants,
	};
};

export const getRelatedProducts = async (
	categoryId: string,
	currentProductId: string
) => {
	const products = await db.product.findMany({
		where: {
			categoryId,
			isActive: true,
			NOT: {
				id: currentProductId,
			},
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
					slug: true,
					variantImage: true,
					images: {
						select: {
							url: true,
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
		take: 8,
		orderBy: [{ sales: "desc" }, { rating: "desc" }],
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
};
