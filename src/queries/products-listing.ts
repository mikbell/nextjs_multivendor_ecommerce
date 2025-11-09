"use server";

import { db } from "@/lib/db";

interface ProductFilters {
	categoryId?: string;
	subCategoryId?: string;
	minPrice?: number;
	maxPrice?: number;
	search?: string;
	sortBy?: "price_asc" | "price_desc" | "rating" | "newest" | "popular";
	page?: number;
	pageSize?: number;
}

export const getProductsListing = async (filters: ProductFilters = {}) => {
	const {
		categoryId,
		subCategoryId,
		minPrice,
		maxPrice,
		search,
		sortBy = "popular",
		page = 1,
		pageSize = 24,
	} = filters;

	// Build where clause
	const whereClause: any = {
		isActive: true,
	};

	if (categoryId) {
		whereClause.categoryId = categoryId;
	}

	if (subCategoryId) {
		whereClause.subCategoryId = subCategoryId;
	}

	if (search) {
		whereClause.OR = [
			{ name: { contains: search, mode: "insensitive" } },
			{ description: { contains: search, mode: "insensitive" } },
			{ brand: { contains: search, mode: "insensitive" } },
		];
	}

	// Build orderBy clause
	let orderBy: any = {};
	switch (sortBy) {
		case "price_asc":
			orderBy = { variants: { _count: "desc" } }; // Placeholder, price sorting needs variant query
			break;
		case "price_desc":
			orderBy = { variants: { _count: "desc" } }; // Placeholder
			break;
		case "rating":
			orderBy = { rating: "desc" };
			break;
		case "newest":
			orderBy = { createdAt: "desc" };
			break;
		case "popular":
		default:
			orderBy = [{ sales: "desc" }, { rating: "desc" }];
			break;
	}

	// Get total count for pagination
	const totalCount = await db.product.count({ where: whereClause });

	// Get products
	const products = await db.product.findMany({
		where: whereClause,
		select: {
			id: true,
			name: true,
			slug: true,
			rating: true,
			numReviews: true,
			sales: true,
			brand: true,
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
		orderBy,
		skip: (page - 1) * pageSize,
		take: pageSize,
	});

	const productsWithPrices = products
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
				brand: product.brand,
				variantSlug: variant.slug,
				image: image?.url || variant.variantImage || "",
				price,
				originalPrice: size?.price || 0,
				discount: size?.discount || 0,
			};
		});

	// Filter by price if specified
	let filteredProducts = productsWithPrices;
	if (minPrice !== undefined || maxPrice !== undefined) {
		filteredProducts = productsWithPrices.filter((p) => {
			if (minPrice !== undefined && p.price < minPrice) return false;
			if (maxPrice !== undefined && p.price > maxPrice) return false;
			return true;
		});
	}

	// Sort by price if needed (since we couldn't do it in the query)
	if (sortBy === "price_asc") {
		filteredProducts.sort((a, b) => a.price - b.price);
	} else if (sortBy === "price_desc") {
		filteredProducts.sort((a, b) => b.price - a.price);
	}

	const totalPages = Math.ceil(totalCount / pageSize);

	return {
		products: filteredProducts,
		pagination: {
			page,
			pageSize,
			totalPages,
			totalCount,
		},
	};
};

export const getAllCategories = async () => {
	return await db.category.findMany({
		select: {
			id: true,
			name: true,
			slug: true,
			image: true,
			_count: {
				select: {
					products: true,
				},
			},
		},
		orderBy: {
			name: "asc",
		},
	});
};

export const getPriceRange = async () => {
	// Get all active products with their cheapest variant prices
	const products = await db.product.findMany({
		where: { isActive: true },
		select: {
			variants: {
				where: { isActive: true },
				select: {
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
			},
		},
	});

	const prices = products
		.flatMap((p) =>
			p.variants.flatMap((v) =>
				v.sizes.map((s) => s.price * (1 - s.discount / 100))
			)
		)
		.filter((price) => price > 0);

	if (prices.length === 0) {
		return { min: 0, max: 1000 };
	}

	return {
		min: Math.floor(Math.min(...prices)),
		max: Math.ceil(Math.max(...prices)),
	};
};
