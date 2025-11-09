import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Heart, MapPin, ShoppingCart, DollarSign } from "lucide-react";
import Link from "next/link";

export default async function UserDashboardPage() {
	const user = await currentUser();
	if (!user) {
		return redirect("/sign-in");
	}

	// Recupera i dati dell'utente
	const [orders, wishlistCount, addressCount, recentOrders] = await Promise.all(
		[
			db.order.findMany({
				where: { userId: user.id },
				include: {
					orderGroups: {
						include: {
							items: true,
						},
					},
				},
				orderBy: { createdAt: "desc" },
			}),
			db.wishlist.count({
				where: { userId: user.id },
			}),
			db.shippingAddress.count({
				where: { userId: user.id },
			}),
			db.order.findMany({
				where: { userId: user.id },
				include: {
					orderGroups: {
						include: {
							items: {
								take: 3,
							},
						},
					},
				},
				orderBy: { createdAt: "desc" },
				take: 5,
			}),
		]
	);

	// Calcola statistiche
	const totalOrders = orders.length;
	const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
	const pendingOrders = orders.filter(
		(order) => order.orderStatus === "Pending"
	).length;
	const deliveredOrders = orders.filter(
		(order) => order.orderStatus === "Delivered"
	).length;

	return (
		<div className="min-h-screen bg-background p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2">Dashboard Utente</h1>
					<p className="text-muted-foreground">
						Benvenuto, {user.firstName || user.emailAddresses[0]?.emailAddress}!
					</p>
				</div>

				{/* Statistiche principali */}
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Ordini Totali
							</CardTitle>
							<Package className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{totalOrders}</div>
							<p className="text-xs text-muted-foreground">
								{pendingOrders} in elaborazione
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Totale Speso
							</CardTitle>
							<DollarSign className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">€{totalSpent.toFixed(2)}</div>
							<p className="text-xs text-muted-foreground">
								{deliveredOrders} ordini completati
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Wishlist</CardTitle>
							<Heart className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{wishlistCount}</div>
							<p className="text-xs text-muted-foreground">prodotti salvati</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Indirizzi</CardTitle>
							<MapPin className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{addressCount}</div>
							<p className="text-xs text-muted-foreground">
								indirizzi di spedizione
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Sezione ordini recenti */}
				<div className="grid gap-6 lg:grid-cols-2">
					<Card className="lg:col-span-2">
						<CardHeader>
							<CardTitle>Ordini Recenti</CardTitle>
							<CardDescription>
								I tuoi ultimi 5 ordini effettuati
							</CardDescription>
						</CardHeader>
						<CardContent>
							{recentOrders.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-8 text-center">
									<ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
									<p className="text-muted-foreground mb-4">
										Non hai ancora effettuato nessun ordine
									</p>
									<Link href="/">
										<Button>Inizia a fare shopping</Button>
									</Link>
								</div>
							) : (
								<div className="space-y-4">
									{recentOrders.map((order) => (
										<div
											key={order.id}
											className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-2">
													<span className="font-medium">
														Ordine #{order.id.slice(0, 8)}
													</span>
													<Badge
														variant={
															order.orderStatus === "Delivered"
																? "default"
																: order.orderStatus === "Cancelled"
																? "destructive"
																: "secondary"
														}>
														{order.orderStatus}
													</Badge>
												</div>
												<div className="text-sm text-muted-foreground">
													{new Date(order.createdAt).toLocaleDateString(
														"it-IT",
														{
															day: "numeric",
															month: "long",
															year: "numeric",
														}
													)}
													{" • "}
													{order.orderGroups.reduce(
														(sum, group) => sum + group.items.length,
														0
													)}{" "}
													{order.orderGroups.reduce(
														(sum, group) => sum + group.items.length,
														0
													) === 1
														? "prodotto"
														: "prodotti"}
												</div>
											</div>
											<div className="text-right">
												<div className="font-bold text-lg">
													€{order.total.toFixed(2)}
												</div>
												<Link href={`/dashboard/user/orders/${order.id}`}>
													<Button variant="ghost" size="sm">
														Dettagli
													</Button>
												</Link>
											</div>
										</div>
									))}
									{totalOrders > 5 && (
										<Link href="/dashboard/user/orders">
											<Button variant="outline" className="w-full">
												Vedi tutti gli ordini ({totalOrders})
											</Button>
										</Link>
									)}
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Azioni rapide */}
				<div className="grid gap-6 md:grid-cols-3 mt-6">
					<Link href="/dashboard/user/orders">
						<Card className="hover:shadow-lg transition-shadow cursor-pointer">
							<CardHeader>
								<div className="flex items-center gap-3">
									<div className="p-3 bg-primary/10 rounded-lg">
										<Package className="h-6 w-6 text-primary" />
									</div>
									<div>
										<CardTitle className="text-lg">I Miei Ordini</CardTitle>
										<CardDescription>
											Traccia e gestisci i tuoi ordini
										</CardDescription>
									</div>
								</div>
							</CardHeader>
						</Card>
					</Link>

					<Link href="/dashboard/user/wishlist">
						<Card className="hover:shadow-lg transition-shadow cursor-pointer">
							<CardHeader>
								<div className="flex items-center gap-3">
									<div className="p-3 bg-red-500/10 rounded-lg">
										<Heart className="h-6 w-6 text-red-500" />
									</div>
									<div>
										<CardTitle className="text-lg">Wishlist</CardTitle>
										<CardDescription>
											Visualizza i tuoi prodotti preferiti
										</CardDescription>
									</div>
								</div>
							</CardHeader>
						</Card>
					</Link>

					<Link href="/dashboard/user/addresses">
						<Card className="hover:shadow-lg transition-shadow cursor-pointer">
							<CardHeader>
								<div className="flex items-center gap-3">
									<div className="p-3 bg-blue-500/10 rounded-lg">
										<MapPin className="h-6 w-6 text-blue-500" />
									</div>
									<div>
										<CardTitle className="text-lg">Indirizzi</CardTitle>
										<CardDescription>
											Gestisci i tuoi indirizzi di spedizione
										</CardDescription>
									</div>
								</div>
							</CardHeader>
						</Card>
					</Link>
				</div>
			</div>
		</div>
	);
}
