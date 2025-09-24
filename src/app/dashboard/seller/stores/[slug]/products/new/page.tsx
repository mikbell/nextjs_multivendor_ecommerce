import { getAllCategories } from "@/queries/category";
import React from "react";
import ProductDetails from "@/components/dashboard/seller/forms/product-details";
import { getAllSubCategories } from "@/queries/subCategory";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export default async function SellerNewProductPage({
	params,
}: {
	params: { slug: string };
}) {
	const user = await currentUser();
	const categories = await getAllCategories();
	const stores = await db.store.findMany({
		where: {
			userId: user?.id,
		},
	});
	const subcategories = await getAllSubCategories();
	
	return <ProductDetails stores={stores} categories={categories} subcategories={subcategories} />;
}
