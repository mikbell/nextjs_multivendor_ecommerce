import CategoryDetails from "@/components/dashboard/admin/forms/category-details";
import { getCategoryById } from "@/queries/category";
import { notFound } from "next/navigation";

interface EditCategoryPageProps {
    params: { id: string };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
    const { id } = params;

    const category = await getCategoryById(id);
    if (!category) {
        notFound();
    }

    return <CategoryDetails data={category} />;
}
