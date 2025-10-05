import { getAllSubCategories } from "@/queries/subCategory";
import { columns } from "@/components/dashboard/admin/subCategories/columns";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminSubCategoriesPage() {
	const subCategories = (await getAllSubCategories()) ?? [];

	return (
		<div className="space-y-6">
			<PageHeader
				title="Sottocategorie"
				subtitle="Gestisci le sottocategorie per specializzare le tue categorie"
				action={
					<Link href="/dashboard/admin/subCategories/new">
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Nuova sottocategoria
						</Button>
					</Link>
				}
			/>

			<DataTable
				columns={columns}
				data={subCategories}
				searchKey="name"
			/>
		</div>
	);
}
