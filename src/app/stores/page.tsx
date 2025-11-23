import { Metadata } from "next";
import { Suspense } from "react";
import Heading from "@/components/shared/heading";
import { StoresGrid } from "@/components/stores/stores-grid";
import { StoresFilters } from "@/components/stores/stores-filters";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
	title: "Negozi - GoShop",
	description:
		"Esplora tutti i negozi presenti su GoShop. Trova i migliori venditori italiani e scopri i loro prodotti.",
};

interface StoresPageProps {
	searchParams: Promise<{
		page?: string;
		search?: string;
		sortBy?: "newest" | "popular" | "rating" | "products";
		categoryId?: string;
	}>;
}

export default async function StoresPage({ searchParams }: StoresPageProps) {
	const filters = await searchParams;

	return (
		<div className="space-y-8">
			{/* Hero Section */}
			<section className="text-center space-y-4">
				<Heading>Esplora i Negozi</Heading>
				<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
					Scopri migliaia di venditori verificati e trova i prodotti che stai
					cercando. Ogni negozio è attentamente selezionato per garantire
					qualità e affidabilità.
				</p>
			</section>

			{/* Filters */}
			<StoresFilters
				currentSearch={filters.search}
				currentSort={filters.sortBy || "popular"}
				currentCategoryId={filters.categoryId}
			/>

			{/* Stores Grid */}
			<Suspense fallback={<StoresLoadingSkeleton />}>
				<StoresGrid
					page={filters.page ? parseInt(filters.page) : 1}
					search={filters.search}
					sortBy={filters.sortBy || "popular"}
					categoryId={filters.categoryId}
				/>
			</Suspense>
		</div>
	);
}

function StoresLoadingSkeleton() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{[...Array(8)].map((_, i) => (
				<Skeleton key={i} className="h-80 w-full" />
			))}
		</div>
	);
}
