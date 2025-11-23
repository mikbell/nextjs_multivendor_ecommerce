"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductCard } from "@/components/home/product-card";
import Heading from "@/components/shared/heading";

interface Category {
	id: string;
	name: string;
	slug: string;
}

interface Product {
	id: string;
	name: string;
	slug: string;
	image: string;
	price: number;
	rating: number;
	numReviews: number;
	variantSlug: string;
}

interface ProductsClientWrapperProps {
	categories: Category[];
	priceRange: { min: number; max: number };
	initialFilters: {
		categoryId?: string;
		subCategoryId?: string;
		minPrice?: string;
		maxPrice?: string;
		search?: string;
		sortBy?: "price_asc" | "price_desc" | "rating" | "newest" | "popular";
		page?: string;
	};
}

export function ProductsClientWrapper({
	categories,
	priceRange,
	initialFilters,
}: ProductsClientWrapperProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [totalCount, setTotalCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	// DEBUG: Test slider
	const [debugSlider, setDebugSlider] = useState<[number, number]>([30, 70]);

	// Fetch products based on current filters
	const fetchProducts = useCallback(async () => {
		setIsLoading(true);
		try {
			const params = new URLSearchParams(searchParams);
			const response = await fetch(`/api/products?${params.toString()}`);
			const data = await response.json();

			if (data.products) {
				setProducts(data.products);
				setTotalCount(data.pagination?.totalCount || 0);
				setCurrentPage(data.pagination?.page || 1);
				setTotalPages(data.pagination?.totalPages || 1);
			}
		} catch (error) {
			console.error("Error fetching products:", error);
		} finally {
			setIsLoading(false);
		}
	}, [searchParams]);

	// Fetch products when search params change
	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	// Load more products for infinite scroll
	const loadMoreProducts = useCallback(async () => {
		if (currentPage >= totalPages) return;

		const nextPage = currentPage + 1;
		const params = new URLSearchParams(searchParams);
		params.set("page", nextPage.toString());

		try {
			const response = await fetch(`/api/products?${params.toString()}`);
			const data = await response.json();

			if (data.products && data.products.length > 0) {
				setProducts((prev) => [...prev, ...data.products]);
				setCurrentPage(nextPage);
			}
		} catch (error) {
			console.error("Error loading more products:", error);
		}
	}, [currentPage, totalPages, searchParams]);

	// Intersection observer for infinite scroll
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && currentPage < totalPages) {
					loadMoreProducts();
				}
			},
			{ threshold: 0.1 }
		);

		const sentinel = document.getElementById("load-more-sentinel");
		if (sentinel) {
			observer.observe(sentinel);
		}

		return () => {
			if (sentinel) {
				observer.unobserve(sentinel);
			}
		};
	}, [currentPage, totalPages, loadMoreProducts]);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<div className="flex items-center gap-4">
						<Link href="/">
							<Button variant="ghost" size="sm">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Home
							</Button>
						</Link>
					</div>
					<Heading>Prodotti</Heading>

					{initialFilters.search && (
						<div className="flex items-center gap-2 text-muted-foreground">
							<Search className="h-4 w-4" />
							<span>Risultati per &quot;{initialFilters.search}&quot;</span>
						</div>
					)}
				</div>
			</div>

			{/* Main Content */}
			<div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
				{/* Filters Sidebar */}
				<ProductFilters
					categories={categories}
					priceRange={priceRange}
					currentFilters={{
						...(initialFilters.categoryId !== undefined && { categoryId: initialFilters.categoryId }),
						...(initialFilters.minPrice !== undefined && { minPrice: initialFilters.minPrice }),
						...(initialFilters.maxPrice !== undefined && { maxPrice: initialFilters.maxPrice }),
						...(initialFilters.sortBy !== undefined && { sortBy: initialFilters.sortBy }),
					}}
				/>

				{/* Products Grid */}
				<main>
					{isLoading && products.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-16 space-y-4">
							<Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
							<p className="text-muted-foreground">Caricamento prodotti...</p>
						</div>
					) : products.length > 0 ? (
						<div className="space-y-6">
							{/* Results Count */}
							<div className="flex items-center justify-between">
								<p className="text-sm text-muted-foreground">
									{totalCount}{" "}
									{totalCount === 1 ? "prodotto trovato" : "prodotti trovati"}
								</p>
							</div>

							{/* Products Grid */}
							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
								{products.map((product) => (
									<ProductCard key={product.id} {...product} />
								))}
							</div>

							{/* Infinite Scroll Sentinel */}
							{currentPage < totalPages && (
								<div
									id="load-more-sentinel"
									className="flex justify-center items-center py-8">
									<div className="flex items-center gap-2 text-muted-foreground">
										<Loader2 className="h-5 w-5 animate-spin" />
										<span>Caricamento altri prodotti...</span>
									</div>
								</div>
							)}

							{/* End of Results */}
							{currentPage >= totalPages && products.length > 0 && (
								<div className="text-center py-8 text-muted-foreground">
									Hai visualizzato tutti i prodotti disponibili
								</div>
							)}
						</div>
					) : (
						<div className="text-center py-16 space-y-4">
							<div className="text-6xl">🔍</div>
							<h3 className="text-2xl font-semibold">
								Nessun prodotto trovato
							</h3>
							<p className="text-muted-foreground max-w-md mx-auto">
								Prova a modificare i filtri o la ricerca per trovare quello che
								cerchi.
							</p>
							<Link href="/products">
								<Button>Cancella filtri</Button>
							</Link>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
