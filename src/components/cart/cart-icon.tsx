"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useCart } from "@/hooks/use-cart";

export function CartIcon() {
	const { cart } = useCart();

	const itemCount = cart?.cartItems?.length || 0;

	return (
		<Link href="/cart">
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
		</Link>
	);
}
