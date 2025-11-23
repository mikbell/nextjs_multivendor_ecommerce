"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/home/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface StoreProductsProps {
	products: Array<{
		id: string;
		name: string;
		slug: string;
		description: string;
		brand: string;
		rating: number;
		numReviews: number;
		sales: number;
		category: {
			id: string;
			name: string;
			slug: string;
		};
		subCategory: {
			id: string;
			name: string;
			slug: string;
		};
		offerTag: {
			id: string;
			name: string;
			discount: number;
			validUntil: Date;
		} | null;
		variants: Array<{
			id: string;
			name: string;
			slug: string;
			price: number;
			stock: number;
			images: string[];
		}>;
	}>;
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasMore: boolean;
	};
	currentSort: string;
	currentSearch?: string;
}

export function StoreProducts({
	products,
	pagination,
	currentSort,
	currentSearch,
}: StoreProductsProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [searchValue, setSearchValue] = useState(currentSearch || "");

	const handleSortChange = (value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("sortBy", value);
		params.delete("page"); // Reset to page 1
		router.push(`${pathname}?${params.toString()}`);
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const params = new URLSearchParams(searchParams.toString());

		if (searchValue.trim()) {
			params.set("search", searchValue.trim());
		} else {
			params.delete("search");
		}

		params.delete("page"); // Reset to page 1
		router.push(`${pathname}?${params.toString()}`);
	};

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", page.toString());
		router.push(`${pathname}?${params.toString()}`);

		// Scroll to top
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div className="space-y-6">
			{/* Filters Bar */}
			<Card className="p-4">
				<div className="flex flex-col md:flex-row gap-4">
					{/* Search */}
					<form onSubmit={handleSearch} className="flex-1">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Cerca prodotti..."
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
								className="pl-10"
							/>
						</div>
					</form>

					{/* Sort */}
					<Select value={currentSort} onValueChange={handleSortChange}>
						<SelectTrigger className="w-full md:w-[200px]">
							<SlidersHorizontal className="h-4 w-4 mr-2" />
							<SelectValue placeholder="Ordina per" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="newest">Più recenti</SelectItem>
							<SelectItem value="popular">Più popolari</SelectItem>
							<SelectItem value="rating">Miglior valutazione</SelectItem>
							<SelectItem value="price_asc">Prezzo: basso-alto</SelectItem>
							<SelectItem value="price_desc">Prezzo: alto-basso</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Results Count */}
				<div className="mt-4 text-sm text-muted-foreground">
					{pagination.total} prodott{pagination.total === 1 ? "o" : "i"}{" "}
					{currentSearch && `per "${currentSearch}"`}
				</div>
			</Card>

			{/* Products Grid */}
			{products.length > 0 ? (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
						{products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>

					{/* Pagination */}
					{pagination.totalPages > 1 && (
						<div className="flex justify-center gap-2 mt-8">
							<Button
								variant="outline"
								disabled={pagination.page === 1}
								onClick={() => handlePageChange(pagination.page - 1)}
							>
								Precedente
							</Button>

							<div className="flex items-center gap-2">
								{[...Array(pagination.totalPages)].map((_, index) => {
									const page = index + 1;
									// Show only 5 pages at a time
									if (
										page === 1 ||
										page === pagination.totalPages ||
										(page >= pagination.page - 1 && page <= pagination.page + 1)
									) {
										return (
											<Button
												key={page}
												variant={
													page === pagination.page ? "default" : "outline"
												}
												size="sm"
												onClick={() => handlePageChange(page)}
											>
												{page}
											</Button>
										);
									} else if (
										page === pagination.page - 2 ||
										page === pagination.page + 2
									) {
										return <span key={page}>...</span>;
									}
									return null;
								})}
							</div>

							<Button
								variant="outline"
								disabled={pagination.page === pagination.totalPages}
								onClick={() => handlePageChange(pagination.page + 1)}
							>
								Successivo
							</Button>
						</div>
					)}
				</>
			) : (
				<Card className="p-12 text-center">
					<p className="text-muted-foreground mb-4">
						Nessun prodotto trovato
						{currentSearch && ` per "${currentSearch}"`}
					</p>
					{currentSearch && (
						<Button
							variant="outline"
							onClick={() => {
								setSearchValue("");
								const params = new URLSearchParams(searchParams.toString());
								params.delete("search");
								router.push(`${pathname}?${params.toString()}`);
							}}
						>
							Cancella ricerca
						</Button>
					)}
				</Card>
			)}
		</div>
	);
}
