"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface StoresFiltersProps {
	currentSearch?: string;
	currentSort: string;
	currentCategoryId?: string;
}

const sortOptions = [
	{ value: "popular", label: "Più Popolari" },
	{ value: "rating", label: "Migliori Recensioni" },
	{ value: "newest", label: "Più Recenti" },
	{ value: "products", label: "Più Prodotti" },
];

export function StoresFilters({
	currentSearch = "",
	currentSort,
	currentCategoryId,
}: StoresFiltersProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [search, setSearch] = useState(currentSearch);
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	useEffect(() => {
		setSearch(currentSearch);
	}, [currentSearch]);

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		updateFilters({ search });
	};

	const handleSortChange = (value: string) => {
		updateFilters({ sortBy: value });
	};

	const updateFilters = (updates: Record<string, string | undefined>) => {
		const params = new URLSearchParams(searchParams.toString());

		Object.entries(updates).forEach(([key, value]) => {
			if (value) {
				params.set(key, value);
			} else {
				params.delete(key);
			}
		});

		// Reset to page 1 when filters change
		params.delete("page");

		router.push(`/stores?${params.toString()}`);
	};

	const clearFilters = () => {
		setSearch("");
		router.push("/stores");
	};

	const hasActiveFilters = currentSearch || currentCategoryId;

	return (
		<Card>
			<CardContent className="p-4">
				<div className="space-y-4">
					{/* Main Controls */}
					<div className="flex flex-col sm:flex-row gap-4">
						{/* Search */}
						<form onSubmit={handleSearchSubmit} className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									type="search"
									placeholder="Cerca negozi..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className="pl-10"
								/>
							</div>
						</form>

						{/* Sort */}
						<Select value={currentSort} onValueChange={handleSortChange}>
							<SelectTrigger className="w-full sm:w-[200px]">
								<SelectValue placeholder="Ordina per" />
							</SelectTrigger>
							<SelectContent>
								{sortOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{/* Filter Toggle (Mobile) */}
						<Button
							variant="outline"
							size="icon"
							className="sm:hidden"
							onClick={() => setIsFilterOpen(!isFilterOpen)}>
							<SlidersHorizontal className="h-4 w-4" />
						</Button>
					</div>

					{/* Active Filters & Clear */}
					{hasActiveFilters && (
						<div className="flex items-center justify-between pt-2 border-t">
							<p className="text-sm text-muted-foreground">
								{currentSearch && `Ricerca: "${currentSearch}"`}
							</p>
							<Button variant="ghost" size="sm" onClick={clearFilters}>
								Rimuovi filtri
							</Button>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
