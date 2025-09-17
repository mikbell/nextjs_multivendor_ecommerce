import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// Ensure this route runs on the Node.js runtime and is never cached
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
	return new Response(
		JSON.stringify({
			ok: true,
			method: req.method,
			url: req.url,
			note: "This endpoint is for webhooks (POST). GET is only for reachability checks.",
		}),
		{
			status: 200,
			headers: { "content-type": "application/json" },
		}
	);
}

export async function POST(req: NextRequest) {
	try {
		const evt = await verifyWebhook(req);

		switch (evt.type) {
			case "user.created":
			case "user.updated": {
				const user = evt.data;

				const dbUser = await prisma.user.upsert({
					where: { id: user.id },
					update: {
						email: user.email_addresses?.[0]?.email_address || "",
						firstName: user.first_name || "",
						lastName: user.last_name || "",
						picture: user.image_url || "",
						phone: user.phone_numbers?.[0]?.phone_number || null,
					},
					create: {
						id: user.id,
						email: user.email_addresses?.[0]?.email_address || "",
						firstName: user.first_name || "",
						lastName: user.last_name || "",
						picture: user.image_url || "",
						phone: user.phone_numbers?.[0]?.phone_number || null,
					},
				});

				// Sincronizza il ruolo su Clerk (metadata)
				const clerk = await clerkClient();
				await clerk.users.updateUserMetadata(user.id, {
					privateMetadata: {
						role: dbUser.role,
					},
				});

				console.log(`Utente ${user.id} salvato/aggiornato nel DB`);
				break;
			}

			case "user.deleted": {
				const user = evt.data;

				// Elimina l'utente dal database (idempotente)
				await prisma.user.deleteMany({
					where: { id: user.id },
				});

				console.log(`Utente ${user.id} eliminato dal DB`);
				break;
			}

			default:
				console.log(`Evento non gestito: ${evt.type}`);
		}

		return new Response("Webhook processato con successo", { status: 200 });
	} catch (err) {
		console.error("Errore processando il webhook:", err);

		// Restituisci dettagli dell'errore per il debug
		if (err instanceof Error) {
			return new Response(`Errore: ${err.message}`, { status: 400 });
		}

		return new Response("Errore interno del server", { status: 500 });
	}
}
