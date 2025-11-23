import { ProductsClientWrapper } from "@/components/products/products-client-wrapper";
import { getAllCategories, getPriceRange } from "@/queries/products-listing";

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

	const initialFilters = Object.fromEntries(
		Object.entries({
			categoryId: params.categoryId,
			subCategoryId: params.subCategoryId,
			minPrice: params.minPrice,
			maxPrice: params.maxPrice,
			search: params.search,
			sortBy: params.sortBy,
			page: params.page,
		}).filter(([_, value]) => value !== undefined)
	);

	return (
		<ProductsClientWrapper
			categories={categories}
			priceRange={priceRange}
			initialFilters={initialFilters}
		/>
	);
}
