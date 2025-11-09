"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

// Function: getAllCouponsForAdmin
// Description: Retrieves all coupons with store information for admin dashboard.
// Permission Level: Admin only
// Returns: Array of coupons with related data.
export const getAllCouponsForAdmin = async () => {
	try {
		// Get current user
		const user = await currentUser();

		// Ensure user is authenticated
		if (!user) throw new Error("Unauthenticated.");

		// Verify admin permission
		if (user.privateMetadata.role !== "ADMIN") {
			throw new Error(
				"Unauthorized Access: Admin Privileges Required to View Coupons."
			);
		}

		// Fetch all coupons with related data
		const coupons = await db.coupon.findMany({
			include: {
				store: {
					select: {
						id: true,
						name: true,
						logo: true,
						url: true,
					},
				},
				_count: {
					select: {
						users: true,
						orderGroups: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return coupons;
	} catch (error) {
		// Log and re-throw any errors
		console.log(error);
		throw error;
	}
};

// Function: deleteCoupon
// Description: Deletes a coupon from the database.
// Permission Level: Admin only
// Parameters:
//   - couponId: The ID of the coupon to be deleted.
// Returns: Response indicating success or failure of the deletion operation.
export const deleteCoupon = async (couponId: string) => {
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

		// Ensure coupon ID is provided
		if (!couponId) throw new Error("Please provide coupon ID.");

		// Delete coupon from the database
		const response = await db.coupon.delete({
			where: {
				id: couponId,
			},
		});

		return response;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

// Function: toggleCouponStatus
// Description: Toggles the active status of a coupon.
// Permission Level: Admin only
// Parameters:
//   - couponId: The ID of the coupon to toggle.
//   - isActive: The new active status.
// Returns: Updated coupon.
export const toggleCouponStatus = async (
	couponId: string,
	isActive: boolean
) => {
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

		// Ensure coupon ID is provided
		if (!couponId) throw new Error("Please provide coupon ID.");

		// Update coupon status
		const updatedCoupon = await db.coupon.update({
			where: {
				id: couponId,
			},
			data: {
				isActive,
			},
		});

		return updatedCoupon;
	} catch (error) {
		console.log(error);
		throw error;
	}
};
