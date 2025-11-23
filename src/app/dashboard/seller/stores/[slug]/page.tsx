import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DollarSign,
	Package,
	ShoppingCart,
	TrendingUp,
	Eye,
	Star,
} from "lucide-react";

interface SellerStorePageProps {
	params: Promise<{ slug: string }>;
}

export default async function SellerStorePage({
	params,
}: SellerStorePageProps) {
	const user = await currentUser();
	if (!user || user.privateMetadata.role !== "SELLER") {
		redirect("/");
	}

	const { slug } = await params;

	const store = await db.store.findUnique({
		where: { slug, userId: user.id },
		include: {
			products: {
				include: {
					variants: {
						include: {
							sizes: true,
						},
					},
					orderItems: {
						include: {
							orderGroup: {
								include: {
									order: true,
								},
							},
						},
					},
				},
			},
			orderGroups: {
				include: {
					items: true,
					order: true,
				},
			},
			_count: {
				select: {
					products: true,
					orderGroups: true,
					followers: true,
				},
			},
		},
	});

	if (!store) {
		redirect("/dashboard/seller/stores");
	}

	// Calculate statistics
	const totalProducts = store._count.products;
	const totalOrders = store._count.orderGroups;
	const totalFollowers = store._count.followers;

	// Calculate total revenue
	const totalRevenue = store.orderGroups
		.filter((og) => og.order.paymentStatus === "Paid")
		.reduce((sum, og) => sum + og.total, 0);

	// Calculate total sales (number of items sold)
	const totalSales = store.products.reduce(
		(sum, product) => sum + product.sales,
		0
	);

	// Calculate total views
	const totalViews = store.products.reduce(
		(sum, product) => sum + product.views,
		0
	);

	// Calculate total inventory
	const totalInventory = store.products.reduce((sum, product) => {
		const productInventory = product.variants.reduce((variantSum, variant) => {
			const variantInventory = variant.sizes.reduce(
				(sizeSum, size) => sizeSum + size.quantity,
				0
			);
			return variantSum + variantInventory;
		}, 0);
		return sum + productInventory;
	}, 0);

	// Recent orders (last 5)
	const recentOrders = store.orderGroups
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		)
		.slice(0, 5);

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">{store.name}</h1>
				<p className="text-muted-foreground">
					Panoramica delle prestazioni del tuo negozio
				</p>
			</div>

			{/* Statistics Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Ricavi Totali
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							€{totalRevenue.toFixed(2)}
						</div>
						<p className="text-xs text-muted-foreground">
							Da {totalOrders} ordini completati
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Prodotti</CardTitle>
						<Package className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalProducts}</div>
						<p className="text-xs text-muted-foreground">
							Prodotti pubblicati
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Ordini</CardTitle>
						<ShoppingCart className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalOrders}</div>
						<p className="text-xs text-muted-foreground">Ordini totali</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Vendite</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalSales}</div>
						<p className="text-xs text-muted-foreground">
							Articoli venduti
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Visualizzazioni
						</CardTitle>
						<Eye className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalViews}</div>
						<p className="text-xs text-muted-foreground">
							Visualizzazioni prodotti
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Inventario</CardTitle>
						<Package className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalInventory}</div>
						<p className="text-xs text-muted-foreground">
							Articoli in magazzino
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Store Info */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Informazioni Negozio</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">
								Valutazione
							</span>
							<div className="flex items-center gap-1">
								<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
								<span className="font-medium">
									{store.averageRating.toFixed(1)}
								</span>
								<span className="text-sm text-muted-foreground">
									({store.numReviews} recensioni)
								</span>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">
								Followers
							</span>
							<span className="font-medium">{totalFollowers}</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">Status</span>
							<span
								className={`rounded-full px-2 py-1 text-xs font-medium ${
									store.status === "ACTIVE"
										? "bg-green-100 text-green-800"
										: store.status === "PENDING"
											? "bg-yellow-100 text-yellow-800"
											: "bg-red-100 text-red-800"
								}`}
							>
								{store.status}
							</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Ordini Recenti</CardTitle>
					</CardHeader>
					<CardContent>
						{recentOrders.length === 0 ? (
							<p className="text-sm text-muted-foreground">
								Nessun ordine recente
							</p>
						) : (
							<div className="space-y-3">
								{recentOrders.map((orderGroup) => (
									<div
										key={orderGroup.id}
										className="flex items-center justify-between border-b pb-2 last:border-0"
									>
										<div>
											<p className="text-sm font-medium">
												Ordine #{orderGroup.id.slice(0, 8)}
											</p>
											<p className="text-xs text-muted-foreground">
												{new Date(orderGroup.createdAt).toLocaleDateString(
													"it-IT"
												)}
											</p>
										</div>
										<div className="text-right">
											<p className="text-sm font-medium">
												€{orderGroup.total.toFixed(2)}
											</p>
											<p className="text-xs text-muted-foreground">
												{orderGroup.status}
											</p>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
