"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Heart, Store as StoreIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import Heading from "../shared/heading";
import Image from "next/image";

interface Size {
	id: string;
	size: string;
	price: number;
	discount: number;
	quantity: number;
}

interface Store {
	id: string;
	name: string;
	slug: string;
	logo: string;
	averageRating: number;
}

interface ProductInfoProps {
	productId: string;
	variantId: string;
	name: string;
	brand: string;
	rating: number;
	numReviews: number;
	sizes: Size[];
	store: Store;
	isSale: boolean;
	saleEndDate?: string | null;
}

export function ProductInfo({
	productId,
	variantId,
	name,
	brand,
	rating,
	numReviews,
	sizes,
	store,
	isSale,
}: ProductInfoProps) {
	const [selectedSize, setSelectedSize] = useState<string>(sizes[0]?.id || "");

	const currentSize = sizes.find((s) => s.id === selectedSize) || sizes[0];
	const price = currentSize?.price || 0;
	const discount = currentSize?.discount || 0;
	const finalPrice = price * (1 - discount / 100);
	const inStock = (currentSize?.quantity || 0) > 0;

	return (
		<div className="space-y-6">
			{/* Brand & Title */}
			<div className="space-y-2">
				<Link
					href={`/brand/${brand}`}
					className="text-sm text-muted-foreground hover:text-primary">
					{brand}
				</Link>
				<Heading>{name}</Heading>
			</div>

			{/* Rating */}
			<div className="flex items-center gap-2">
				<div className="flex items-center gap-1">
					<Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
					<span className="font-semibold">{rating.toFixed(1)}</span>
				</div>
				<span className="text-muted-foreground">
					({numReviews} {numReviews === 1 ? "recensione" : "recensioni"})
				</span>
			</div>

			{/* Price */}
			<div className="space-y-2">
				<div className="flex items-baseline gap-3">
					<span className="text-4xl font-bold text-primary">
						€{finalPrice.toFixed(2)}
					</span>
					{discount > 0 && (
						<>
							<span className="text-xl text-muted-foreground line-through">
								€{price.toFixed(2)}
							</span>
							<Badge variant="destructive" className="text-sm">
								-{discount}%
							</Badge>
						</>
					)}
				</div>
				{isSale && (
					<Badge variant="secondary" className="text-sm">
						In Offerta
					</Badge>
				)}
			</div>

			{/* Size Selection */}
			{sizes.length > 0 && (
				<div className="space-y-2">
					<label className="text-sm font-medium">Seleziona taglia</label>
					<Select value={selectedSize} onValueChange={setSelectedSize}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Scegli una taglia" />
						</SelectTrigger>
						<SelectContent>
							{sizes.map((size) => (
								<SelectItem key={size.id} value={size.id}>
									{size.size} - €
									{(size.price * (1 - size.discount / 100)).toFixed(2)}
									{size.quantity === 0 && " (Esaurito)"}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<p className="text-sm text-muted-foreground">
						{inStock ? (
							<span className="text-green-600">
								{currentSize?.quantity} disponibili
							</span>
						) : (
							<span className="text-destructive">Non disponibile</span>
						)}
					</p>
				</div>
			)}

			{/* Actions */}
			<div className="flex gap-3">
				<AddToCartButton
					productId={productId}
					variantId={variantId}
					sizeId={selectedSize}
					quantity={1}
					disabled={!inStock || !selectedSize}
					size="lg"
					className="flex-1"
				/>
				<Button size="lg" variant="outline" className="px-4">
					<Heart className="h-5 w-5" />
				</Button>
			</div>

			{/* Store Info */}
			<Card>
				<CardContent className="p-4">
					<Link
						href={`/stores/${store.slug}`}
						className="flex items-center gap-3 hover:opacity-80 transition-opacity">
						<div className="h-12 w-12 relative rounded-full overflow-hidden bg-muted">
							{store.logo && (
								<Image
									width={48}
									height={48}
									src={store.logo}
									alt={store.name}
									className="object-cover"
								/>
							)}
						</div>
						<div className="flex-1">
							<div className="font-semibold flex items-center gap-2">
								<StoreIcon className="h-4 w-4" />
								{store.name}
							</div>
							<div className="text-sm text-muted-foreground flex items-center gap-1">
								<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
								{store.averageRating.toFixed(1)}
							</div>
						</div>
						<Button variant="outline" size="sm">
							Visita negozio
						</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}
