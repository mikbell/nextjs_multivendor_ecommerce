import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { initializeNewUserRole } from "@/lib/clerk-utils";
export async function POST(req: Request) {
	// You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
	const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

	if (!WEBHOOK_SECRET) {
		throw new Error(
			"Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
		);
	}

	// Get the headers
	const headerPayload = await headers();
	const svix_id = headerPayload.get("svix-id");
	const svix_timestamp = headerPayload.get("svix-timestamp");
	const svix_signature = headerPayload.get("svix-signature");

	// If there are no headers, error out
	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response("Error occured -- no svix headers", {
			status: 400,
		});
	}

	// Get the body
	const payload = await req.json();
	const body = JSON.stringify(payload);

	// Create a new Svix instance with your secret.
	const wh = new Webhook(WEBHOOK_SECRET);

	let evt: WebhookEvent;

	// Verify the payload with the headers
	try {
		evt = wh.verify(body, {
			"svix-id": svix_id,
			"svix-timestamp": svix_timestamp,
			"svix-signature": svix_signature,
		}) as WebhookEvent;
	} catch (err) {
		console.error("Error verifying webhook:", err);
		return new Response("Error occured", {
			status: 400,
		});
	}
	// When user is created
	if (evt.type === "user.created") {
		// Parse the incoming event data
		const data = JSON.parse(body).data;

		// Validate required data
		if (!data.id || !data.email_addresses || !data.email_addresses[0]) {
			console.error("Invalid webhook data: missing required fields");
			return new Response("Invalid webhook data", { status: 400 });
		}

		// Extract user data safely
		const userId = data.id;
		const userName = `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Unknown User";
		const userEmail = data.email_addresses[0].email_address;
		const userPicture = data.image_url || "";

		try {
			// Create user in the database with default role "USER"
			await db.user.create({
				data: {
					id: userId,
					name: userName,
					email: userEmail,
					picture: userPicture,
					role: "USER", // Default role to "USER" for all new users
					updatedAt: new Date(),
				},
			});

			// Set user's metadata in Clerk with role "USER"
			const result = await initializeNewUserRole(userId);

			if (!result.success) {
				console.error("Failed to set user role in Clerk metadata");
			}

			console.log(`New user created with role USER: ${userId}`);
		} catch (error) {
			console.error("Error creating user:", error);
			return new Response(
				JSON.stringify({ error: "Failed to create user" }),
				{ status: 500, headers: { "Content-Type": "application/json" } }
			);
		}
	}

	// When user is updated
	if (evt.type === "user.updated") {
		// Parse the incoming event data
		const data = JSON.parse(body).data;

		// Validate required data
		if (!data.id || !data.email_addresses || !data.email_addresses[0]) {
			console.error("Invalid webhook data: missing required fields");
			return new Response("Invalid webhook data", { status: 400 });
		}

		// Extract user data safely
		const userId = data.id;
		const userName = `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Unknown User";
		const userEmail = data.email_addresses[0].email_address;
		const userPicture = data.image_url || "";

		try {
			// Update user in the database (preserve existing role)
			await db.user.update({
				where: {
					id: userId,
				},
				data: {
					name: userName,
					email: userEmail,
					picture: userPicture,
					updatedAt: new Date(),
				},
			});

			console.log(`User updated: ${userId}`);
		} catch (error) {
			console.error("Error updating user:", error);
			return new Response(
				JSON.stringify({ error: "Failed to update user" }),
				{ status: 500, headers: { "Content-Type": "application/json" } }
			);
		}
	}

	// When user is deleted
	if (evt.type === "user.deleted") {
		// Parse the incoming event data to get the user ID
		const data = JSON.parse(body).data;
		const userId = data.id;

		// Validate user ID
		if (!userId) {
			console.error("Invalid webhook data: missing user ID for deletion");
			return new Response("Invalid webhook data", { status: 400 });
		}

		try {
			// Delete the user from the database based on the user ID
			await db.user.delete({
				where: {
					id: userId,
				},
			});
		} catch (error) {
			// If user doesn't exist in database, it's not an error for webhook purposes
			console.log(`User ${userId} not found in database, skipping deletion`);
		}
	}

	// Return success response with event type
	return new Response(
		JSON.stringify({ success: true, event: evt.type || "unknown" }), 
		{ 
			status: 200,
			headers: {
				"Content-Type": "application/json"
			} 
		}
	);
}
