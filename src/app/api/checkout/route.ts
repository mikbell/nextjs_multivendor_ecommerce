import { createStripeCheckoutSession } from "@/queries/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { cartId } = await request.json();

		if (!cartId) {
			return NextResponse.json(
				{ error: "Cart ID is required" },
				{ status: 400 }
			);
		}

		const { sessionId, url } = await createStripeCheckoutSession(cartId);

		return NextResponse.json({ sessionId, url }, { status: 200 });
	} catch (error: any) {
		console.error("Checkout API error:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to create checkout session" },
			{ status: 500 }
		);
	}
}
