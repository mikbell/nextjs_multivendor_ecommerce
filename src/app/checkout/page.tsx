"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, ShoppingBag, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function CheckoutPage() {
	const { cart, isLoading } = useCart();
	const [isProcessing, setIsProcessing] = useState(false);

	const handleCheckout = async () => {
		if (!cart || cart.cartItems.length === 0) {
			toast.error("Il carrello è vuoto");
			return;
		}

		setIsProcessing(true);
		try {
			const response = await fetch("/api/checkout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					cartId: cart.id,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Errore durante il checkout");
			}

			const { url } = await response.json();

			if (url) {
				window.location.href = url;
			} else {
				throw new Error("URL di checkout non disponibile");
			}
		} catch (error: unknown) {
			console.error("Checkout error:", error);
			const errorMessage = error instanceof Error ? error.message : "Errore durante il checkout";
			toast.error(errorMessage);
			setIsProcessing(false);
		}
	};

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex items-center justify-center h-64">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
							Aggiungi prodotti al carrello per procedere al checkout
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
			<h1 className="text-3xl font-bold mb-8">Checkout</h1>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Riepilogo prodotti */}
				<div className="lg:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle>Riepilogo ordine</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{cart.cartItems.map((item) => {
								const finalPrice = item.sizeRecord.price - (item.sizeRecord.price * item.sizeRecord.discount) / 100;

								return (
									<div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
										<div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
											<Image
												src={item.image}
												alt={item.name}
												fill
												className="object-cover"
											/>
										</div>

										<div className="flex-1 min-w-0">
											<h3 className="font-semibold line-clamp-2">{item.name}</h3>
											<p className="text-sm text-muted-foreground">
												Taglia: {item.size} | Quantità: {item.quantity}
											</p>
											<div className="mt-1 flex items-center gap-2">
												{item.sizeRecord.discount > 0 ? (
													<>
														<span className="font-bold">
															€{finalPrice.toFixed(2)}
														</span>
														<span className="text-sm text-muted-foreground line-through">
															€{item.sizeRecord.price.toFixed(2)}
														</span>
													</>
												) : (
													<span className="font-bold">€{item.price.toFixed(2)}</span>
												)}
											</div>
										</div>

										<div className="text-right">
											<p className="font-bold">€{item.totalPrice.toFixed(2)}</p>
										</div>
									</div>
								);
							})}
						</CardContent>
					</Card>

					{/* Informazioni di spedizione */}
					<Card className="mt-6">
						<CardHeader>
							<CardTitle>Informazioni di spedizione</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">
								L&apos;indirizzo di spedizione predefinito verrà utilizzato per questo ordine.
								Puoi gestire i tuoi indirizzi nella sezione profilo.
							</p>
							<Link href="/dashboard/profile">
								<Button variant="outline" className="mt-4">
									Gestisci indirizzi
								</Button>
							</Link>
						</CardContent>
					</Card>
				</div>

				{/* Totale e pagamento */}
				<div className="lg:col-span-1">
					<Card className="sticky top-20">
						<CardHeader>
							<CardTitle>Totale</CardTitle>
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

							<div className="pt-4 space-y-2">
								<p className="text-xs text-muted-foreground">
									Cliccando su &quot;Procedi al pagamento&quot; verrai reindirizzato a Stripe
									per completare l&apos;acquisto in modo sicuro.
								</p>
							</div>
						</CardContent>
						<CardFooter className="flex flex-col gap-2">
							<Button
								size="lg"
								className="w-full"
								onClick={handleCheckout}
								disabled={isProcessing}>
								{isProcessing ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Reindirizzamento...
									</>
								) : (
									<>
										<CreditCard className="mr-2 h-4 w-4" />
										Procedi al pagamento
									</>
								)}
							</Button>
							<Link href="/cart" className="w-full">
								<Button variant="outline" size="lg" className="w-full">
									Torna al carrello
								</Button>
							</Link>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
}
