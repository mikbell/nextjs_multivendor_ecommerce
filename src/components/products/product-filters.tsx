"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react"; // Aggiunto 'X' per il pulsante Cancella
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Aggiunto CardHeader e CardTitle
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

// --- Interfacce ---
interface Category {
	id: string;
	name: string;
	slug: string;
}

interface ProductFiltersProps {
	categories: Category[];
	priceRange: { min: number; max: number };
	currentFilters: {
		categoryId?: string;
		minPrice?: string;
		maxPrice?: string;
		sortBy?: string;
	};
}

// --- Componente HOC per la logica di Debounce e URL ---
// Nota: Estrarre la logica di debounce in una hook personalizzata o utility function
// può rendere il codice più pulito, ma la manterremo qui per semplicità di revisione.

export function ProductFilters({
	categories,
	priceRange,
	currentFilters,
}: ProductFiltersProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const updateFilters = useCallback(
		(key: string, value: string) => {
			const params = new URLSearchParams(searchParams);

			// Passaggio 2.2: Controlla se il valore è il sentinella "all"
			if (value && value !== "all") {
				// **MODIFICATO QUI: aggiunta la verifica "all"**
				params.set(key, value);
			} else {
				params.delete(key); // Rimuovi il filtro se è "all" (o stringa vuota, anche se ora non dovrebbe accadere)
			}
			params.set("page", "1");
			router.push(`/products?${params.toString()}`);
		},
		[searchParams, router]
	);

	// Funzione per cancellare i filtri (memoizzata)
	const clearFilters = useCallback(() => {
		const params = new URLSearchParams(searchParams);
		params.delete("categoryId");
		params.delete("minPrice");
		params.delete("maxPrice");
		params.set("page", "1");
		router.push(`/products?${params.toString()}`);
	}, [searchParams, router]);

	const sortBy = currentFilters.sortBy || "popular";
	const categoryId = currentFilters.categoryId || "all"; // **MODIFICATO QUI**
	const hasActiveFilters =
		categoryId || currentFilters.minPrice || currentFilters.maxPrice;

	// Stato locale per lo slider del prezzo
	const [priceValues, setPriceValues] = useState<[number, number]>([
		currentFilters.minPrice
			? parseFloat(currentFilters.minPrice)
			: priceRange.min,
		currentFilters.maxPrice
			? parseFloat(currentFilters.maxPrice)
			: priceRange.max,
	]);

	// Sincronizza lo stato locale quando i filtri esterni cambiano
	useEffect(() => {
		const min = currentFilters.minPrice
			? parseFloat(currentFilters.minPrice)
			: priceRange.min;
		const max = currentFilters.maxPrice
			? parseFloat(currentFilters.maxPrice)
			: priceRange.max;
		setPriceValues([min, max]);
	}, [
		currentFilters.minPrice,
		currentFilters.maxPrice,
		priceRange.min,
		priceRange.max,
	]);

	// Logica di debounce per l'aggiornamento del prezzo
	useEffect(() => {
		const timer = setTimeout(() => {
			const params = new URLSearchParams(searchParams);
			const [minPriceValue, maxPriceValue] = priceValues;

			const isMinDefault = minPriceValue <= priceRange.min;
			const isMaxDefault = maxPriceValue >= priceRange.max;

			if (!isMinDefault) {
				params.set("minPrice", minPriceValue.toString());
			} else {
				params.delete("minPrice");
			}

			if (!isMaxDefault) {
				params.set("maxPrice", maxPriceValue.toString());
			} else {
				params.delete("maxPrice");
			}

			// Evita l'aggiornamento dell'URL se i valori sono tornati al default (o mai cambiati)
			const currentMin = currentFilters.minPrice
				? parseFloat(currentFilters.minPrice)
				: priceRange.min;
			const currentMax = currentFilters.maxPrice
				? parseFloat(currentFilters.maxPrice)
				: priceRange.max;

			if (minPriceValue !== currentMin || maxPriceValue !== currentMax) {
				params.set("page", "1");
				router.push(`/products?${params.toString()}`);
			}
		}, 500); // 500ms debounce

		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [priceValues, searchParams, priceRange.min, priceRange.max]); // Includi priceRange.min/max

	// --- Componente di Rendering dei Filtri (Riutilizzabile per Mobile/Desktop) ---
	const FilterContent = ({ isMobile = false }: { isMobile?: boolean }) => (
		<div className="space-y-6">
			{/* Categoria */}
			<div className="space-y-2">
				<Label htmlFor="category-select">Categoria</Label>
				<Select
					value={categoryId}
					onValueChange={(v) => updateFilters("categoryId", v)}>
					<SelectTrigger id="category-select">
						<SelectValue placeholder="Tutte le categorie" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Tutte le categorie</SelectItem>{" "}
						{/* Opzione per deselezionare */}
						{categories.map((cat) => (
							<SelectItem key={cat.id} value={cat.id}>
								{cat.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Fascia di Prezzo */}
			<div className="space-y-4">
				<div className="space-y-2">
					<Label>Fascia di prezzo</Label>
					<div className="text-sm font-semibold flex justify-between">
						<span>Min: €{priceValues[0].toFixed(0)}</span>
						<span>Max: €{priceValues[1].toFixed(0)}</span>
					</div>
				</div>
				<Slider
					value={priceValues}
					onValueChange={(values) => setPriceValues(values as [number, number])}
					min={priceRange.min}
					max={priceRange.max}
					step={1}
				/>
				<div className="flex justify-between text-xs text-muted-foreground">
					<span>€{priceRange.min}</span>
					<span>€{priceRange.max}</span>
				</div>
			</div>

			{/* Cancella Filtri (Visualizza solo quando ci sono filtri attivi) */}
			{isMobile && hasActiveFilters && (
				<Button
					variant="outline"
					onClick={clearFilters}
					className="w-full mt-4">
					<X className="mr-2 h-4 w-4" />
					Cancella filtri
				</Button>
			)}
		</div>
	);

	// --- Componente Principale ---
	return (
		<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
			{/* Mobile: Pulsante Filtri e Selettore di Ordinamento */}
			<div className="lg:hidden flex gap-2 w-full">
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline" className="flex-1">
							<Filter className="mr-2 h-4 w-4" />
							Filtri
						</Button>
					</SheetTrigger>
					<SheetContent side="left">
						<SheetHeader>
							<SheetTitle>Filtri prodotti</SheetTitle>
						</SheetHeader>
						<div className="mt-6">
							<FilterContent isMobile={true} />
						</div>
					</SheetContent>
				</Sheet>

				{/* Sort Mobile */}
				<Select
					value={sortBy}
					onValueChange={(v) => updateFilters("sortBy", v)}>
					<SelectTrigger className="flex-1">
						<SelectValue placeholder="Ordina per" />
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
			{/* Desktop: Filtro Laterale */}
			<div className="hidden lg:flex lg:flex-col lg:gap-4">
				{/* Card Filtri */}
				<Card>
					<CardHeader className="p-4 border-b">
						<CardTitle className="text-lg items-center">Filtri</CardTitle>
					</CardHeader>
					<CardContent className="p-4">
						<FilterContent />
						<div className="flex items-center space-x-2">
							<Label htmlFor="sort-select" className="shrink-0">
								Ordina per:
							</Label>
							<Select
								value={sortBy}
								onValueChange={(v) => updateFilters("sortBy", v)}>
								<SelectTrigger className="w-[180px]" id="sort-select">
									<SelectValue placeholder="Seleziona" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="popular">Più popolari</SelectItem>
									<SelectItem value="newest">Più recenti</SelectItem>
									<SelectItem value="price_asc">
										Prezzo: dal più basso
									</SelectItem>
									<SelectItem value="price_desc">
										Prezzo: dal più alto
									</SelectItem>
									<SelectItem value="rating">Migliori recensioni</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
