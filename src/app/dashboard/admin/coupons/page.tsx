import React from "react";
import { getAllCouponsForAdmin } from "@/queries/coupon";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/dashboard/admin/coupons/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, TrendingUp, Users } from "lucide-react";

export default async function CouponsPage() {
	try {
		const coupons = await getAllCouponsForAdmin();

		// Calculate statistics
		const activeCoupons = coupons.filter((coupon) => coupon.isActive).length;
		const totalUsage = coupons.reduce(
			(sum, coupon) => sum + coupon.usageCount,
			0
		);
		const totalOrders = coupons.reduce(
			(sum, coupon) => sum + coupon._count.orderGroups,
			0
		);

		// Calculate expired coupons
		const now = new Date();
		const expiredCoupons = coupons.filter((coupon) => {
			const endDate = new Date(coupon.endDate);
			return endDate < now;
		}).length;

		return (
			<div className="flex flex-col gap-6 p-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Coupon</h1>
						<p className="text-muted-foreground">
							Visualizza e gestisci tutti i coupon della piattaforma
						</p>
					</div>
				</div>

				{/* Statistics Cards */}
				<div className="grid gap-4 md:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Totale Coupon
							</CardTitle>
							<Tag className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{coupons.length}</div>
							<p className="text-xs text-muted-foreground">
								{activeCoupons} attivi • {expiredCoupons} scaduti
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Coupon Attivi
							</CardTitle>
							<TrendingUp className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{activeCoupons}</div>
							<p className="text-xs text-muted-foreground">
								{((activeCoupons / coupons.length) * 100 || 0).toFixed(1)}% del
								totale
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Utilizzi Totali
							</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{totalUsage}</div>
							<p className="text-xs text-muted-foreground">
								Media: {(totalUsage / coupons.length || 0).toFixed(1)} per coupon
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Ordini</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{totalOrders}</div>
							<p className="text-xs text-muted-foreground">
								Ordini con coupon applicato
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Coupons Table */}
				<Card>
					<CardHeader>
						<CardTitle>Elenco Coupon</CardTitle>
					</CardHeader>
					<CardContent>
						<DataTable columns={columns} data={coupons} searchKey="code" />
					</CardContent>
				</Card>
			</div>
		);
	} catch (error) {
		return (
			<div className="flex flex-col gap-6 p-6">
				<Card>
					<CardContent className="pt-6">
						<p className="text-center text-muted-foreground">
							Errore durante il caricamento dei coupon.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}
}
