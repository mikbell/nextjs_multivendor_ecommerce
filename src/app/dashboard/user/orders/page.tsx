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
import { Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Heading from "@/components/shared/heading";

export default async function UserOrdersPage() {
	const user = await currentUser();
	if (!user) {
		return redirect("/sign-in");
	}

	const orders = await db.order.findMany({
		where: { userId: user.id },
		include: {
			orderGroups: {
				include: {
					items: true,
					store: true,
				},
			},
		},
		orderBy: { createdAt: "desc" },
	});

	return (
		<div className="min-h-screen bg-background p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<Link href="/dashboard/user">
						<Button variant="ghost" size="sm" className="mb-4">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Torna alla Dashboard
						</Button>
					</Link>
						<Heading>I miei ordini</Heading>
					<p className="text-muted-foreground">
						Visualizza e gestisci tutti i tuoi ordini
					</p>
				</div>

				{orders.length === 0 ? (
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-12 text-center">
							<Package className="h-16 w-16 text-muted-foreground mb-4" />
							<h3 className="text-xl font-semibold mb-2">
								Nessun ordine trovato
							</h3>
							<p className="text-muted-foreground mb-6">
								Non hai ancora effettuato nessun ordine
							</p>
							<Link href="/">
								<Button>Inizia a fare shopping</Button>
							</Link>
						</CardContent>
					</Card>
				) : (
					<div className="space-y-6">
						{orders.map((order) => (
							<Card key={order.id}>
								<CardHeader>
									<div className="flex items-center justify-between">
										<div>
											<CardTitle className="flex items-center gap-3">
												Ordine #{order.id.slice(0, 8)}
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
											</CardTitle>
											<CardDescription>
												{new Date(order.createdAt).toLocaleDateString("it-IT", {
													day: "numeric",
													month: "long",
													year: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												})}
											</CardDescription>
										</div>
										<div className="text-right">
											<div className="text-2xl font-bold">
												€{order.total.toFixed(2)}
											</div>
											<div className="text-sm text-muted-foreground">
												Stato pagamento:{" "}
												<span className="font-medium">
													{order.paymentStatus}
												</span>
											</div>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{order.orderGroups.map((group) => (
											<div
												key={group.id}
												className="border-t pt-4 first:border-t-0 first:pt-0">
												<div className="flex items-center justify-between mb-3">
													<div className="font-medium">
														Negozio: {group.store.name}
													</div>
													<Badge variant="outline">{group.status}</Badge>
												</div>
												<div className="space-y-2">
													{group.items.map((item) => (
														<div
															key={item.id}
															className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
															<Image
																width={64}
																height={64}
																src={item.image}
																alt={item.name}
																className="w-16 h-16 object-cover rounded"
															/>
															<div className="flex-1">
																<div className="font-medium">{item.name}</div>
																<div className="text-sm text-muted-foreground">
																	Taglia: {item.size} • Quantità:{" "}
																	{item.quantity}
																</div>
																<div className="text-sm text-muted-foreground">
																	SKU: {item.sku}
																</div>
															</div>
															<div className="text-right">
																<div className="font-bold">
																	€{item.totalPrice.toFixed(2)}
																</div>
																<div className="text-sm text-muted-foreground">
																	€{item.price.toFixed(2)} cad.
																</div>
															</div>
														</div>
													))}
												</div>
												<div className="mt-3 text-sm text-muted-foreground">
													Spedizione: {group.shippingService} (
													{group.shippingDeliveryMin}-
													{group.shippingDeliveryMax} giorni) • €
													{group.shippingFees.toFixed(2)}
												</div>
											</div>
										))}
									</div>
									<div className="flex justify-end gap-3 mt-4 pt-4 border-t">
										<Link href={`/dashboard/user/orders/${order.id}`}>
											<Button variant="outline">Vedi dettagli</Button>
										</Link>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
