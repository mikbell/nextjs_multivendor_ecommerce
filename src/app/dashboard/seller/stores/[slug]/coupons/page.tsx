import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, TrendingUp, Users } from "lucide-react";

interface SellerCouponsPageProps {
	params: Promise<{ slug: string }>;
}

export default async function SellerCouponsPage({
	params,
}: SellerCouponsPageProps) {
	const user = await currentUser();
	if (!user || user.privateMetadata.role !== "SELLER") {
		redirect("/");
	}

	const { slug } = await params;

	const store = await db.store.findUnique({
		where: { slug, userId: user.id },
		include: {
			coupons: {
				include: {
					users: true,
					_count: {
						select: {
							users: true,
							orderGroups: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			},
		},
	});

	if (!store) {
		redirect("/dashboard/seller/stores");
	}

	const couponsData = store.coupons.map((coupon) => ({
		id: coupon.id,
		code: coupon.code,
		discount: coupon.discount,
		startDate: coupon.startDate,
		endDate: coupon.endDate,
		usageLimit: coupon.usageLimit,
		usageCount: coupon.usageCount,
		totalUsers: coupon._count.users,
		totalOrders: coupon._count.orderGroups,
		isActive: coupon.isActive,
		createdAt: coupon.createdAt,
	}));

	// Calculate statistics
	const totalCoupons = couponsData.length;
	const activeCoupons = couponsData.filter((c) => c.isActive).length;
	const totalUsage = couponsData.reduce((sum, c) => sum + c.usageCount, 0);
	const totalUsers = couponsData.reduce((sum, c) => sum + c.totalUsers, 0);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Coupon</h1>
					<p className="text-muted-foreground">
						Gestisci i coupon sconto del tuo negozio
					</p>
				</div>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Nuovo Coupon
				</Button>
			</div>

			{/* Statistics Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Coupon Totali
						</CardTitle>
						<Ticket className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalCoupons}</div>
						<p className="text-xs text-muted-foreground">
							{activeCoupons} attivi
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Utilizzi Totali
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalUsage}</div>
						<p className="text-xs text-muted-foreground">
							Coupon utilizzati
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Utenti Unici
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalUsers}</div>
						<p className="text-xs text-muted-foreground">
							Hanno usato i coupon
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Sconto Medio
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{totalCoupons > 0
								? (
										couponsData.reduce((sum, c) => sum + c.discount, 0) /
										totalCoupons
									).toFixed(0)
								: 0}
							%
						</div>
						<p className="text-xs text-muted-foreground">
							Su tutti i coupon
						</p>
					</CardContent>
				</Card>
			</div>

			<DataTable columns={columns} data={couponsData} searchKey="code" />
		</div>
	);
}
