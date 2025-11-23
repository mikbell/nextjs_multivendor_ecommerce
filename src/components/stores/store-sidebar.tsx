"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Info, Shield, Truck } from "lucide-react";

interface StoreSidebarProps {
	store: {
		id: string;
		slug: string;
		returnPolicy: string;
		defaultDeliveryTimeMin: number;
		defaultDeliveryTimeMax: number;
	};
	categories: Array<{
		id: string;
		name: string;
		slug: string;
		productCount: number;
	}>;
	currentCategoryId?: string;
}

export function StoreSidebar({
	store,
	categories,
	currentCategoryId,
}: StoreSidebarProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleCategoryClick = (categoryId?: string) => {
		const params = new URLSearchParams(searchParams.toString());

		if (categoryId) {
			params.set("categoryId", categoryId);
		} else {
			params.delete("categoryId");
		}

		// Reset to page 1
		params.delete("page");

		router.push(`/stores/${store.slug}?${params.toString()}`);
	};

	return (
		<div className="space-y-6">
			{/* Categories */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Categorie</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<Button
						variant={!currentCategoryId ? "default" : "ghost"}
						className="w-full justify-between"
						onClick={() => handleCategoryClick()}
					>
						<span>Tutti i prodotti</span>
						<Badge variant="secondary">
							{categories.reduce((sum, cat) => sum + cat.productCount, 0)}
						</Badge>
					</Button>

					<Separator className="my-2" />

					{categories.map((category) => (
						<Button
							key={category.id}
							variant={currentCategoryId === category.id ? "default" : "ghost"}
							className="w-full justify-between"
							onClick={() => handleCategoryClick(category.id)}
						>
							<span className="truncate">{category.name}</span>
							<Badge variant="secondary">{category.productCount}</Badge>
						</Button>
					))}
				</CardContent>
			</Card>

			{/* Store Info */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Informazioni Negozio</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Return Policy */}
					<div className="flex gap-3">
						<Shield className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
						<div>
							<p className="font-medium text-sm mb-1">Politica di reso</p>
							<p className="text-sm text-muted-foreground">
								{store.returnPolicy}
							</p>
						</div>
					</div>

					{/* Delivery Time */}
					<div className="flex gap-3">
						<Truck className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
						<div>
							<p className="font-medium text-sm mb-1">Tempi di consegna</p>
							<p className="text-sm text-muted-foreground">
								{store.defaultDeliveryTimeMin}-{store.defaultDeliveryTimeMax}{" "}
								giorni
							</p>
						</div>
					</div>

					{/* Info */}
					<div className="flex gap-3">
						<Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
						<div>
							<p className="font-medium text-sm mb-1">Garanzia</p>
							<p className="text-sm text-muted-foreground">
								Tutti i prodotti sono garantiti dal venditore
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
