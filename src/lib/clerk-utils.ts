import { clerkClient } from "@clerk/nextjs/server";

/**
 * Sets the user role in Clerk's private metadata
 * @param userId - The Clerk user ID
 * @param role - The role to set (USER, SELLER, or ADMIN)
 */
export async function setUserRole(
	userId: string,
	role: "USER" | "SELLER" | "ADMIN"
) {
	try {
		const clerk = await clerkClient();
		await clerk.users.updateUserMetadata(userId, {
			privateMetadata: {
				role,
			},
		});
		return { success: true };
	} catch (error) {
		console.error("Error setting user role:", error);
		return { success: false, error };
	}
}

/**
 * Gets the user role from Clerk's private metadata
 * @param userId - The Clerk user ID
 * @returns The user role or null if not found
 */
export async function getUserRole(userId: string) {
	try {
		const clerk = await clerkClient();
		const user = await clerk.users.getUser(userId);
		return (user.privateMetadata?.role as "USER" | "SELLER" | "ADMIN") || null;
	} catch (error) {
		console.error("Error getting user role:", error);
		return null;
	}
}

/**
 * Initializes a new user with the default USER role
 * This is called when a user is created via webhook
 * @param userId - The Clerk user ID
 */
export async function initializeNewUserRole(userId: string) {
	return setUserRole(userId, "USER");
}
