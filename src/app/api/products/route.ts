import { NextRequest, NextResponse } from "next/server";
import { getProductsListing } from "@/queries/products-listing";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;

		const filters = {
			page: parseInt(searchParams.get("page") || "1"),
			pageSize: 24,
		} as any;

		if (searchParams.get("categoryId")) {
			filters.categoryId = searchParams.get("categoryId")!;
		}
		if (searchParams.get("subCategoryId")) {
			filters.subCategoryId = searchParams.get("subCategoryId")!;
		}
		if (searchParams.get("minPrice")) {
			filters.minPrice = parseFloat(searchParams.get("minPrice")!);
		}
		if (searchParams.get("maxPrice")) {
			filters.maxPrice = parseFloat(searchParams.get("maxPrice")!);
		}
		if (searchParams.get("search")) {
			filters.search = searchParams.get("search")!;
		}
		if (searchParams.get("sortBy")) {
			filters.sortBy = searchParams.get("sortBy") as any;
		}

		const { products, pagination } = await getProductsListing(filters);

		return NextResponse.json({
			products,
			pagination,
		});
	} catch (error) {
		console.error("Error fetching products:", error);
		return NextResponse.json(
			{ error: "Failed to fetch products" },
			{ status: 500 }
		);
	}
}
