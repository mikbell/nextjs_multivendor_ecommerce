"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function CartPage() {
	const { cart, isLoading, updateQuantity, removeFromCart, clearCart } = useCart();
	const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

	const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
		if (newQuantity < 1) return;

		setUpdatingItems((prev) => new Set(prev).add(itemId));
		try {
			await updateQuantity(itemId, newQuantity);
		} finally {
			setUpdatingItems((prev) => {
				const newSet = new Set(prev);
				newSet.delete(itemId);
				return newSet;
			});
		}
	};

	const handleRemoveItem = async (itemId: string) => {
		setUpdatingItems((prev) => new Set(prev).add(itemId));
		try {
			await removeFromCart(itemId);
		} finally {
			setUpdatingItems((prev) => {
				const newSet = new Set(prev);
				newSet.delete(itemId);
				return newSet;
			});
		}
	};

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex items-center justify-center h-64">
					<p className="text-muted-foreground">Caricamento carrello...</p>
				</div>
			</div>
		);
	}

	if (!cart || cart.cartItems.length === 0) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card className="max-w-2xl mx-auto">
					<CardContent className="flex flex-col items-center justify-center py-12">
						<ShoppingBag className="h-24 w-24 text-muted-foreground mb-4" />
						<h2 className="text-2xl font-bold mb-2">Il tuo carrello è vuoto</h2>
						<p className="text-muted-foreground mb-6">
							Aggiungi prodotti al carrello per continuare
						</p>
						<Link href="/products">
							<Button size="lg">Scopri i prodotti</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8">Carrello</h1>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Lista prodotti */}
				<div className="lg:col-span-2 space-y-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle>Prodotti ({cart.cartItems.length})</CardTitle>
							<Button
								variant="ghost"
								size="sm"
								onClick={clearCart}
								className="text-destructive hover:text-destructive">
								<Trash2 className="h-4 w-4 mr-2" />
								Svuota carrello
							</Button>
						</CardHeader>
						<CardContent className="space-y-4">
							{cart.cartItems.map((item) => {
								const isUpdating = updatingItems.has(item.id);
								const finalPrice = item.sizeRecord.price - (item.sizeRecord.price * item.sizeRecord.discount) / 100;

								return (
									<div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
										{/* Immagine prodotto */}
										<div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
											<Image
												src={item.image}
												alt={item.name}
												fill
												className="object-cover"
											/>
										</div>

										{/* Dettagli prodotto */}
										<div className="flex-1 min-w-0">
											<Link
												href={`/products/${item.productSlug}/${item.variantSlug}`}
												className="font-semibold hover:underline line-clamp-2">
												{item.name}
											</Link>
											<p className="text-sm text-muted-foreground mt-1">
												Taglia: {item.size}
											</p>
											<p className="text-sm text-muted-foreground">
												SKU: {item.sku}
											</p>

											{/* Prezzo */}
											<div className="mt-2 flex items-center gap-2">
												{item.sizeRecord.discount > 0 ? (
													<>
														<span className="font-bold text-lg">
															€{finalPrice.toFixed(2)}
														</span>
														<span className="text-sm text-muted-foreground line-through">
															€{item.sizeRecord.price.toFixed(2)}
														</span>
														<span className="text-sm text-green-600 font-medium">
															-{item.sizeRecord.discount}%
														</span>
													</>
												) : (
													<span className="font-bold text-lg">
														€{item.price.toFixed(2)}
													</span>
												)}
											</div>
										</div>

										{/* Controlli quantità */}
										<div className="flex flex-col items-end gap-2">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => handleRemoveItem(item.id)}
												disabled={isUpdating}
												className="text-destructive hover:text-destructive">
												<Trash2 className="h-4 w-4" />
											</Button>

											<div className="flex items-center gap-2 border rounded-md">
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8"
													onClick={() =>
														handleUpdateQuantity(item.id, item.quantity - 1)
													}
													disabled={isUpdating || item.quantity <= 1}>
													<Minus className="h-4 w-4" />
												</Button>
												<span className="w-12 text-center font-medium">
													{item.quantity}
												</span>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8"
													onClick={() =>
														handleUpdateQuantity(item.id, item.quantity + 1)
													}
													disabled={
														isUpdating ||
														item.quantity >= item.sizeRecord.quantity
													}>
													<Plus className="h-4 w-4" />
												</Button>
											</div>

											<p className="text-sm font-medium">
												Totale: €{item.totalPrice.toFixed(2)}
											</p>
										</div>
									</div>
								);
							})}
						</CardContent>
					</Card>
				</div>

				{/* Riepilogo ordine */}
				<div className="lg:col-span-1">
					<Card className="sticky top-20">
						<CardHeader>
							<CardTitle>Riepilogo ordine</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Subtotale</span>
								<span className="font-medium">€{cart.subTotal.toFixed(2)}</span>
							</div>

							{cart.shippingFees > 0 && (
								<div className="flex justify-between">
									<span className="text-muted-foreground">Spedizione</span>
									<span className="font-medium">€{cart.shippingFees.toFixed(2)}</span>
								</div>
							)}

							{cart.coupon && (
								<div className="flex justify-between text-green-600">
									<span>Sconto coupon ({cart.coupon.code})</span>
									<span className="font-medium">-{cart.coupon.discount}%</span>
								</div>
							)}

							<Separator />

							<div className="flex justify-between text-lg font-bold">
								<span>Totale</span>
								<span>€{cart.total.toFixed(2)}</span>
							</div>
						</CardContent>
						<CardFooter className="flex flex-col gap-2">
							<Link href="/checkout" className="w-full">
								<Button size="lg" className="w-full">
									Procedi al checkout
								</Button>
							</Link>
							<Link href="/products" className="w-full">
								<Button variant="outline" size="lg" className="w-full">
									Continua lo shopping
								</Button>
							</Link>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
}
