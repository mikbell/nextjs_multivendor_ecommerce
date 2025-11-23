import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserRole, setUserRole } from "@/lib/clerk-utils";

/**
 * API Endpoint per testare il sistema di ruoli Clerk
 * IMPORTANTE: Questo endpoint dovrebbe essere rimosso in produzione o protetto
 *
 * Usage:
 * GET /api/test-role - Ottieni il ruolo dell'utente corrente
 * POST /api/test-role - Imposta un nuovo ruolo (body: { role: "USER" | "SELLER" | "ADMIN" })
 */

// GET: Ottieni ruolo corrente
export async function GET() {
	try {
		const user = await currentUser();

		if (!user) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		// Ottieni ruolo da Clerk metadata
		const clerkRole = await getUserRole(user.id);

		return NextResponse.json({
			userId: user.id,
			email: user.emailAddresses[0]?.emailAddress,
			clerkRole,
			clerkMetadata: user.privateMetadata,
		});
	} catch (error) {
		console.error("Error getting user role:", error);
		return NextResponse.json(
			{ error: "Failed to get user role" },
			{ status: 500 }
		);
	}
}

// POST: Imposta nuovo ruolo (solo per testing)
export async function POST(req: Request) {
	// IMPORTANTE: Rimuovere questo endpoint in produzione!
	// O aggiungere controlli di sicurezza appropriati

	if (process.env.NODE_ENV === "production") {
		return NextResponse.json(
			{ error: "This endpoint is disabled in production" },
			{ status: 403 }
		);
	}

	try {
		const user = await currentUser();

		if (!user) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		const body = await req.json();
		const { role } = body;

		// Valida il ruolo
		if (!role || !["USER", "SELLER", "ADMIN"].includes(role)) {
			return NextResponse.json(
				{ error: "Invalid role. Must be USER, SELLER, or ADMIN" },
				{ status: 400 }
			);
		}

		// Imposta il ruolo
		const result = await setUserRole(user.id, role);

		if (!result.success) {
			return NextResponse.json(
				{ error: "Failed to set role" },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			success: true,
			userId: user.id,
			newRole: role,
			message: `Role updated to ${role}`,
		});
	} catch (error) {
		console.error("Error setting user role:", error);
		return NextResponse.json(
			{ error: "Failed to set user role" },
			{ status: 500 }
		);
	}
}
