import React from "react";
import { getOrderDetailsForAdmin } from "@/queries/order";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import {
	ArrowLeft,
	User,
	Mail,
	MapPin,
	CreditCard,
	Package,
	Truck,
	Calendar,
} from "lucide-react";

type Props = {
	params: Promise<{
		id: string;
	}>;
};

const getOrderStatusConfig = (status: string) => {
	const configs: Record<
		string,
		{ label: string; variant: "default" | "secondary" | "destructive" | "outline" }
	> = {
		Pending: { label: "In Attesa", variant: "secondary" },
		Confirmed: { label: "Confermato", variant: "default" },
		Processing: { label: "In Elaborazione", variant: "default" },
		Shipped: { label: "Spedito", variant: "default" },
		OutforDelivery: { label: "In Consegna", variant: "default" },
		Delivered: { label: "Consegnato", variant: "default" },
		Cancelled: { label: "Annullato", variant: "destructive" },
		Failed: { label: "Fallito", variant: "destructive" },
		Refunded: { label: "Rimborsato", variant: "outline" },
		Returned: { label: "Restituito", variant: "outline" },
		PartiallyShipped: { label: "Parzialmente Spedito", variant: "secondary" },
		OnHold: { label: "In Attesa", variant: "outline" },
	};
	return configs[status] || { label: status, variant: "secondary" as const };
};

const getPaymentStatusConfig = (status: string) => {
	const configs: Record<
		string,
		{ label: string; variant: "default" | "secondary" | "destructive" | "outline" }
	> = {
		Pending: { label: "In Attesa", variant: "secondary" },
		Paid: { label: "Pagato", variant: "default" },
		Failed: { label: "Fallito", variant: "destructive" },
		Declined: { label: "Rifiutato", variant: "destructive" },
		Cancelled: { label: "Annullato", variant: "destructive" },
		Refunded: { label: "Rimborsato", variant: "outline" },
		PartiallyRefunded: { label: "Parzialmente Rimborsato", variant: "outline" },
		Chargeback: { label: "Chargeback", variant: "destructive" },
	};
	return configs[status] || { label: status, variant: "secondary" as const };
};

export default async function OrderDetailPage({ params }: Props) {
	const { id } = await params;

	try {
		const order = await getOrderDetailsForAdmin(id);

		const orderStatusInfo = getOrderStatusConfig(order.orderStatus);
		const paymentStatusInfo = getPaymentStatusConfig(order.paymentStatus);

		return (
			<div className="flex flex-col gap-6 p-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link href="/dashboard/admin/orders">
							<Button variant="ghost" size="icon">
								<ArrowLeft className="h-5 w-5" />
							</Button>
						</Link>
						<div>
							<h1 className="text-3xl font-bold tracking-tight">
								Dettagli Ordine
							</h1>
							<p className="text-muted-foreground font-mono text-sm">
								#{order.id}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Badge variant={orderStatusInfo.variant}>
							{orderStatusInfo.label}
						</Badge>
						<Badge variant={paymentStatusInfo.variant}>
							{paymentStatusInfo.label}
						</Badge>
					</div>
				</div>

				{/* Order Summary */}
				<div className="grid gap-6 md:grid-cols-3">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Subtotale</CardTitle>
							<Package className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								€{order.subTotal.toFixed(2)}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Spese Spedizione
							</CardTitle>
							<Truck className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								€{order.shippingFees.toFixed(2)}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Totale</CardTitle>
							<CreditCard className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								€{order.total.toFixed(2)}
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="grid gap-6 lg:grid-cols-2">
					{/* Customer Information */}
					<Card>
						<CardHeader>
							<CardTitle>Informazioni Cliente</CardTitle>
							<CardDescription>Dettagli dell'acquirente</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-start gap-4">
								<div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted">
									<Image
										src={order.user.picture}
										alt={order.user.name}
										fill
										className="object-cover"
									/>
								</div>
								<div className="flex-1 space-y-3">
									<div>
										<p className="font-medium">{order.user.name}</p>
										<p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
											<Mail className="h-3 w-3" />
											{order.user.email}
										</p>
									</div>
									<div className="flex items-center gap-2">
										<Badge variant="outline">
											<User className="h-3 w-3 mr-1" />
											Cliente
										</Badge>
										<span className="text-xs text-muted-foreground">
											Membro dal{" "}
											{new Date(order.user.createdAt).toLocaleDateString(
												"it-IT",
												{
													month: "long",
													year: "numeric",
												}
											)}
										</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Shipping Address */}
					<Card>
						<CardHeader>
							<CardTitle>Indirizzo di Spedizione</CardTitle>
							<CardDescription>Destinazione dell'ordine</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-start gap-3">
								<MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div className="flex-1 space-y-1">
									<p className="font-medium">
										{order.shippingAddress.firstName}{" "}
										{order.shippingAddress.lastName}
									</p>
									<p className="text-sm text-muted-foreground">
										{order.shippingAddress.address1}
									</p>
									{order.shippingAddress.address2 && (
										<p className="text-sm text-muted-foreground">
											{order.shippingAddress.address2}
										</p>
									)}
									<p className="text-sm text-muted-foreground">
										{order.shippingAddress.city}, {order.shippingAddress.state}{" "}
										{order.shippingAddress.zipCode}
									</p>
									<p className="text-sm text-muted-foreground">
										{order.shippingAddress.countryId}
									</p>
									<p className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
										<User className="h-3 w-3" />
										Tel: {order.shippingAddress.phone}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Order Information */}
				<Card>
					<CardHeader>
						<CardTitle>Informazioni Ordine</CardTitle>
						<CardDescription>Dettagli generali dell'ordine</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-1">
								<p className="text-sm font-medium flex items-center gap-2">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									Data Ordine
								</p>
								<p className="text-sm text-muted-foreground">
									{new Date(order.createdAt).toLocaleString("it-IT", {
										dateStyle: "long",
										timeStyle: "short",
									})}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-sm font-medium flex items-center gap-2">
									<CreditCard className="h-4 w-4 text-muted-foreground" />
									Metodo di Pagamento
								</p>
								<p className="text-sm text-muted-foreground">
									{order.paymentMethod || "Non specificato"}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-sm font-medium">Ultimo Aggiornamento</p>
								<p className="text-sm text-muted-foreground">
									{new Date(order.updatedAt).toLocaleString("it-IT", {
										dateStyle: "long",
										timeStyle: "short",
									})}
								</p>
							</div>
							{order.paymentDetails && (
								<div className="space-y-1">
									<p className="text-sm font-medium">ID Transazione</p>
									<p className="text-sm text-muted-foreground font-mono">
										{order.paymentDetails.id}
									</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Order Groups */}
				<div className="space-y-4">
					<h2 className="text-2xl font-bold">Articoli Ordine</h2>
					{order.orderGroups.map((group, groupIndex) => (
						<Card key={group.id}>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="relative h-10 w-10 overflow-hidden rounded-md">
											<Image
												src={group.store.logo}
												alt={group.store.name}
												fill
												className="object-cover"
											/>
										</div>
										<div>
											<CardTitle className="text-lg">
												Gruppo {groupIndex + 1} - {group.store.name}
											</CardTitle>
											<CardDescription>
												{group.items.length} articol
												{group.items.length === 1 ? "o" : "i"}
											</CardDescription>
										</div>
									</div>
									<Badge variant={getOrderStatusConfig(group.status).variant}>
										{getOrderStatusConfig(group.status).label}
									</Badge>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Shipping Info */}
								<div className="rounded-lg bg-muted p-4">
									<div className="grid gap-3 md:grid-cols-3">
										<div className="space-y-1">
											<p className="text-xs font-medium text-muted-foreground">
												Servizio Spedizione
											</p>
											<p className="text-sm font-medium">
												{group.shippingService}
											</p>
										</div>
										<div className="space-y-1">
											<p className="text-xs font-medium text-muted-foreground">
												Tempo Consegna
											</p>
											<p className="text-sm font-medium">
												{group.shippingDeliveryMin}-{group.shippingDeliveryMax}{" "}
												giorni
											</p>
										</div>
										<div className="space-y-1">
											<p className="text-xs font-medium text-muted-foreground">
												Costo Spedizione
											</p>
											<p className="text-sm font-medium">
												€{group.shippingFees.toFixed(2)}
											</p>
										</div>
									</div>
								</div>

								{/* Items */}
								<div className="space-y-3">
									{group.items.map((item) => (
										<div
											key={item.id}
											className="flex items-start gap-4 rounded-lg border p-4">
											<div className="relative h-20 w-20 overflow-hidden rounded-md bg-muted">
												<Image
													src={item.image}
													alt={item.name}
													fill
													className="object-cover"
												/>
											</div>
											<div className="flex-1 space-y-2">
												<div>
													<Link
														href={`/products/${item.productSlug}`}
														className="font-medium hover:underline">
														{item.name}
													</Link>
													<p className="text-sm text-muted-foreground">
														SKU: {item.sku} • Taglia: {item.size}
													</p>
												</div>
												<div className="flex items-center gap-4 text-sm">
													<span className="text-muted-foreground">
														Quantità: {item.quantity}
													</span>
													<span className="text-muted-foreground">
														Prezzo: €{item.price.toFixed(2)}
													</span>
													<Badge
														variant={
															item.status === "Delivered"
																? "default"
																: "secondary"
														}>
														{getOrderStatusConfig(item.status).label}
													</Badge>
												</div>
											</div>
											<div className="text-right">
												<p className="font-medium">
													€{item.totalPrice.toFixed(2)}
												</p>
												{item.shippingFee > 0 && (
													<p className="text-xs text-muted-foreground">
														+€{item.shippingFee.toFixed(2)} spedizione
													</p>
												)}
											</div>
										</div>
									))}
								</div>

								<Separator />

								{/* Group Summary */}
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Subtotale</span>
										<span className="font-medium">
											€{group.subTotal.toFixed(2)}
										</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Spedizione</span>
										<span className="font-medium">
											€{group.shippingFees.toFixed(2)}
										</span>
									</div>
									<Separator />
									<div className="flex justify-between text-base font-bold">
										<span>Totale Gruppo</span>
										<span>€{group.total.toFixed(2)}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Order Total Summary */}
				<Card>
					<CardHeader>
						<CardTitle>Riepilogo Ordine</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Subtotale</span>
								<span className="font-medium">€{order.subTotal.toFixed(2)}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">
									Spese di Spedizione
								</span>
								<span className="font-medium">
									€{order.shippingFees.toFixed(2)}
								</span>
							</div>
							<Separator />
							<div className="flex justify-between text-lg font-bold">
								<span>Totale</span>
								<span>€{order.total.toFixed(2)}</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	} catch (error) {
		return (
			<div className="flex flex-col gap-6 p-6">
				<div className="flex items-center gap-4">
					<Link href="/dashboard/admin/orders">
						<Button variant="ghost" size="icon">
							<ArrowLeft className="h-5 w-5" />
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Errore</h1>
						<p className="text-muted-foreground">
							Impossibile caricare i dettagli dell'ordine
						</p>
					</div>
				</div>
				<Card>
					<CardContent className="pt-6">
						<p className="text-center text-muted-foreground">
							{error instanceof Error
								? error.message
								: "Si è verificato un errore durante il caricamento dei dati."}
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}
}
