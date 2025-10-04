import { getAllCategories } from "@/queries/category";
import { columns } from "@/components/dashboard/admin/categories/columns";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminCategoriesPage() {
	const categories = (await getAllCategories()) ?? [];
	return (
		<div className="space-y-6">
			<PageHeader
				title="Categorie"
				subtitle="Gestisci le categorie del tuo marketplace"
				action={
					<Link href="/dashboard/admin/categories/new">
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Nuova categoria
						</Button>
					</Link>
				}
			/>

			<DataTable
				columns={columns}
				data={categories}
				searchKey="name"
			/>
		</div>
	);
}
