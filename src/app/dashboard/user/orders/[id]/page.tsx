import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
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
import { ArrowLeft, Package, Truck, MapPin, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function OrderDetailPage({
	params,
}: {
	params: { id: string };
}) {
	const user = await currentUser();
	if (!user) {
		return redirect("/sign-in");
	}

	const order = await db.order.findUnique({
		where: { id: params.id },
		include: {
			orderGroups: {
				include: {
					items: true,
					store: true,
					coupon: true,
				},
			},
			shippingAddress: {
				include: {
					country: true,
				},
			},
			paymentDetails: true,
		},
	});

	if (!order || order.userId !== user.id) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-background p-6">
			<div className="max-w-5xl mx-auto">
				<div className="mb-8">
					<Link href="/dashboard/user/orders">
						<Button variant="ghost" size="sm" className="mb-4">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Torna agli ordini
						</Button>
					</Link>
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold mb-2">
								Ordine #{order.id.slice(0, 8)}
							</h1>
							<p className="text-muted-foreground">
								{new Date(order.createdAt).toLocaleDateString("it-IT", {
									day: "numeric",
									month: "long",
									year: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</p>
						</div>
						<Badge
							variant={
								order.orderStatus === "Delivered"
									? "default"
									: order.orderStatus === "Cancelled"
									? "destructive"
									: "secondary"
							}
							className="text-lg px-4 py-2">
							{order.orderStatus}
						</Badge>
					</div>
				</div>

				<div className="grid gap-6 lg:grid-cols-3">
					{/* Colonna principale */}
					<div className="lg:col-span-2 space-y-6">
						{/* Prodotti per negozio */}
						{order.orderGroups.map((group) => (
							<Card key={group.id}>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle className="flex items-center gap-2">
											<Package className="h-5 w-5" />
											{group.store.name}
										</CardTitle>
										<Badge variant="outline">{group.status}</Badge>
									</div>
									<CardDescription>
										<div className="flex items-center gap-2 mt-2">
											<Truck className="h-4 w-4" />
											{group.shippingService} • {group.shippingDeliveryMin}-
											{group.shippingDeliveryMax} giorni
										</div>
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{group.items.map((item) => (
											<div
												key={item.id}
												className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
												<Image
													width={80}
													height={80}
													src={item.image}
													alt={item.name}
													className="w-20 h-20 object-cover rounded"
												/>
												<div className="flex-1">
													<div className="font-medium mb-1">{item.name}</div>
													<div className="text-sm text-muted-foreground">
														Taglia: {item.size}
													</div>
													<div className="text-sm text-muted-foreground">
														SKU: {item.sku}
													</div>
													<div className="text-sm text-muted-foreground">
														Quantità: {item.quantity}
													</div>
													<Badge variant="secondary" className="mt-2">
														{item.status}
													</Badge>
												</div>
												<div className="text-right">
													<div className="font-bold text-lg">
														€{item.totalPrice.toFixed(2)}
													</div>
													<div className="text-sm text-muted-foreground">
														€{item.price.toFixed(2)} cad.
													</div>
													{item.shippingFee > 0 && (
														<div className="text-xs text-muted-foreground mt-1">
															+ €{item.shippingFee.toFixed(2)} spedizione
														</div>
													)}
												</div>
											</div>
										))}
									</div>

									{/* Riepilogo gruppo */}
									<div className="mt-4 pt-4 border-t space-y-2">
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">Subtotale</span>
											<span className="font-medium">
												€{group.subTotal.toFixed(2)}
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">
												Spese di spedizione
											</span>
											<span className="font-medium">
												€{group.shippingFees.toFixed(2)}
											</span>
										</div>
										{group.coupon && (
											<div className="flex justify-between text-sm text-green-600">
												<span>Coupon applicato</span>
												<span className="font-medium">
													-€
													{(
														group.subTotal -
														group.total +
														group.shippingFees
													).toFixed(2)}
												</span>
											</div>
										)}
										<div className="flex justify-between text-base font-bold pt-2 border-t">
											<span>Totale gruppo</span>
											<span>€{group.total.toFixed(2)}</span>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Riepilogo ordine */}
						<Card>
							<CardHeader>
								<CardTitle>Riepilogo Ordine</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Subtotale</span>
									<span className="font-medium">
										€{order.subTotal.toFixed(2)}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">
										Spese di spedizione
									</span>
									<span className="font-medium">
										€{order.shippingFees.toFixed(2)}
									</span>
								</div>
								<div className="flex justify-between text-lg font-bold pt-3 border-t">
									<span>Totale</span>
									<span>€{order.total.toFixed(2)}</span>
								</div>
							</CardContent>
						</Card>

						{/* Indirizzo di spedizione */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<MapPin className="h-5 w-5" />
									Indirizzo di Spedizione
								</CardTitle>
							</CardHeader>
							<CardContent className="text-sm space-y-1">
								<div className="font-medium">
									{order.shippingAddress.firstName}{" "}
									{order.shippingAddress.lastName}
								</div>
								<div>{order.shippingAddress.address1}</div>
								{order.shippingAddress.address2 && (
									<div>{order.shippingAddress.address2}</div>
								)}
								<div>
									{order.shippingAddress.city}, {order.shippingAddress.state}{" "}
									{order.shippingAddress.zipCode}
								</div>
								<div>{order.shippingAddress.country.name}</div>
								<div className="pt-2 text-muted-foreground">
									Tel: {order.shippingAddress.phone}
								</div>
							</CardContent>
						</Card>

						{/* Pagamento */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<CreditCard className="h-5 w-5" />
									Pagamento
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Metodo</span>
									<span className="font-medium">
										{order.paymentMethod || "Non specificato"}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Stato</span>
									<Badge
										variant={
											order.paymentStatus === "Paid"
												? "default"
												: order.paymentStatus === "Failed"
												? "destructive"
												: "secondary"
										}>
										{order.paymentStatus}
									</Badge>
								</div>
								{order.paymentDetails && (
									<div className="pt-2 border-t">
										<div className="text-muted-foreground">
											ID Transazione:{" "}
											{order.paymentDetails.paymentInetntId.slice(0, 16)}...
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
