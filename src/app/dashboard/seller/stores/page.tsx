import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Title } from "@/components/dashboard/shared/title";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store as StoreIcon, Plus, Package, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default async function SellerStoresPage() {
	const user = await currentUser();
	if (!user) {
		return redirect("/");
	}

	// Recupera tutti i negozi del venditore con statistiche
	const stores = await db.store.findMany({
		where: {
			userId: user.id,
		},
		include: {
			_count: {
				select: {
					products: true,
					orderGroups: true,
					coupons: true,
					followers: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const totalStores = stores.length;
	const activeStores = stores.filter((s) => s.status === "ACTIVE").length;
	const totalProducts = stores.reduce((sum, store) => sum + store._count.products, 0);

	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<Title title="I Miei Negozi" />
				<Link href="/dashboard/seller/stores/new">
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Nuovo Negozio
					</Button>
				</Link>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Totale Negozi
						</CardTitle>
						<StoreIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalStores}</div>
						<p className="text-xs text-muted-foreground">
							{activeStores} attivi
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Prodotti Totali
						</CardTitle>
						<Package className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalProducts}</div>
						<p className="text-xs text-muted-foreground">
							In tutti i negozi
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Ordini Totali
						</CardTitle>
						<ShoppingCart className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stores.reduce((sum, store) => sum + store._count.orderGroups, 0)}
						</div>
						<p className="text-xs text-muted-foreground">
							Da tutti i negozi
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Stores List */}
			<Card>
				<CardHeader>
					<CardTitle>Elenco Negozi</CardTitle>
					<CardDescription>
						Gestisci e monitora i tuoi negozi
					</CardDescription>
				</CardHeader>
				<CardContent>
					{stores.length === 0 ? (
						<div className="text-center py-12">
							<StoreIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
							<h3 className="text-lg font-semibold mb-2">
								Nessun negozio creato
							</h3>
							<p className="text-muted-foreground mb-6">
								Crea il tuo primo negozio per iniziare a vendere
							</p>
							<Link href="/dashboard/seller/stores/new">
								<Button size="lg">
									<Plus className="mr-2 h-4 w-4" />
									Crea Negozio
								</Button>
							</Link>
						</div>
					) : (
						<div className="grid gap-6 md:grid-cols-2">
							{stores.map((store) => (
								<Link
									key={store.id}
									href={`/dashboard/seller/stores/${store.slug}`}
									className="border rounded-lg overflow-hidden hover:border-primary transition-colors group">
									{/* Store Cover */}
									<div className="relative h-32 bg-muted">
										<Image
											src={store.cover}
											alt={store.name}
											fill
											className="object-cover group-hover:scale-105 transition-transform"
										/>
									</div>

									{/* Store Info */}
									<div className="p-4">
										<div className="flex items-start justify-between mb-3">
											<div className="flex items-center gap-3">
												<div className="relative h-12 w-12 rounded-full border-2 border-background -mt-8 overflow-hidden">
													<Image
														src={store.logo}
														alt={store.name}
														fill
														className="object-cover"
													/>
												</div>
												<div>
													<h3 className="font-semibold">{store.name}</h3>
													<p className="text-xs text-muted-foreground">
														/{store.slug}
													</p>
												</div>
											</div>
											<Badge
												variant={
													store.status === "ACTIVE"
														? "default"
														: store.status === "PENDING"
														? "secondary"
														: "destructive"
												}>
												{store.status === "ACTIVE"
													? "Attivo"
													: store.status === "PENDING"
													? "In Revisione"
													: store.status === "BANNED"
													? "Bannato"
													: "Disabilitato"}
											</Badge>
										</div>

										<p className="text-sm text-muted-foreground line-clamp-2 mb-4">
											{store.description}
										</p>

										{/* Stats */}
										<div className="grid grid-cols-4 gap-2 text-center">
											<div className="bg-muted/50 rounded p-2">
												<Package className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
												<p className="text-xs font-semibold">
													{store._count.products}
												</p>
												<p className="text-xs text-muted-foreground">
													Prodotti
												</p>
											</div>
											<div className="bg-muted/50 rounded p-2">
												<ShoppingCart className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
												<p className="text-xs font-semibold">
													{store._count.orderGroups}
												</p>
												<p className="text-xs text-muted-foreground">
													Ordini
												</p>
											</div>
											<div className="bg-muted/50 rounded p-2">
												<Star className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
												<p className="text-xs font-semibold">
													{store.averageRating.toFixed(1)}
												</p>
												<p className="text-xs text-muted-foreground">
													Rating
												</p>
											</div>
											<div className="bg-muted/50 rounded p-2">
												<StoreIcon className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
												<p className="text-xs font-semibold">
													{store._count.followers}
												</p>
												<p className="text-xs text-muted-foreground">
													Follower
												</p>
											</div>
										</div>
									</div>
								</Link>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
