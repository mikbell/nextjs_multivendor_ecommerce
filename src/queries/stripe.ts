"use server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const createStripeCheckoutSession = async (cartId: string) => {
	try {
		const user = await currentUser();
		if (!user) throw new Error("Unauthenticated.");

		// Fetch cart with items
		const cart = await db.cart.findUnique({
			where: { id: cartId, userId: user.id },
			include: {
				cartItems: {
					include: {
						product: true,
						productVariant: true,
						sizeRecord: true,
					},
				},
			},
		});

		if (!cart || cart.cartItems.length === 0) {
			throw new Error("Cart is empty.");
		}

		// Create line items for Stripe
		const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.cartItems.map((item) => ({
			price_data: {
				currency: "eur",
				product_data: {
					name: item.name,
					images: [item.image],
					metadata: {
						productId: item.productId,
						variantId: item.variantId,
						sizeId: item.sizeId,
					},
				},
				unit_amount: Math.round(item.price * 100),
			},
			quantity: item.quantity,
		}));

		// Create checkout session
		const session = await stripe.checkout.sessions.create({
			mode: "payment",
			payment_method_types: ["card"],
			line_items: lineItems,
			success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/cancel`,
			metadata: {
				userId: user.id,
				cartId: cart.id,
			},
		});

		return { sessionId: session.id, url: session.url };
	} catch (error) {
		console.error("Error creating Stripe checkout session:", error);
		throw error;
	}
};

export const createStripePayment = async (
	orderId: string,
	paymentIntent: Stripe.PaymentIntent
) => {
	try {
		const user = await currentUser();
		if (!user) throw new Error("Unauthenticated.");

		const order = await db.order.findUnique({
			where: { id: orderId },
		});

		if (!order) throw new Error("Order not found.");

		const updatedPaymentDetails = await db.paymentDetails.upsert({
			where: { orderId },
			update: {
				paymentInetntId: paymentIntent.id,
				paymentMethod: "Stripe",
				amount: paymentIntent.amount / 100,
				currency: paymentIntent.currency,
				status:
					paymentIntent.status === "succeeded"
						? "Completed"
						: paymentIntent.status,
				userId: user.id,
			},
			create: {
				paymentInetntId: paymentIntent.id,
				paymentMethod: "Stripe",
				amount: paymentIntent.amount / 100,
				currency: paymentIntent.currency,
				status:
					paymentIntent.status === "succeeded"
						? "Completed"
						: paymentIntent.status,
				orderId: orderId,
				userId: user.id,
			},
		});

		const updatedOrder = await db.order.update({
			where: { id: orderId },
			data: {
				paymentStatus: paymentIntent.status === "succeeded" ? "Paid" : "Failed",
				paymentMethod: "Stripe",
			},
			include: {
				paymentDetails: true,
			},
		});

		return updatedOrder;
	} catch (error) {
		console.error("Error creating Stripe payment:", error);
		throw error;
	}
};
