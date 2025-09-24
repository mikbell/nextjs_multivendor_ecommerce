"use server";

// DB
import { db } from "@/lib/db";
import { StoreDefaultShippingType, StoreStatus, StoreType } from "@/lib/types";

// Clerk
import { currentUser } from "@clerk/nextjs/server";

// Prisma models (generated)
import { ShippingRate, Store } from "@prisma/client";

// Function: upsertStore
// Description: Upserts store details into the database, ensuring uniqueness of name,slug, email, and phone number.
// Access Level: Seller Only
// Parameters:
//   - store: Partial store object containing details of the store to be upserted.
// Returns: Updated or newly created store details.
export const upsertStore = async (store: Store) => {
	try {
		// Get current user
		const user = await currentUser();

		// Ensure user is authenticated
		if (!user) throw new Error("Unauthenticated.");

		// Verify seller permission
		if (user.privateMetadata.role !== "SELLER")
			throw new Error(
				"Unauthorized Access: Seller Privileges Required for Entry."
			);

		// Ensure store data is provided
		if (!store) throw new Error("Please provide store data.");

		// Check if store with same name, email,slug, or phone number already exists
		const existingStore = await db.store.findFirst({
			where: {
				AND: [
					{
						OR: [
							{ name: store.name },
							{ email: store.email },
							{ phone: store.phone },
							{ slug: store.slug },
						],
					},
					{
						NOT: {
							id: store.id,
						},
					},
				],
			},
		});

		// If a store with same name, email, or phone number already exists, throw an error
		if (existingStore) {
			let errorMessage = "";
			if (existingStore.name === store.name) {
				errorMessage = "A store with the same name already exists";
			} else if (existingStore.email === store.email) {
				errorMessage = "A store with the same email already exists";
			} else if (existingStore.phone === store.phone) {
				errorMessage = "A store with the same phone number already exists";
			} else if (existingStore.slug === store.slug) {
				errorMessage = "A store with the same slug already exists";
			}
			throw new Error(errorMessage);
		}

		// Compute slug from name
		const slugify = (value: string) =>
			value
				.normalize("NFD")
				.replace(/\p{Diacritic}+/gu, "")
				.toLowerCase()
				.trim()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)+/g, "");
		const computedSlug = slugify(store.name);

		// Prepare payloads explicitly to avoid readonly/relational fields
		const updateData = {
			name: store.name,
			description: store.description,
			email: store.email,
			phone: store.phone,
			slug: store.slug,
			slug: computedSlug,
			logo: store.logo,
			cover: store.cover,
			status: store.status,
			averageRating: store.averageRating,
			numReviews: store.numReviews,
			featured: store.featured,
			returnPolicy: store.returnPolicy,
			defaultShippingService: store.defaultShippingService,
			defaultShippingFeePerItem: store.defaultShippingFeePerItem,
			defaultShippingFeeForAdditionalItem:
				store.defaultShippingFeeForAdditionalItem,
			defaultShippingFeePerKg: store.defaultShippingFeePerKg,
			defaultShippingFeeFixed: store.defaultShippingFeeFixed,
			defaultDeliveryTimeMin: store.defaultDeliveryTimeMin,
			defaultDeliveryTimeMax: store.defaultDeliveryTimeMax,
		};
		const createData = {
			...updateData,
			user: { connect: { id: user.id } },
		};

		// Upsert store details into the database
		const storeDetails = await db.store.upsert({
			where: {
				id: store.id,
			},
			update: updateData,
			create: createData,
		});

		return storeDetails;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

// Function: getStoreDefaultShippingDetails
// Description: Fetches the default shipping details for a store based on the store slug.
// Parameters:
//   - storeSlug: The slug of the store to fetch default shipping details for.
// Returns: An object containing default shipping details, including shipping service, fees, delivery times, and return policy.
export const getStoreDefaultShippingDetails = async (storeSlug: string) => {
	try {
		// Ensure the store slug is provided
		if (!storeSlug) throw new Error("Store slug is required.");

		// Fetch the store and its default shipping details
		const store = await db.store.findUnique({
			where: {
				slug: storeSlug,
			},
			select: {
				defaultShippingService: true,
				defaultShippingFeePerItem: true,
				defaultShippingFeeForAdditionalItem: true,
				defaultShippingFeePerKg: true,
				defaultShippingFeeFixed: true,
				defaultDeliveryTimeMin: true,
				defaultDeliveryTimeMax: true,
				returnPolicy: true,
			},
		});

		// Throw an error if the store is not found
		if (!store) throw new Error("Store not found.");

		return store;
	} catch (error) {
		// Log and re-throw any errors
		console.log(error);
		throw error;
	}
};

// Function: updateStoreDefaultShippingDetails
// Description: Updates the default shipping details for a store based on the store slug.
// Parameters:
//   - storeSlug: The slug of the store to update.
//   - details: An object containing the new shipping details (shipping service, fees, delivery times, and return policy).
// Returns: The updated store object with the new default shipping details.
export const updateStoreDefaultShippingDetails = async (
	storeSlug: string,
	details: StoreDefaultShippingType
) => {
	try {
		// Get current user
		const user = await currentUser();

		// Ensure user is authenticated
		if (!user) throw new Error("Unauthenticated.");

		// Verify seller permission
		if (user.privateMetadata.role !== "SELLER")
			throw new Error(
				"Unauthorized Access: Seller Privileges Required for Entry."
			);

		// Ensure the store slug is provided
		if (!storeSlug) throw new Error("Store slug is required.");

		// Ensure at least one detail is provided for update
		if (!details) {
			throw new Error("No shipping details provided to update.");
		}
		// Make sure seller is updating their own store
		const check_ownership = await db.store.findUnique({
			where: {
				slug: storeSlug,
				userId: user.id,
			},
		});

		if (!check_ownership)
			throw new Error(
				"Make sure you have the permissions to update this store"
			);

		// Find and update the store based on storeSlug
		const updatedStore = await db.store.update({
			where: {
				slug: storeSlug,
				userId: user.id,
			},
			data: details,
		});

		return updatedStore;
	} catch (error) {
		// Log and re-throw any errors
		console.log(error);
		throw error;
	}
};

/**
 * Function: getStoreShippingRates
 * Description: Retrieves all countries and their shipping rates for a specific store.
 *              If a country does not have a shipping rate, it is still included in the result with a null shippingRate.
 * Permission Level: Public
 * Returns: Array of objects where each object contains a country and its associated shippingRate, sorted by country name.
 */
export const getStoreShippingRates = async (storeSlug: string) => {
	try {
		// Get current user
		const user = await currentUser();

		// Ensure user is authenticated
		if (!user) throw new Error("Unauthenticated.");

		// Verify seller permission
		if (user.privateMetadata.role !== "SELLER")
			throw new Error(
				"Unauthorized Access: Seller Privileges Required for Entry."
			);

		// Ensure the store slug is provided
		if (!storeSlug) throw new Error("Store slug is required.");

		// Make sure seller is updating their own store
		const check_ownership = await db.store.findUnique({
			where: {
				slug: storeSlug,
				userId: user.id,
			},
		});

		if (!check_ownership)
			throw new Error(
				"Make sure you have the permissions to update this store"
			);

		// Get store details
		const store = await db.store.findUnique({
			where: { slug: storeSlug, userId: user.id },
		});

		if (!store) throw new Error("Store could not be found.");

		// Retrieve all countries
		const countries = await db.country.findMany({
			orderBy: {
				name: "asc",
			},
		});

		// Retrieve all shipping rates for the specified store
		const shippingRates = await db.shippingRate.findMany({
			where: {
				storeId: store.id,
			},
		});

		// Create a map for quick lookup of shipping rates by country ID
		const rateMap = new Map();
		shippingRates.forEach((rate) => {
			rateMap.set(rate.countryId, rate);
		});

		// Map countries to their shipping rates
		const result = countries.map((country) => ({
			countryId: country.id,
			countryName: country.name,
			shippingRate: rateMap.get(country.id) || null,
		}));

		return result;
	} catch (error) {
		console.error("Error retrieving store shipping rates:", error);
		throw error;
	}
};

// Function: upsertShippingRate
// Description: Upserts a shipping rate for a specific country, updating if it exists or creating a new one if not.
// Permission Level: Seller only
// Parameters:
//   - storeSlug: slug of the store you are trying to update.
//   - shippingRate: ShippingRate object containing the details of the shipping rate to be upserted.
// Returns: Updated or newly created shipping rate details.
export const upsertShippingRate = async (
	storeSlug: string,
	shippingRate: ShippingRate
) => {
	try {
		// Get current user
		const user = await currentUser();

		// Ensure user is authenticated
		if (!user) throw new Error("Unauthenticated.");

		// Verify seller permission
		if (user.privateMetadata.role !== "SELLER")
			throw new Error(
				"Unauthorized Access: Seller Privileges Required for Entry."
			);

		// Make sure seller is updating their own store
		const check_ownership = await db.store.findUnique({
			where: {
				slug: storeSlug,
				userId: user.id,
			},
		});

		if (!check_ownership)
			throw new Error(
				"Make sure you have the permissions to update this store"
			);

		// Ensure shipping rate data is provided
		if (!shippingRate) throw new Error("Please provide shipping rate data.");

		// Ensure countryId is provided
		if (!shippingRate.countryId)
			throw new Error("Please provide a valid country ID.");

		// Get store id
		const store = await db.store.findUnique({
			where: {
				slug: storeSlug,
				userId: user.id,
			},
		});
		if (!store) throw new Error("Please provide a valid store slug.");

		// Upsert the shipping rate into the database
		const shippingRateDetails = await db.shippingRate.upsert({
			where: {
				id: shippingRate.id,
			},
			update: { ...shippingRate, storeId: store.id },
			create: { ...shippingRate, storeId: store.id },
		});

		return shippingRateDetails;
	} catch (error) {
		// Log and re-throw any errors
		console.log(error);
		throw error;
	}
};

/**
 * @name getStoreOrders
 * @description - Retrieves all orders for a specific store.
 *              - Returns order that include items, order details.
 * @access User
 * @param storeSlug - The slug of the store whose order groups are being retrieved.
 * @returns {Array} - Array of order groups, including items.
 */
export const getStoreOrders = async (storeSlug: string) => {
	try {
		// Retrieve current user
		const user = await currentUser();

		// Check if user is authenticated
		if (!user) throw new Error("Unauthenticated.");

		// Verify seller permission
		if (user.privateMetadata.role !== "SELLER")
			throw new Error(
				"Unauthorized Access: Seller Privileges Required for Entry."
			);

		// Get store id using slug
		const store = await db.store.findUnique({
			where: {
				slug: storeSlug,
			},
		});

		// Ensure store existence
		if (!store) throw new Error("Store not found.");

		// Verify ownership
		if (user.id !== store.userId) {
			throw new Error("You don't have persmission to access this store.");
		}

		// Retrieve order groups for the specified store and user
		const orders = await db.orderGroup.findMany({
			where: {
				storeId: store.id,
			},
			include: {
				items: true,
				coupon: true,
				order: {
					select: {
						paymentStatus: true,

						shippingAddress: {
							include: {
								country: true,
								user: {
									select: {
										email: true,
									},
								},
							},
						},
						paymentDetails: true,
					},
				},
			},
			orderBy: {
				updatedAt: "desc",
			},
		});

		return orders;
	} catch (error) {
		throw error;
	}
};

export const applySeller = async (store: StoreType) => {
	console.log("store", store);
	try {
		// Get current user
		const user = await currentUser();

		// Ensure user is authenticated
		if (!user) throw new Error("Unauthenticated.");

		// Ensure store data is provided
		if (!store) throw new Error("Please provide store data.");

		// Check if store with same name, email,slug, or phone number already exists
		const existingStore = await db.store.findFirst({
			where: {
				AND: [
					{
						OR: [
							{ name: store.name },
							{ email: store.email },
							{ phone: store.phone },
							{ slug: store.slug },
						],
					},
				],
			},
		});

		// If a store with same name, email, or phone number already exists, throw an error
		if (existingStore) {
			let errorMessage = "";
			if (existingStore.name === store.name) {
				errorMessage = "A store with the same name already exists";
			} else if (existingStore.email === store.email) {
				errorMessage = "A store with the same email already exists";
			} else if (existingStore.phone === store.phone) {
				errorMessage = "A store with the same phone number already exists";
			} else if (existingStore.slug === store.slug) {
				errorMessage = "A store with the same slug already exists";
			}
			throw new Error(errorMessage);
		}

		// Compute slug from name
		const slugify = (value: string) =>
			value
				.normalize("NFD")
				.replace(/\p{Diacritic}+/gu, "")
				.toLowerCase()
				.trim()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)+/g, "");
		const computedSlug = slugify(store.name);

		// Create store in the database
		const storeDetails = await db.store.create({
			data: {
				...store,
				slug: computedSlug,
				defaultShippingService:
					store.defaultShippingService || "International Delivery",
				returnPolicy: store.returnPolicy || "Return in 30 days.",
				userId: user.id,
			},
		});

		return storeDetails;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

// Function: getAllStores
// Description: Retrieves all stores from the database.
// Permission Level: Admin only
// Parameters: None
// Returns: An array of store details.
export const getAllStores = async () => {
	try {
		// Get current user
		const user = await currentUser();

		// Ensure user is authenticated
		if (!user) throw new Error("Unauthenticated.");

		// Verify admin permission
		if (user.privateMetadata.role !== "ADMIN") {
			throw new Error(
				"Unauthorized Access: Admin Privileges Required to View Stores."
			);
		}

		// Fetch all stores from the database
		const stores = await db.store.findMany({
			include: {
				user: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		return stores;
	} catch (error) {
		// Log and re-throw any errors
		console.log(error);
		throw error;
	}
};

export const updateStoreStatus = async (
	storeId: string,
	status: StoreStatus
) => {
	// Retrieve current user
	const user = await currentUser();

	// Check if user is authenticated
	if (!user) throw new Error("Unauthenticated.");

	// Verify admin permission
	if (user.privateMetadata.role !== "ADMIN")
		throw new Error(
			"Unauthorized Access: Admin Privileges Required for Entry."
		);

	const store = await db.store.findUnique({
		where: {
			id: storeId,
		},
	});

	// Verify seller ownership
	if (!store) {
		throw new Error("Store not found !");
	}

	// Retrieve the order to be updated
	const updatedStore = await db.store.update({
		where: {
			id: storeId,
		},
		data: {
			status,
		},
	});

	// Update the user role
	if (store.status === "PENDING" && updatedStore.status === "ACTIVE") {
		await db.user.update({
			where: {
				id: updatedStore.userId,
			},
			data: {
				role: "SELLER",
			},
		});
	}

	return updatedStore.status;
};

// Function: deleteStore
// Description: Deletes a store from the database.
// Permission Level: Admin only
// Parameters:
//   - storeId: The ID of the store to be deleted.
// Returns: Response indicating success or failure of the deletion operation.
export const deleteStore = async (storeId: string) => {
	try {
		// Get current user
		const user = await currentUser();

		// Check if user is authenticated
		if (!user) throw new Error("Unauthenticated.");

		// Verify admin permission
		if (user.privateMetadata.role !== "ADMIN")
			throw new Error(
				"Unauthorized Access: Admin Privileges Required for Entry."
			);

		// Ensure store ID is provided
		if (!storeId) throw new Error("Please provide store ID.");

		// Delete store from the database
		const response = await db.store.delete({
			where: {
				id: storeId,
			},
		});

		return response;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getStorePageDetails = async (storeSlug: string) => {
	// Fetch the store details from the database
	const store = await db.store.findFirst({
		where: {
			slug: storeSlug,
			status: "ACTIVE",
		},
		select: {
			id: true,
			name: true,
			description: true,
			logo: true,
			cover: true,
			averageRating: true,
			numReviews: true,
		},
	});

	// Handle case where the store is not found
	if (!store) {
		throw new Error(`Store with slug "${storeSlug}" not found.`);
	}
	return store;
};
