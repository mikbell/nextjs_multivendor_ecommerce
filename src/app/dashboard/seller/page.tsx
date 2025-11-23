import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Title } from "@/components/dashboard/shared/title";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Package, ShoppingCart, TrendingUp, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function SellerDashboardPage() {
	const user = await currentUser();
	if (!user) {
		return redirect("/");
	}

	// Recupera statistiche del venditore
	const stores = await db.store.findMany({
		where: {
			userId: user.id,
		},
		include: {
			products: {
				select: {
					id: true,
				},
			},
			orderGroups: {
				select: {
					id: true,
					total: true,
					status: true,
				},
			},
		},
	});

	const totalStores = stores.length;
	const totalProducts = stores.reduce((sum, store) => sum + store.products.length, 0);
	const totalOrders = stores.reduce((sum, store) => sum + store.orderGroups.length, 0);
	const pendingOrders = stores.reduce(
		(sum, store) =>
			sum + store.orderGroups.filter((og) => og.status === "Pending").length,
		0
	);
	const totalRevenue = stores.reduce(
		(sum, store) =>
			sum +
			store.orderGroups
				.filter((og) => og.status === "Delivered")
				.reduce((orderSum, og) => orderSum + og.total, 0),
		0
	);

	// Se non ha negozi, reindirizza alla creazione
	if (totalStores === 0) {
		return redirect("/dashboard/seller/stores/new");
	}

	const stats = [
		{
			title: "Negozi",
			value: totalStores,
			icon: Store,
			description: "Negozi attivi",
			link: "/dashboard/seller/stores",
		},
		{
			title: "Prodotti",
			value: totalProducts,
			icon: Package,
			description: "Totale prodotti",
			link: "/dashboard/seller/stores",
		},
		{
			title: "Ordini",
			value: totalOrders,
			icon: ShoppingCart,
			description: `${pendingOrders} in attesa`,
			link: "/dashboard/seller/orders",
		},
		{
			title: "Guadagni",
			value: `€${totalRevenue.toFixed(2)}`,
			icon: DollarSign,
			description: "Ordini consegnati",
			link: "/dashboard/seller/orders",
		},
	];

	return (
		<div className="space-y-8">
			<Title title="Dashboard Venditore" />

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat) => {
					const Icon = stat.icon;
					return (
						<Link key={stat.title} href={stat.link}>
							<Card className="hover:border-primary transition-colors cursor-pointer">
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										{stat.title}
									</CardTitle>
									<Icon className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{stat.value}</div>
									<p className="text-xs text-muted-foreground">
										{stat.description}
									</p>
								</CardContent>
							</Card>
						</Link>
					);
				})}
			</div>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Azioni Rapide</CardTitle>
					<CardDescription>
						Gestisci i tuoi negozi e prodotti
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					<Link href="/dashboard/seller/stores">
						<Button variant="outline" className="w-full justify-start" size="lg">
							<Store className="mr-2 h-4 w-4" />
							Gestisci Negozi
						</Button>
					</Link>
					<Link href={`/dashboard/seller/stores/${stores[0]?.slug}/products`}>
						<Button variant="outline" className="w-full justify-start" size="lg">
							<Package className="mr-2 h-4 w-4" />
							Vedi Prodotti
						</Button>
					</Link>
					<Link href="/dashboard/seller/orders">
						<Button variant="outline" className="w-full justify-start" size="lg">
							<ShoppingCart className="mr-2 h-4 w-4" />
							Gestisci Ordini
						</Button>
					</Link>
					<Link href="/dashboard/seller/coupons">
						<Button variant="outline" className="w-full justify-start" size="lg">
							<TrendingUp className="mr-2 h-4 w-4" />
							Coupon
						</Button>
					</Link>
					<Link href="/dashboard/seller/stores/new">
						<Button variant="outline" className="w-full justify-start" size="lg">
							<Store className="mr-2 h-4 w-4" />
							Nuovo Negozio
						</Button>
					</Link>
					<Link href={`/dashboard/seller/stores/${stores[0]?.slug}/products/new`}>
						<Button variant="outline" className="w-full justify-start" size="lg">
							<Package className="mr-2 h-4 w-4" />
							Nuovo Prodotto
						</Button>
					</Link>
				</CardContent>
			</Card>

			{/* Negozi Overview */}
			<Card>
				<CardHeader>
					<CardTitle>I Tuoi Negozi</CardTitle>
					<CardDescription>
						Panoramica dei tuoi negozi
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{stores.map((store) => (
							<Link
								key={store.id}
								href={`/dashboard/seller/stores/${store.slug}`}
								className="flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-colors">
								<div className="flex items-center gap-4">
									<div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
										<Store className="h-6 w-6 text-muted-foreground" />
									</div>
									<div>
										<h3 className="font-semibold">{store.name}</h3>
										<p className="text-sm text-muted-foreground">
											{store.products.length} prodotti
										</p>
									</div>
								</div>
								<div className="text-right">
									<p className="text-sm font-medium">
										{store.orderGroups.length} ordini
									</p>
									<p className="text-xs text-muted-foreground">
										{store.status}
									</p>
								</div>
							</Link>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
