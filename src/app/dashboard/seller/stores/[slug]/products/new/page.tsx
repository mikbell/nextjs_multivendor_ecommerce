import { getAllCategories } from "@/queries/category";
import React from "react";
import ProductDetails from "@/components/dashboard/seller/forms/product-details";
import { getAllSubCategories } from "@/queries/subCategory";
import CloudinaryTest from "@/components/test/cloudinary-test";

export default async function SellerNewProductPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const categories = await getAllCategories();
	const subcategories = await getAllSubCategories();

	return (
		<div className="max-w-6xl mx-auto py-4 space-y-6">
			{/* Temporary test component */}
			<CloudinaryTest />
			
			<ProductDetails
				categories={categories}
				subcategories={subcategories}
				storeUrl={slug}
				offerTags={[]}
				countries={[]}
			/>
		</div>
	);
}
