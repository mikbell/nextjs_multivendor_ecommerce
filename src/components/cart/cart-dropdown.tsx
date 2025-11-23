"use client";

import { ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useCart } from "@/hooks/use-cart";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";

export function CartDropdown() {
	const { cart, isLoading, removeFromCart } = useCart();

	const itemCount = cart?.cartItems?.length || 0;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="relative">
					<ShoppingCart className="h-5 w-5" />
					{itemCount > 0 && (
						<Badge
							variant="destructive"
							className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
							{itemCount > 9 ? "9+" : itemCount}
						</Badge>
					)}
					<span className="sr-only">Carrello</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-80">
				<div className="p-4">
					<h3 className="font-semibold text-lg mb-3">
						Carrello ({itemCount})
					</h3>

					{isLoading ? (
						<div className="py-6 text-center text-muted-foreground">
							Caricamento...
						</div>
					) : itemCount === 0 ? (
						<div className="py-6 text-center">
							<ShoppingCart className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
							<p className="text-muted-foreground text-sm">
								Il tuo carrello è vuoto
							</p>
						</div>
					) : (
						<>
							<ScrollArea className="h-[300px] pr-4">
								<div className="space-y-4">
									{cart?.cartItems.map((item) => (
										<div key={item.id} className="flex gap-3">
											<div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
												<Image
													src={item.image}
													alt={item.name}
													fill
													className="object-cover"
												/>
											</div>
											<div className="flex-1 min-w-0">
												<Link
													href={`/products/${item.productSlug}/${item.variantSlug}`}
													className="text-sm font-medium hover:underline line-clamp-2">
													{item.name}
												</Link>
												<p className="text-xs text-muted-foreground mt-1">
													Taglia: {item.size} | Qtà: {item.quantity}
												</p>
												<p className="text-sm font-semibold mt-1">
													€{item.totalPrice.toFixed(2)}
												</p>
											</div>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 flex-shrink-0"
												onClick={() => removeFromCart(item.id)}>
												<X className="h-4 w-4" />
											</Button>
										</div>
									))}
								</div>
							</ScrollArea>

							<Separator className="my-4" />

							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Subtotale</span>
									<span className="font-medium">
										€{cart?.subTotal.toFixed(2)}
									</span>
								</div>
								{cart && cart.shippingFees > 0 && (
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Spedizione</span>
										<span className="font-medium">
											€{cart.shippingFees.toFixed(2)}
										</span>
									</div>
								)}
								<div className="flex justify-between font-semibold">
									<span>Totale</span>
									<span>€{cart?.total.toFixed(2)}</span>
								</div>
							</div>

							<div className="flex gap-2 mt-4">
								<Link href="/cart" className="flex-1">
									<Button variant="outline" className="w-full" size="sm">
										Vedi carrello
									</Button>
								</Link>
								<Link href="/checkout" className="flex-1">
									<Button className="w-full" size="sm">
										Checkout
									</Button>
								</Link>
							</div>
						</>
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
