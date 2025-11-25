import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
	const body = await request.text();
	const signature = (await headers()).get("stripe-signature");

	if (!signature) {
		return NextResponse.json(
			{ error: "Missing stripe-signature header" },
			{ status: 400 }
		);
	}

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET!
		);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "Unknown error";
		console.error("Webhook signature verification failed:", errorMessage);
		return NextResponse.json(
			{ error: `Webhook Error: ${errorMessage}` },
			{ status: 400 }
		);
	}

	// Handle the event
	switch (event.type) {
		case "checkout.session.completed": {
			const session = event.data.object as Stripe.Checkout.Session;
			await handleCheckoutSessionCompleted(session);
			break;
		}

		case "payment_intent.succeeded": {
			const paymentIntent = event.data.object as Stripe.PaymentIntent;
			console.log("PaymentIntent succeeded:", paymentIntent.id);
			break;
		}

		case "payment_intent.payment_failed": {
			const paymentIntent = event.data.object as Stripe.PaymentIntent;
			console.log("PaymentIntent failed:", paymentIntent.id);
			break;
		}

		default:
			console.log(`Unhandled event type: ${event.type}`);
	}

	return NextResponse.json({ received: true }, { status: 200 });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
	try {
		const { userId, cartId } = session.metadata as {
			userId: string;
			cartId: string;
		};

		if (!userId || !cartId) {
			throw new Error("Missing metadata in session");
		}

		// Fetch cart with items
		const cart = await db.cart.findUnique({
			where: { id: cartId },
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

		if (!cart) {
			throw new Error("Cart not found");
		}

		// Get user's default shipping address
		const shippingAddress = await db.shippingAddress.findFirst({
			where: { userId, default: true },
		});

		if (!shippingAddress) {
			throw new Error("No default shipping address found");
		}

		// Create order
		const order = await db.order.create({
			data: {
				userId,
				orderStatus: "Pending",
				paymentMethod: "Stripe",
				paymentStatus: "Paid",
				shippingAddressId: shippingAddress.id,
				shippingFees: cart.shippingFees,
				subTotal: cart.subTotal,
				total: cart.total,
			},
		});

		// Group cart items by store
		const itemsByStore = cart.cartItems.reduce((acc, item) => {
			if (!acc[item.storeId]) {
				acc[item.storeId] = [];
			}
			acc[item.storeId].push(item);
			return acc;
		}, {} as Record<string, typeof cart.cartItems>);

		// Create order groups and items
		for (const [storeId, items] of Object.entries(itemsByStore)) {
			const groupSubTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
			const groupShippingFees = items.reduce((sum, item) => sum + item.shippingFee, 0);

			// Get store info for shipping details
			const store = await db.store.findUnique({
				where: { id: storeId },
			});

			if (!store) continue;

			const orderGroup = await db.orderGroup.create({
				data: {
					status: "Pending",
					shippingService: store.defaultShippingService,
					shippingDeliveryMin: store.defaultDeliveryTimeMin,
					shippingDeliveryMax: store.defaultDeliveryTimeMax,
					shippingFees: groupShippingFees,
					subTotal: groupSubTotal,
					total: groupSubTotal + groupShippingFees,
					orderId: order.id,
					storeId,
				},
			});

			// Create order items
			for (const item of items) {
				await db.orderItem.create({
					data: {
						quantity: item.quantity,
						image: item.image,
						name: item.name,
						price: item.price,
						shippingFee: item.shippingFee,
						size: item.size,
						sku: item.sku,
						totalPrice: item.totalPrice,
						productSlug: item.productSlug,
						variantSlug: item.variantSlug,
						status: "Pending",
						orderGroupId: orderGroup.id,
						productId: item.productId,
						sizeId: item.sizeId,
						variantId: item.variantId,
					},
				});

				// Update product sales count
				await db.product.update({
					where: { id: item.productId },
					data: { sales: { increment: item.quantity } },
				});

				// Update variant sales count
				await db.productVariant.update({
					where: { id: item.variantId },
					data: { sales: { increment: item.quantity } },
				});

				// Decrease size quantity
				await db.size.update({
					where: { id: item.sizeId },
					data: { quantity: { decrement: item.quantity } },
				});
			}
		}

		// Create payment details
		const paymentIntentId = session.payment_intent as string;
		await db.paymentDetails.create({
			data: {
				paymentInetntId: paymentIntentId,
				paymentMethod: "Stripe",
				status: "Completed",
				amount: cart.total,
				currency: "eur",
				orderId: order.id,
				userId,
			},
		});

		// Clear cart
		await db.cartItem.deleteMany({
			where: { cartId },
		});

		await db.cart.update({
			where: { id: cartId },
			data: {
				subTotal: 0,
				total: 0,
				shippingFees: 0,
			},
		});

		console.log("Order created successfully:", order.id);
	} catch (error) {
		console.error("Error handling checkout session completed:", error);
		throw error;
	}
}
