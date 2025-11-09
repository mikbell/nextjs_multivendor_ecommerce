import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/home/product-card";
import { ProductFilters } from "@/components/products/product-filters";
import { Pagination } from "@/components/products/pagination";
import {
	getProductsListing,
	getAllCategories,
	getPriceRange,
} from "@/queries/products-listing";

interface ProductsPageProps {
	searchParams: Promise<{
		categoryId?: string;
		subCategoryId?: string;
		minPrice?: string;
		maxPrice?: string;
		search?: string;
		sortBy?: "price_asc" | "price_desc" | "rating" | "newest" | "popular";
		page?: string;
	}>;
}

export default async function ProductsPage({
	searchParams,
}: ProductsPageProps) {
	const params = await searchParams;
	const [categories, priceRange] = await Promise.all([
		getAllCategories(),
		getPriceRange(),
	]);

	const filters: {
		page: number;
		pageSize: number;
		categoryId?: string;
		subCategoryId?: string;
		minPrice?: number;
		maxPrice?: number;
		search?: string;
		sortBy?: "price_asc" | "price_desc" | "rating" | "newest" | "popular";
	} = {
		page: params.page ? parseInt(params.page) : 1,
		pageSize: 24,
	};

	if (params.categoryId) filters.categoryId = params.categoryId;
	if (params.subCategoryId) filters.subCategoryId = params.subCategoryId;
	if (params.minPrice) filters.minPrice = parseFloat(params.minPrice);
	if (params.maxPrice) filters.maxPrice = parseFloat(params.maxPrice);
	if (params.search) filters.search = params.search;
	if (params.sortBy) filters.sortBy = params.sortBy;

	const { products, pagination } = await getProductsListing(filters);

	return (
		<div className="space-y-8">
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
					<h1 className="text-4xl font-bold tracking-tight">
						Tutti i prodotti
					</h1>
					{params.search && (
						<div className="flex items-center gap-2 text-muted-foreground">
							<Search className="h-4 w-4" />
							<span>Risultati per &quot;{params.search}&quot;</span>
						</div>
					)}
				</div>
			</div>

			{/* Filters */}
			<ProductFilters categories={categories} priceRange={priceRange} />

			{/* Results */}
			<div className="space-y-6">
				{products.length > 0 ? (
					<>
						<div className="text-sm text-muted-foreground">
							{pagination.totalCount} prodotti trovati
						</div>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
							{products.map((product) => (
								<ProductCard key={product.id} {...product} />
							))}
						</div>
						<Pagination
							currentPage={pagination.page}
							totalPages={pagination.totalPages}
							totalCount={pagination.totalCount}
						/>
					</>
				) : (
					<div className="text-center py-16 space-y-4">
						<div className="text-6xl">🔍</div>
						<h3 className="text-2xl font-semibold">Nessun prodotto trovato</h3>
						<p className="text-muted-foreground max-w-md mx-auto">
							Prova a modificare i filtri o la ricerca per trovare quello che
							cerchi.
						</p>
						<Link href="/products">
							<Button>Cancella filtri</Button>
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
