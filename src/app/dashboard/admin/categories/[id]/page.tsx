import CategoryDetails from "@/components/dashboard/admin/forms/category-details";
import { getCategory } from "@/queries/category";
import { notFound } from "next/navigation";

interface EditCategoryPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
    const { id } = await params;

    const category = await getCategory(id);
    if (!category) {
        notFound();
    }

    return <CategoryDetails data={category} />;
}
