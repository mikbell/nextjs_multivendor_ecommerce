"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Category {
	id: string;
	name: string;
	slug: string;
}

interface ProductFiltersProps {
	categories: Category[];
	priceRange: { min: number; max: number };
}

export function ProductFilters({
	categories,
	priceRange,
}: ProductFiltersProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const updateFilters = (key: string, value: string) => {
		const params = new URLSearchParams(searchParams);
		if (value) {
			params.set(key, value);
		} else {
			params.delete(key);
		}
		params.set("page", "1"); // Reset to first page on filter change
		router.push(`/products?${params.toString()}`);
	};

	const clearFilters = () => {
		router.push("/products");
	};

	const sortBy = searchParams.get("sortBy") || "popular";
	const categoryId = searchParams.get("categoryId") || "";

	const FilterContent = () => (
		<div className="space-y-6">
			{/* Category Filter */}
			<div className="space-y-2">
				<Label>Categoria</Label>
				<Select value={categoryId} onValueChange={(v) => updateFilters("categoryId", v)}>
					<SelectTrigger>
						<SelectValue placeholder="Tutte le categorie" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">Tutte le categorie</SelectItem>
						{categories.map((cat) => (
							<SelectItem key={cat.id} value={cat.id}>
								{cat.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Price Range */}
			<div className="space-y-2">
				<Label>Fascia di prezzo</Label>
				<div className="flex gap-2">
					<Input
						type="number"
						placeholder={`Min €${priceRange.min}`}
						defaultValue={searchParams.get("minPrice") || ""}
						onChange={(e) => updateFilters("minPrice", e.target.value)}
						min={priceRange.min}
						max={priceRange.max}
					/>
					<Input
						type="number"
						placeholder={`Max €${priceRange.max}`}
						defaultValue={searchParams.get("maxPrice") || ""}
						onChange={(e) => updateFilters("maxPrice", e.target.value)}
						min={priceRange.min}
						max={priceRange.max}
					/>
				</div>
			</div>

			{/* Clear Filters */}
			{(categoryId || searchParams.get("minPrice") || searchParams.get("maxPrice")) && (
				<Button variant="outline" onClick={clearFilters} className="w-full">
					Cancella filtri
				</Button>
			)}
		</div>
	);

	return (
		<div className="space-y-4">
			{/* Mobile Filters */}
			<div className="lg:hidden flex gap-2">
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline" className="flex-1">
							<Filter className="mr-2 h-4 w-4" />
							Filtri
						</Button>
					</SheetTrigger>
					<SheetContent side="left">
						<SheetHeader>
							<SheetTitle>Filtri</SheetTitle>
						</SheetHeader>
						<div className="mt-6">
							<FilterContent />
						</div>
					</SheetContent>
				</Sheet>

				{/* Sort */}
				<Select value={sortBy} onValueChange={(v) => updateFilters("sortBy", v)}>
					<SelectTrigger className="flex-1">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="popular">Più popolari</SelectItem>
						<SelectItem value="newest">Più recenti</SelectItem>
						<SelectItem value="price_asc">Prezzo: dal più basso</SelectItem>
						<SelectItem value="price_desc">Prezzo: dal più alto</SelectItem>
						<SelectItem value="rating">Migliori recensioni</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Desktop Filters */}
			<div className="hidden lg:flex items-center justify-between gap-4">
				<Card className="flex-1">
					<CardContent className="p-4">
						<FilterContent />
					</CardContent>
				</Card>

				{/* Sort */}
				<div className="w-64">
					<Label>Ordina per</Label>
					<Select value={sortBy} onValueChange={(v) => updateFilters("sortBy", v)}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="popular">Più popolari</SelectItem>
							<SelectItem value="newest">Più recenti</SelectItem>
							<SelectItem value="price_asc">Prezzo: dal più basso</SelectItem>
							<SelectItem value="price_desc">Prezzo: dal più alto</SelectItem>
							<SelectItem value="rating">Migliori recensioni</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
}
