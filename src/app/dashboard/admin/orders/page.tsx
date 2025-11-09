import { getAllOrdersForAdmin } from "@/queries/order";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/dashboard/admin/orders/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function OrdersPage() {
	try {
		const orders = await getAllOrdersForAdmin();

		// Calculate statistics
		const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
		const pendingOrders = orders.filter(
			(order) => order.orderStatus === "Pending"
		).length;
		const paidOrders = orders.filter(
			(order) => order.paymentStatus === "Paid"
		).length;

		return (
			<div className="flex flex-col gap-6 p-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Ordini</h1>
						<p className="text-muted-foreground">
							Visualizza e gestisci tutti gli ordini della piattaforma
						</p>
					</div>
				</div>

				{/* Statistics Cards */}
				<div className="grid gap-4 md:grid-cols-3">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Totale Ordini
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{orders.length}</div>
							<p className="text-xs text-muted-foreground">
								{pendingOrders} in attesa
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Ordini Pagati
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{paidOrders}</div>
							<p className="text-xs text-muted-foreground">
								{((paidOrders / orders.length) * 100).toFixed(1)}% del totale
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Ricavo Totale
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								€{totalRevenue.toFixed(2)}
							</div>
							<p className="text-xs text-muted-foreground">
								Media: €{(totalRevenue / orders.length || 0).toFixed(2)}
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Orders Table */}
				<Card>
					<CardHeader>
						<CardTitle>Elenco Ordini</CardTitle>
					</CardHeader>
					<CardContent>
						<DataTable
							columns={columns}
							data={orders}
							searchKey="user.name"
						/>
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
							Errore durante il caricamento degli ordini.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}
}
