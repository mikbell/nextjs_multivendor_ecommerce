"use server";

import { db } from "@/lib/db";

// Function: getFilteredSizes
// Description: Retrieves all sizes that exist in a product based on the filters (category, subCategory, offer).
// Permission Level: Public
// Params: filters - an object containing category, subCategory, and offer as slugs.
// Returns: Array of sizes in the form {id: string, size: string}[].
export const getFilteredSizes = async (
	filters: {
		category?: string;
		subCategory?: string;
		offer?: string;
		slug?: string;
	},
	take = 10
) => {
	const { category, subCategory, offer, slug } = filters;

	let storeId: string | undefined;

	if (slug) {
		// Retrieve the storeId based on the slug
		const store = await db.store.findUnique({
			where: { slug: slug },
		});

		// If no store is found, return an empty array or handle as needed
		if (!store) {
			return { sizes: [], count: 0 };
		}

		storeId = store.id;
	}

	// Construct the query dynamically based on the available filters
	const sizes = await db.size.findMany({
		where: {
			productVariant: {
				product: {
					AND: [
						category ? { category: { slug: category } } : {},
						subCategory ? { subCategory: { slug: subCategory } } : {},
						offer ? { category: { slug: offer } } : {},
						storeId ? { store: { id: storeId } } : {},
					],
				},
			},
		},
		select: {
			size: true,
		},
		take,
	});

	// Get Sizes count
	const count = await db.size.count({
		where: {
			productVariant: {
				product: {
					AND: [
						category ? { category: { slug: category } } : {},
						subCategory ? { category: { slug: subCategory } } : {},
						offer ? { category: { slug: offer } } : {},
					],
				},
			},
		},
	});

	// Remove duplicate sizes
	const uniqueSizesArray = Array.from(new Set(sizes.map((size) => size.size)));

	// Define a custom order using a Map for fast lookups
	const sizeOrderMap = new Map(
		["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"].map(
			(size, index) => [size, index]
		)
	);

	// Custom sorting by sizeOrderMap, fallback to alphabetical if not found
	uniqueSizesArray.sort((a, b) => {
		return (
			(sizeOrderMap.get(a) ?? Infinity) - (sizeOrderMap.get(b) ?? Infinity) ||
			a.localeCompare(b)
		);
	});

	// Return the unique sizes in the desired format
	return {
		sizes: uniqueSizesArray.map((size) => ({ size })),
		count,
	};
};
