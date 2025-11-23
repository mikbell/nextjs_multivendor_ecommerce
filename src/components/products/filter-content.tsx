"use client";

// import { memo } from "react"; // Temporaneamente disabilitato per debug
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Category {
	id: string;
	name: string;
	slug: string;
}

interface FilterContentProps {
	isMobile?: boolean;
	categories: Category[];
	categoryId: string;
	onCategoryChange: (value: string) => void;
	priceValues: [number, number];
	onPriceChange: (values: [number, number]) => void;
	priceRange: { min: number; max: number };
	priceStep: number;
	isValidPriceRange: boolean;
	hasActiveFilters: boolean;
	onClearFilters: () => void;
}

export function FilterContent({
	isMobile = false,
	categories,
	categoryId,
	onCategoryChange,
	priceValues,
	onPriceChange,
	priceRange,
	priceStep,
	isValidPriceRange,
	hasActiveFilters,
	onClearFilters,
}: FilterContentProps) {
	console.log("🔍 FilterContent received:", { categories: categories?.length, priceRange });

	// Fallback per evitare crash
	if (!categories || !Array.isArray(categories)) {
		console.error("❌ FilterContent: categories is invalid!", categories);
		return <div className="text-red-500">Errore: categorie non disponibili</div>;
	}

	return (
		<div className="space-y-6">
			{/* Categoria */}
			<div className="space-y-2">
				<Label htmlFor="category-select">Categoria</Label>
				<Select value={categoryId} onValueChange={onCategoryChange}>
					<SelectTrigger id="category-select">
						<SelectValue placeholder="Tutte le categorie" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Tutte le categorie</SelectItem>
						{categories.map((cat) => (
							<SelectItem key={cat.id} value={cat.id}>
								{cat.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Fascia di Prezzo */}
			{isValidPriceRange ? (
				<div className="space-y-4">
					<Label className="text-sm font-medium">Fascia di prezzo</Label>
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-1.5">
							<span className="text-xs text-muted-foreground">Min:</span>
							<span className="text-sm font-semibold">
								€{priceValues[0].toFixed(0)}
							</span>
						</div>
						<span className="text-xs text-muted-foreground">—</span>
						<div className="flex items-center gap-1.5">
							<span className="text-xs text-muted-foreground">Max:</span>
							<span className="text-sm font-semibold">
								€{priceValues[1].toFixed(0)}
							</span>
						</div>
					</div>
					<SliderPrimitive.Root
						value={priceValues}
						onValueChange={(values) => {
							console.log("FilterContent Slider changed:", values);
							onPriceChange(values as [number, number]);
						}}
						min={priceRange.min}
						max={priceRange.max}
						step={priceStep}
						minStepsBetweenThumbs={1}
						className="relative flex w-full touch-none select-none items-center py-4"
					>
						<SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
							<SliderPrimitive.Range className="absolute h-full bg-primary" />
						</SliderPrimitive.Track>
						<SliderPrimitive.Thumb className="block h-6 w-6 rounded-full border-2 border-primary bg-background shadow-lg transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:scale-110 cursor-grab active:cursor-grabbing" />
						<SliderPrimitive.Thumb className="block h-6 w-6 rounded-full border-2 border-primary bg-background shadow-lg transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:scale-110 cursor-grab active:cursor-grabbing" />
					</SliderPrimitive.Root>
					<div className="flex justify-between text-xs text-muted-foreground">
						<span>€{priceRange.min}</span>
						<span>€{priceRange.max}</span>
					</div>
				</div>
			) : (
				<div className="space-y-2">
					<Label className="text-sm font-medium">Fascia di prezzo</Label>
					<p className="text-sm text-muted-foreground">
						Range di prezzi non disponibile
					</p>
				</div>
			)}

			{/* Cancella Filtri (Mobile) */}
			{isMobile && hasActiveFilters && (
				<button
					onClick={onClearFilters}
					className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-accent"
				>
					<X className="h-4 w-4" />
					Cancella filtri
				</button>
			)}
		</div>
	);
}
