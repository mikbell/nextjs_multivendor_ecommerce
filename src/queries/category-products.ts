"use server";

import { db } from "@/lib/db";

export const getCategoryBySlug = async (slug: string) => {
	const category = await db.category.findUnique({
		where: { slug },
		select: {
			id: true,
			name: true,
			slug: true,
			description: true,
			image: true,
		},
	});

	return category;
};

export const getCategoryProducts = async (categorySlug: string) => {
	const category = await db.category.findUnique({
		where: { slug: categorySlug },
	});

	if (!category) return [];

	const products = await db.product.findMany({
		where: {
			categoryId: category.id,
			isActive: true,
		},
		select: {
			id: true,
			name: true,
			slug: true,
			rating: true,
			numReviews: true,
			sales: true,
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
