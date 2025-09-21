import { getAllSubCategories } from "@/queries/subCategory";
import { getAllCategories } from "@/queries/category";
import { columns } from "@/components/dashboard/admin/subCategories/columns";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Title } from "@/components/dashboard/title";

export default async function AdminSubCategoriesPage() {
	const subCategories = (await getAllSubCategories()) ?? [];

	const categories = (await getAllCategories()) ?? [];

	return (
		<>
			<Title title="Sotto-categorie" />
			<DataTable
				columns={columns}
				data={subCategories}
				searchKey="name"
				action={
					<Link href="/dashboard/admin/subCategories/new">
						<Button>
							<Plus />
						</Button>
					</Link>
				}
			/>
		</>
	);
}
