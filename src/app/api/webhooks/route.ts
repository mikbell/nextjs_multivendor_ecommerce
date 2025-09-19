import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Role } from "@/generated/prisma";
import { db } from "@/lib/db";

export async function POST(req: Request) {
	const CLERK_WEBHOOK_SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

	if (!CLERK_WEBHOOK_SIGNING_SECRET) {
		throw new Error(
			"Please add CLERK_WEBHOOK_SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
		);
	}

	const headerPayload = req.headers;
	const svix_id = headerPayload.get("svix-id");
	const svix_timestamp = headerPayload.get("svix-timestamp");
	const svix_signature = headerPayload.get("svix-signature");

	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response("Error occured -- no svix headers", {
			status: 400,
		});
	}

	const payload = await req.json();
	const body = JSON.stringify(payload);
	const wh = new Webhook(CLERK_WEBHOOK_SIGNING_SECRET);
	let evt: WebhookEvent;

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

	// Quando un utente è creato o aggiornato
	if (evt.type === "user.created" || evt.type === "user.updated") {
		const {
			id,
			email_addresses,
			first_name,
			last_name,
			image_url,
			private_metadata,
		} = evt.data;

		// 1. Leggi il ruolo dai privateMetadata, con un fallback a USER
		const role = (private_metadata?.role as Role) || Role.USER;

		const email = email_addresses?.[0]?.email_address;

		if (!email) {
			return new Response("Missing user email in webhook payload", {
				status: 400,
			});
		}

		// 2. Esegui l'upsert includendo il ruolo sia in 'create' che in 'update'
		await db.user.upsert({
			where: { email: email },
			update: {
				firstName: first_name ?? "",
				lastName: last_name ?? "",
				picture: image_url,
				// Aggiungi il ruolo qui!
				role: role,
			},
			create: {
				id: id,
				firstName: first_name ?? "",
				lastName: last_name ?? "",
				email: email,
				picture: image_url,
				// Usa il ruolo letto da Clerk
				role: role,
			},
		});
	}

	// Quando un utente è eliminato (questo blocco era già corretto)
	if (evt.type === "user.deleted") {
		const { id } = evt.data;
		if (id) {
			await db.user.delete({
				where: { id: id },
			});
		}
	}

	// 3. La chiamata a updateUserMetadata è stata rimossa perché ridondante.

	return new Response("", { status: 200 });
}
