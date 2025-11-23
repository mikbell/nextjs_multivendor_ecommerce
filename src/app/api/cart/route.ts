import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET - Recupera il carrello dell'utente
export async function GET() {
	try {
		const { userId } = await auth();

		if (!userId) {
			return NextResponse.json(
				{ error: "Non autorizzato" },
				{ status: 401 }
			);
		}

		const cart = await db.cart.findUnique({
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

		if (!cart) {
			// Crea un carrello vuoto se non esiste
			const newCart = await db.cart.create({
				data: {
					userId,
					subTotal: 0,
					total: 0,
					shippingFees: 0,
				},
				include: {
					cartItems: true,
					coupon: true,
				},
			});

			return NextResponse.json(newCart);
		}

		return NextResponse.json(cart);
	} catch (error) {
		console.error("Errore nel recupero del carrello:", error);
		return NextResponse.json(
			{ error: "Errore nel recupero del carrello" },
			{ status: 500 }
		);
	}
}

// POST - Aggiungi un prodotto al carrello
export async function POST(request: Request) {
	try {
		const { userId } = await auth();

		if (!userId) {
			return NextResponse.json(
				{ error: "Non autorizzato" },
				{ status: 401 }
			);
		}

		const body = await request.json();
		const {
			productId,
			variantId,
			sizeId,
			quantity = 1,
		} = body;

		if (!productId || !variantId || !sizeId) {
			return NextResponse.json(
				{ error: "Dati mancanti" },
				{ status: 400 }
			);
		}

		// Recupera i dettagli del prodotto
		const product = await db.product.findUnique({
			where: { id: productId },
			include: {
				store: true,
			},
		});

		const variant = await db.productVariant.findUnique({
			where: { id: variantId },
		});

		const size = await db.size.findUnique({
			where: { id: sizeId },
		});

		if (!product || !variant || !size) {
			return NextResponse.json(
				{ error: "Prodotto non trovato" },
				{ status: 404 }
			);
		}

		// Verifica lo stock
		if (size.quantity < quantity) {
			return NextResponse.json(
				{ error: "Quantità non disponibile" },
				{ status: 400 }
			);
		}

		// Trova o crea il carrello
		let cart = await db.cart.findUnique({
			where: { userId },
		});

		if (!cart) {
			cart = await db.cart.create({
				data: {
					userId,
					subTotal: 0,
					total: 0,
					shippingFees: 0,
				},
			});
		}

		// Calcola il prezzo
		const price = size.price - (size.price * size.discount) / 100;
		const totalPrice = price * quantity;

		// Verifica se il prodotto esiste già nel carrello
		const existingCartItem = await db.cartItem.findFirst({
			where: {
				cartId: cart.id,
				productId,
				variantId,
				sizeId,
			},
		});

		if (existingCartItem) {
			// Aggiorna la quantità
			const newQuantity = existingCartItem.quantity + quantity;

			if (size.quantity < newQuantity) {
				return NextResponse.json(
					{ error: "Quantità non disponibile" },
					{ status: 400 }
				);
			}

			await db.cartItem.update({
				where: { id: existingCartItem.id },
				data: {
					quantity: newQuantity,
					totalPrice: price * newQuantity,
				},
			});
		} else {
			// Crea nuovo item
			await db.cartItem.create({
				data: {
					cartId: cart.id,
					productId,
					variantId,
					sizeId,
					storeId: product.storeId,
					productSlug: product.slug,
					variantSlug: variant.slug,
					sku: variant.sku,
					name: product.name,
					image: variant.variantImage,
					size: size.size,
					price,
					quantity,
					shippingFee: 0,
					totalPrice,
				},
			});
		}

		// Ricalcola i totali del carrello
		const cartItems = await db.cartItem.findMany({
			where: { cartId: cart.id },
		});

		const subTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
		const shippingFees = cartItems.reduce((sum, item) => sum + item.shippingFee, 0);

		await db.cart.update({
			where: { id: cart.id },
			data: {
				subTotal,
				shippingFees,
				total: subTotal + shippingFees,
			},
		});

		// Recupera il carrello aggiornato
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
		console.error("Errore nell'aggiunta al carrello:", error);
		return NextResponse.json(
			{ error: "Errore nell'aggiunta al carrello" },
			{ status: 500 }
		);
	}
}

// DELETE - Svuota il carrello
export async function DELETE() {
	try {
		const { userId } = await auth();

		if (!userId) {
			return NextResponse.json(
				{ error: "Non autorizzato" },
				{ status: 401 }
			);
		}

		const cart = await db.cart.findUnique({
			where: { userId },
		});

		if (!cart) {
			return NextResponse.json(
				{ error: "Carrello non trovato" },
				{ status: 404 }
			);
		}

		// Elimina tutti gli item del carrello
		await db.cartItem.deleteMany({
			where: { cartId: cart.id },
		});

		// Aggiorna i totali
		await db.cart.update({
			where: { id: cart.id },
			data: {
				subTotal: 0,
				total: 0,
				shippingFees: 0,
			},
		});

		return NextResponse.json({ message: "Carrello svuotato" });
	} catch (error) {
		console.error("Errore nello svuotamento del carrello:", error);
		return NextResponse.json(
			{ error: "Errore nello svuotamento del carrello" },
			{ status: 500 }
		);
	}
}
