import { getAllCategories } from "@/queries/category";
import React from "react";
import ProductDetails from "@/components/dashboard/seller/forms/product-details";
import { getAllSubCategories } from "@/queries/subCategory";
import { getAllOfferTags } from "@/queries/offer-tag";
import { getAllCountries } from "@/queries/country";

export default async function SellerNewProductPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const [categories, subcategories, offerTags, countries] = await Promise.all([
		getAllCategories(),
		getAllSubCategories(),
		getAllOfferTags(),
		getAllCountries(),
	]);

	return (
		<div className="max-w-6xl mx-auto py-4 space-y-6">
			<ProductDetails
				categories={categories}
				subcategories={subcategories}
				storeUrl={slug}
				offerTags={offerTags}
				countries={countries}
			/>
		</div>
	);
}
