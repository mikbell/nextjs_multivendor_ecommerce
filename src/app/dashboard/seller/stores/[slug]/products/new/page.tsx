import { getAllCategories } from "@/queries/category";
import React from "react";

export default async function SellerNewProductPage({
	params,
}: {
	params: { slug: string };
}) {
	const categories = await getAllCategories();
	return <div>page</div>;
}
