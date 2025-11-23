import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPublicStoreBySlug, getPublicStoreProducts, getPublicStoreCategories } from "@/queries/store";
import { StoreHeader } from "@/components/stores/store-header";
import { StoreProducts } from "@/components/stores/store-products";
import { StoreSidebar } from "@/components/stores/store-sidebar";
import { Skeleton } from "@/components/ui/skeleton";

interface StorePageProps {
	params: Promise<{
		slug: string;
	}>;
	searchParams: Promise<{
		page?: string;
		categoryId?: string;
		sortBy?: "newest" | "price_asc" | "price_desc" | "popular" | "rating";
		search?: string;
	}>;
}

export async function generateMetadata({ params }: StorePageProps) {
	const { slug } = await params;
	const store = await getPublicStoreBySlug(slug);

	if (!store) {
		return {
			title: "Negozio non trovato",
		};
	}

	return {
		title: `${store.name} - GoShop`,
		description: store.description,
		openGraph: {
			title: store.name,
			description: store.description,
			images: [store.logo],
		},
	};
}

export default async function StorePage({
	params,
	searchParams,
}: StorePageProps) {
	const { slug } = await params;
	const filters = await searchParams;

	// Fetch store details
	const store = await getPublicStoreBySlug(slug);

	if (!store) {
		notFound();
	}

	// Fetch categories for sidebar
	const categories = await getPublicStoreCategories(store.id);

	// Fetch products with filters
	const { products, pagination } = await getPublicStoreProducts(store.id, {
		page: filters.page ? parseInt(filters.page) : 1,
		limit: 12,
		categoryId: filters.categoryId,
		sortBy: filters.sortBy,
		search: filters.search,
	});

	return (
		<div className="min-h-screen bg-background">
			{/* Store Header */}
			<StoreHeader store={store} />

			{/* Main Content */}
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Sidebar */}
					<aside className="lg:col-span-1">
						<StoreSidebar
							store={store}
							categories={categories}
							currentCategoryId={filters.categoryId}
						/>
					</aside>

					{/* Products Grid */}
					<main className="lg:col-span-3">
						<Suspense fallback={<ProductsLoadingSkeleton />}>
							<StoreProducts
								products={products}
								pagination={pagination}
								currentSort={filters.sortBy || "newest"}
								currentSearch={filters.search}
							/>
						</Suspense>
					</main>
				</div>
			</div>
		</div>
	);
}

function ProductsLoadingSkeleton() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-12 w-full" />
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				{[...Array(6)].map((_, i) => (
					<Skeleton key={i} className="h-96 w-full" />
				))}
			</div>
		</div>
	);
}
