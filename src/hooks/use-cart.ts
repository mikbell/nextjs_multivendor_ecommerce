"use client";

import { CartWithCartItemsType } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useCart() {
	const [cart, setCart] = useState<CartWithCartItemsType | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Carica il carrello
	const fetchCart = async () => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/cart");

			if (!response.ok) {
				throw new Error("Errore nel caricamento del carrello");
			}

			const data = await response.json();
			setCart(data);
		} catch (error) {
			console.error("Errore nel caricamento del carrello:", error);
			toast.error("Errore nel caricamento del carrello");
		} finally {
			setIsLoading(false);
		}
	};

	// Aggiungi un prodotto al carrello
	const addToCart = async (
		productId: string,
		variantId: string,
		sizeId: string,
		quantity: number = 1
	) => {
		try {
			const response = await fetch("/api/cart", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					productId,
					variantId,
					sizeId,
					quantity,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Errore nell'aggiunta al carrello");
			}

			const data = await response.json();
			setCart(data);
			toast.success("Prodotto aggiunto al carrello");
			return data;
		} catch (error: any) {
			console.error("Errore nell'aggiunta al carrello:", error);
			toast.error(error.message || "Errore nell'aggiunta al carrello");
			throw error;
		}
	};

	// Aggiorna la quantità di un item
	const updateQuantity = async (itemId: string, quantity: number) => {
		try {
			const response = await fetch(`/api/cart/${itemId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ quantity }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Errore nell'aggiornamento");
			}

			const data = await response.json();
			setCart(data);
			return data;
		} catch (error: any) {
			console.error("Errore nell'aggiornamento:", error);
			toast.error(error.message || "Errore nell'aggiornamento");
			throw error;
		}
	};

	// Rimuovi un item dal carrello
	const removeFromCart = async (itemId: string) => {
		try {
			const response = await fetch(`/api/cart/${itemId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Errore nella rimozione");
			}

			const data = await response.json();
			setCart(data);
			toast.success("Prodotto rimosso dal carrello");
			return data;
		} catch (error: any) {
			console.error("Errore nella rimozione:", error);
			toast.error(error.message || "Errore nella rimozione");
			throw error;
		}
	};

	// Svuota il carrello
	const clearCart = async () => {
		try {
			const response = await fetch("/api/cart", {
				method: "DELETE",
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Errore nello svuotamento del carrello");
			}

			await fetchCart();
			toast.success("Carrello svuotato");
		} catch (error: any) {
			console.error("Errore nello svuotamento:", error);
			toast.error(error.message || "Errore nello svuotamento del carrello");
			throw error;
		}
	};

	useEffect(() => {
		fetchCart();
	}, []);

	return {
		cart,
		isLoading,
		addToCart,
		updateQuantity,
		removeFromCart,
		clearCart,
		refetch: fetchCart,
	};
}
