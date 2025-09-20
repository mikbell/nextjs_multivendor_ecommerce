import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AdminCategoriesPage() {
	return (
		<div className="flex items-center justify-between">
			<h1>Categorie</h1>
			<Link href="/dashboard/admin/categories/new">
				<Button>
					<Plus />
					<span>Nuova categoria</span>
				</Button>
			</Link>
		</div>
	);
}
