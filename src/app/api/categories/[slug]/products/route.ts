import { NextRequest, NextResponse } from "next/server";
import { getCategoryProducts } from "@/queries/category-products";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params;
		const products = await getCategoryProducts(slug);

		return NextResponse.json({
			products,
		});
	} catch (error) {
		console.error("Error fetching category products:", error);
		return NextResponse.json(
			{ error: "Failed to fetch products" },
			{ status: 500 }
		);
	}
}
