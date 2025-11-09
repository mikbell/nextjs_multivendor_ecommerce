"use client";

import { useState, useCallback } from "react";
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

interface CategoryProductsGridProps {
	initialProducts: Product[];
	categorySlug: string;
}

export function CategoryProductsGrid({
	initialProducts,
	categorySlug,
}: CategoryProductsGridProps) {
	const [products, setProducts] = useState<Product[]>(initialProducts);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(initialProducts.length >= 24);
	const [page, setPage] = useState(1);

	const loadMore = useCallback(async () => {
		if (isLoading || !hasMore) return;

		setIsLoading(true);

		try {
			const response = await fetch(
				`/api/categories/${categorySlug}/products?page=${page + 1}`
			);
			const data = await response.json();

			if (data.products && data.products.length > 0) {
				setProducts((prev) => [...prev, ...data.products]);
				setPage((p) => p + 1);
				setHasMore(data.products.length >= 24);
			} else {
				setHasMore(false);
			}
		} catch (error) {
			console.error("Error loading more products:", error);
			setHasMore(false);
		} finally {
			setIsLoading(false);
		}
	}, [categorySlug, page, hasMore, isLoading]);

	const { sentinelRef } = useInfiniteScroll({
		onLoadMore: loadMore,
		hasMore,
		isLoading,
	});

	return (
		<>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
