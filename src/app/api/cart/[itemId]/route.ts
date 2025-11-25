import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// PATCH - Aggiorna la quantità di un item
export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ itemId: string }> }
) {
	try {
		const { userId } = await auth();

		if (!userId) {
			return NextResponse.json(
				{ error: "Non autorizzato" },
				{ status: 401 }
			);
		}

		const { itemId } = await params;
		const body = await request.json();
		const { quantity } = body;

		if (!quantity || quantity < 1) {
			return NextResponse.json(
				{ error: "Quantità non valida" },
				{ status: 400 }
			);
		}

		// Verifica che l'item appartenga all'utente
		// @ts-expect-error - Prisma type inference issue with findUnique
		const cartItem = await db.cartItem.findUnique({
			where: { id: itemId },
			include: {
				cart: true,
				sizeRecord: true,
			},
		});

		if (!cartItem || cartItem.cart.userId !== userId) {
			return NextResponse.json(
				{ error: "Item non trovato" },
				{ status: 404 }
			);
		}

		// Verifica lo stock
		if (cartItem.sizeRecord.quantity < quantity) {
			return NextResponse.json(
				{ error: "Quantità non disponibile" },
				{ status: 400 }
			);
		}

		// Aggiorna l'item
		const totalPrice = cartItem.price * quantity;
		await db.cartItem.update({
			where: { id: itemId },
			data: {
				quantity,
				totalPrice,
			},
		});

		// Ricalcola i totali del carrello
		// @ts-expect-error - Prisma type inference issue
		const cartItems = await db.cartItem.findMany({
			where: { cartId: cartItem.cartId },
		});

		const subTotal = cartItems.reduce((sum: number, item: {id: string, totalPrice: number}) => {
			if (item.id === itemId) {
				return sum + totalPrice;
			}
			return sum + item.totalPrice;
		}, 0);

		const shippingFees = cartItems.reduce((sum: number, item: {shippingFee: number}) => sum + item.shippingFee, 0);

		await db.cart.update({
			where: { id: cartItem.cartId },
			data: {
				subTotal,
				shippingFees,
				total: subTotal + shippingFees,
			},
		});

		// Recupera il carrello aggiornato
		// @ts-expect-error - Prisma type inference issue
		const updatedCart = await db.cart.findUnique({
			where: { userId },
			include: {
				cartItems: {
					include: {
						product: true,
						productVariant: {
							include: {
								images: true,
							},
						},
						sizeRecord: true,
					},
				},
				coupon: {
					include: {
						store: true,
					},
				},
			},
		});

		return NextResponse.json(updatedCart);
	} catch (error) {
		console.error("Errore nell'aggiornamento dell'item:", error);
		return NextResponse.json(
			{ error: "Errore nell'aggiornamento dell'item" },
			{ status: 500 }
		);
	}
}

// DELETE - Rimuovi un item dal carrello
export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ itemId: string }> }
) {
	try {
		const { userId } = await auth();

		if (!userId) {
			return NextResponse.json(
				{ error: "Non autorizzato" },
				{ status: 401 }
			);
		}

		const { itemId } = await params;

		// Verifica che l'item appartenga all'utente
		// @ts-expect-error - Prisma type inference issue with findUnique
		const cartItem = await db.cartItem.findUnique({
			where: { id: itemId },
			include: {
				cart: true,
			},
		});

		if (!cartItem || cartItem.cart.userId !== userId) {
			return NextResponse.json(
				{ error: "Item non trovato" },
				{ status: 404 }
			);
		}

		// Elimina l'item
		await db.cartItem.delete({
			where: { id: itemId },
		});

		// Ricalcola i totali del carrello
		// @ts-expect-error - Prisma type inference issue
		const cartItems = await db.cartItem.findMany({
			where: { cartId: cartItem.cartId },
		});

		const subTotal = cartItems.reduce((sum: number, item: {totalPrice: number}) => sum + item.totalPrice, 0);
		const shippingFees = cartItems.reduce((sum: number, item: {shippingFee: number}) => sum + item.shippingFee, 0);

		await db.cart.update({
			where: { id: cartItem.cartId },
			data: {
				subTotal,
				shippingFees,
				total: subTotal + shippingFees,
			},
		});

		// Recupera il carrello aggiornato
		// @ts-expect-error - Prisma type inference issue
		const updatedCart = await db.cart.findUnique({
			where: { userId },
			include: {
				cartItems: {
					include: {
						product: true,
						productVariant: {
							include: {
								images: true,
							},
						},
						sizeRecord: true,
					},
				},
				coupon: {
					include: {
						store: true,
					},
				},
			},
		});

		return NextResponse.json(updatedCart);
	} catch (error) {
		console.error("Errore nella rimozione dell'item:", error);
		return NextResponse.json(
			{ error: "Errore nella rimozione dell'item" },
			{ status: 500 }
		);
	}
}
