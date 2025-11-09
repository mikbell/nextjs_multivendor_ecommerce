"use server";

import { db } from "@/lib/db";
import { OrderStatus, ProductStatus } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";

// Function: getOrder
// Description: Retrieves a specific order by its ID and the current user's ID, including associated groups, items, store information,
//              item count, and shipping address.
// Parameters:
//   - params: orderId.
// Returns: Object containing order details with groups sorted by totalPrice in descending order.
export const getOrder = async (orderId: string) => {
	// Retrieve current user
	const user = await currentUser();

	// Check if user is authenticated
	if (!user) throw new Error("Unauthenticated.");

	// Simplified order query without relations for now
	const order = await db.order.findUnique({
		where: {
			id: orderId,
			userId: user.id,
		},
	});

	return order;
};

/**
 * @name updateOrderGroupStatus
 * @description - Updates the status of a specified order group.
 *              - Throws an error if the user is not authenticated or lacks seller privileges.
 * @access User
 * @param storeId - The store id of the seller to verify ownership.
 * @param groupId - The ID of the order group whose status is to be updated.
 * @param status - The new status to be set for the order.
 * @returns {Object} - Updated order status.
 */

export const updateOrderGroupStatus = async (
	storeId: string,
	groupId: string,
	status: OrderStatus
) => {
	// Retrieve current user
	const user = await currentUser();

	// Check if user is authenticated
	if (!user) throw new Error("Unauthenticated.");

	// Verify seller permission
	if (user.privateMetadata.role !== "SELLER")
		throw new Error(
			"Unauthorized Access: Seller Privileges Required for Entry."
		);

	const store = await db.store.findUnique({
		where: {
			id: storeId,
			userId: user.id,
		},
	});

	// Verify seller ownership
	if (!store) {
		throw new Error("Unauthorized Access !");
	}

	// Retrieve the order to be updated
	const order = await db.ordergroup.findUnique({
		where: {
			id: groupId,
			storeId: storeId,
		},
	});

	// Ensure order existence
	if (!order) throw new Error("Order not found.");

	// Update the order status
	const updatedOrder = await db.ordergroup.update({
		where: {
			id: groupId,
		},
		data: {
			status,
		},
	});

	return updatedOrder.status;
};

export const updateOrderItemStatus = async (
	storeId: string,
	orderItemId: string,
	status: ProductStatus
) => {
	// Retrieve current user
	const user = await currentUser();

	// Check if user is authenticated
	if (!user) throw new Error("Unauthenticated.");

	// Verify seller permission
	if (user.privateMetadata.role !== "SELLER")
		throw new Error(
			"Unauthorized Access: Seller Privileges Required for Entry."
		);

	const store = await db.store.findUnique({
		where: {
			id: storeId,
			userId: user.id,
		},
	});

	// Verify seller ownership
	if (!store) {
		throw new Error("Unauthorized Access !");
	}

	// Retrieve the product item to be updated
	const product = await db.orderitem.findUnique({
		where: {
			id: orderItemId,
		},
	});

	// Ensure order existence
	if (!product) throw new Error("Order item not found.");

	// Update the order status
	const updatedProduct = await db.orderitem.update({
		where: {
			id: orderItemId,
		},
		data: {
			status,
		},
	});

	return updatedProduct.status;
};

// Function: getAllOrdersForAdmin
// Description: Retrieves all orders for admin dashboard with user and shipping information.
// Permission Level: Admin only
// Returns: Array of orders with related data.
export const getAllOrdersForAdmin = async () => {
	try {
		// Get current user
		const user = await currentUser();

		// Ensure user is authenticated
		if (!user) throw new Error("Unauthenticated.");

		// Verify admin permission
		if (user.privateMetadata.role !== "ADMIN") {
			throw new Error(
				"Unauthorized Access: Admin Privileges Required to View Orders."
			);
		}

		// Fetch all orders with related data
		const orders = await db.order.findMany({
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				shippingAddress: {
					select: {
						firstName: true,
						lastName: true,
						city: true,
						state: true,
						countryId: true,
					},
				},
				orderGroups: {
					include: {
						store: {
							select: {
								id: true,
								name: true,
							},
						},
						_count: {
							select: {
								items: true,
							},
						},
					},
				},
				_count: {
					select: {
						orderGroups: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return orders;
	} catch (error) {
		// Log and re-throw any errors
		console.log(error);
		throw error;
	}
};

// Function: getOrderDetailsForAdmin
// Description: Retrieves complete order details for admin view including all order groups and items.
// Permission Level: Admin only
// Parameters:
//   - orderId: The ID of the order to fetch.
// Returns: Detailed order information with all related data.
export const getOrderDetailsForAdmin = async (orderId: string) => {
	try {
		// Get current user
		const user = await currentUser();

		// Ensure user is authenticated
		if (!user) throw new Error("Unauthenticated.");

		// Verify admin permission
		if (user.privateMetadata.role !== "ADMIN") {
			throw new Error(
				"Unauthorized Access: Admin Privileges Required to View Order Details."
			);
		}

		// Fetch the order with complete information
		const order = await db.order.findUnique({
			where: {
				id: orderId,
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						picture: true,
						createdAt: true,
					},
				},
				shippingAddress: true,
				orderGroups: {
					include: {
						store: {
							select: {
								id: true,
								name: true,
								logo: true,
								url: true,
							},
						},
						items: {
							include: {
								product: {
									select: {
										id: true,
										name: true,
										slug: true,
									},
								},
							},
						},
					},
				},
				paymentDetails: true,
			},
		});

		// Throw an error if the order is not found
		if (!order) throw new Error("Order not found.");

		return order;
	} catch (error) {
		// Log and re-throw any errors
		console.log(error);
		throw error;
	}
};
