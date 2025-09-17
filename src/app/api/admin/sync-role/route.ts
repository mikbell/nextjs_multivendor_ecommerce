import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// POST /api/admin/sync-role
// Body: { userId: string } OR { all: true }
// Header: x-admin-secret: <process.env.ADMIN_SYNC_SECRET>
export async function POST(req: NextRequest) {
	try {
		const secret = req.headers.get("x-admin-secret");
		if (!process.env.ADMIN_SYNC_SECRET) {
			return new Response("Server misconfigured: ADMIN_SYNC_SECRET missing", {
				status: 500,
			});
		}
		if (secret !== process.env.ADMIN_SYNC_SECRET) {
			return new Response("Unauthorized", { status: 401 });
		}

		const body = await req.json().catch(() => ({}));

		const clerk = await clerkClient();

		if (body && body.all === true) {
			// Sync all users
			const users = await prisma.user.findMany({
				select: { id: true, role: true },
			});
			for (const u of users) {
				await clerk.users.updateUserMetadata(u.id, {
					privateMetadata: { role: u.role },
				});
			}
			return new Response(JSON.stringify({ ok: true, count: users.length }), {
				status: 200,
				headers: { "content-type": "application/json" },
			});
		}

		const userId: string | undefined = body?.userId;
		if (!userId) {
			return new Response("Missing userId", { status: 400 });
		}

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { id: true, role: true },
		});
		if (!user) {
			return new Response("User not found", { status: 404 });
		}

		await clerk.users.updateUserMetadata(user.id, {
			privateMetadata: { role: user.role },
		});

		return new Response(
			JSON.stringify({ ok: true, userId: user.id, role: user.role }),
			{
				status: 200,
				headers: { "content-type": "application/json" },
			}
		);
	} catch (err) {
		console.error("Error syncing role to Clerk:", err);
		const message = err instanceof Error ? err.message : "Internal error";
		return new Response(`Errore: ${message}`, { status: 500 });
	}
}
