import SubCategoryDetails from "@/components/dashboard/admin/forms/subCategory-details";
import { getAllCategories } from "@/queries/category";

export default async function AdminNewSubCategoriesPage() {
	const Categories = await getAllCategories();

	return <SubCategoryDetails categories={Categories} />;
}
