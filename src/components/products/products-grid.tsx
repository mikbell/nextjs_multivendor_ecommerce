"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ProductCard } from "@/components/home/product-card";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

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

interface ProductsGridProps {
	initialProducts: Product[];
	totalPages: number;
	currentPage: number;
}

export function ProductsGrid({
	initialProducts,
	totalPages,
	currentPage: initialPage,
}: ProductsGridProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [products, setProducts] = useState<Product[]>(initialProducts);
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [isLoading, setIsLoading] = useState(false);

	const hasMore = currentPage < totalPages;

	const loadMore = useCallback(async () => {
		if (isLoading || !hasMore) return;

		setIsLoading(true);
		const nextPage = currentPage + 1;

		try {
			const params = new URLSearchParams(searchParams);
			params.set("page", nextPage.toString());

			const response = await fetch(`/api/products?${params.toString()}`);
			const data = await response.json();

			if (data.products && data.products.length > 0) {
				setProducts((prev) => [...prev, ...data.products]);
				setCurrentPage(nextPage);

				// Update URL without reload
				router.replace(`/products?${params.toString()}`, { scroll: false });
			}
		} catch (error) {
			console.error("Error loading more products:", error);
		} finally {
			setIsLoading(false);
		}
	}, [currentPage, hasMore, isLoading, searchParams, router]);

	const { sentinelRef } = useInfiniteScroll({
		onLoadMore: loadMore,
		hasMore,
		isLoading,
	});

	return (
		<>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
				{products.map((product) => (
					<ProductCard key={product.id} {...product} />
				))}
			</div>

			{/* Loading indicator and sentinel */}
			{hasMore && (
				<div
					ref={sentinelRef}
					className="flex justify-center items-center py-8">
					{isLoading && (
						<div className="flex items-center gap-2 text-muted-foreground">
							<Loader2 className="h-5 w-5 animate-spin" />
							<span>Caricamento prodotti...</span>
						</div>
					)}
				</div>
			)}

			{!hasMore && products.length > 0 && (
				<div className="text-center py-8 text-muted-foreground">
					Hai visualizzato tutti i prodotti disponibili
				</div>
			)}
		</>
	);
}
