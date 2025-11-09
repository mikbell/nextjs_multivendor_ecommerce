import { getAllStores } from "@/queries/store";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/dashboard/admin/stores/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/shared/heading";

export default async function StoresPage() {
	try {
		const stores = await getAllStores();

		return (
			<div className="flex flex-col gap-6 p-6">
				<div className="flex items-center justify-between">
					<div>
						<Heading>Negozi</Heading>

						<p className="text-muted-foreground">
							Gestisci tutti i negozi della piattaforma
						</p>
					</div>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Elenco Negozi ({stores.length})</CardTitle>
					</CardHeader>
					<CardContent>
						<DataTable columns={columns} data={stores} searchKey="name" />
					</CardContent>
				</Card>
			</div>
		);
	} catch (error) {
		console.error(error);
		return (
			<div className="flex flex-col gap-6 p-6">
				<Card>
					<CardContent className="pt-6">
						<p className="text-center text-muted-foreground">
							Errore durante il caricamento dei negozi.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}
}
