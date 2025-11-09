"use client";

import CategoryDetails from "@/components/dashboard/admin/forms/category-details";
import Heading from "@/components/shared/heading";

export default function TestCategoryPage() {
	return (
		<div className="container mx-auto py-8">
			<Heading>Test Category Form</Heading>
			<CategoryDetails />
		</div>
	);
}
