"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

interface AddToCartButtonProps {
	productId: string;
	variantId: string;
	sizeId: string;
	quantity?: number;
	disabled?: boolean;
	size?: "default" | "sm" | "lg" | "icon";
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
	className?: string;
}

export function AddToCartButton({
	productId,
	variantId,
	sizeId,
	quantity = 1,
	disabled = false,
	size = "default",
	variant = "default",
	className,
}: AddToCartButtonProps) {
	const { addToCart } = useCart();
	const [isAdding, setIsAdding] = useState(false);

	const handleAddToCart = async () => {
		if (!sizeId) {
			return;
		}

		setIsAdding(true);
		try {
			await addToCart(productId, variantId, sizeId, quantity);
		} finally {
			setIsAdding(false);
		}
	};

	return (
		<>
			<SignedIn>
				<Button
					onClick={handleAddToCart}
					disabled={disabled || isAdding || !sizeId}
					size={size}
					variant={variant}
					className={className}>
					<ShoppingCart className="h-4 w-4 mr-2" />
					{isAdding ? "Aggiunta..." : "Aggiungi al carrello"}
				</Button>
			</SignedIn>
			<SignedOut>
				<SignInButton mode="modal">
					<Button size={size} variant={variant} className={className}>
						<ShoppingCart className="h-4 w-4 mr-2" />
						Accedi per acquistare
					</Button>
				</SignInButton>
			</SignedOut>
		</>
	);
}
