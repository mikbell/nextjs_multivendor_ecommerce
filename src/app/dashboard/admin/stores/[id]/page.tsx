import React from "react";
import { getStoreDetailsForAdmin } from "@/queries/store";
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
	Store,
	Mail,
	Phone,
	Calendar,
	Star,
	Package,
	ShoppingCart,
	Users,
	ArrowLeft,
	ExternalLink,
} from "lucide-react";

type Props = {
	params: Promise<{
		id: string;
	}>;
};

export default async function StoreDetailPage({ params }: Props) {
	const { id } = await params;

	try {
		const store = await getStoreDetailsForAdmin(id);

		const statusConfig = {
			PENDING: { label: "In Attesa", variant: "secondary" as const },
			ACTIVE: { label: "Attivo", variant: "default" as const },
			BANNED: { label: "Bannato", variant: "destructive" as const },
			DISABLED: { label: "Disabilitato", variant: "outline" as const },
		};

		const statusInfo = statusConfig[store.status];

		return (
			<div className="flex flex-col gap-6 p-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link href="/dashboard/admin/stores">
							<Button variant="ghost" size="icon">
								<ArrowLeft className="h-5 w-5" />
							</Button>
						</Link>
						<div>
							<h1 className="text-3xl font-bold tracking-tight">
								Dettagli Negozio
							</h1>
							<p className="text-muted-foreground">
								Visualizza e gestisci le informazioni del negozio
							</p>
						</div>
					</div>
					<Link href={`/stores/${store.url}`} target="_blank">
						<Button variant="outline">
							<ExternalLink className="h-4 w-4 mr-2" />
							Visualizza Negozio Pubblico
						</Button>
					</Link>
				</div>

				{/* Cover Image */}
				<Card>
					<CardContent className="p-0">
						<div className="relative h-64 w-full overflow-hidden rounded-t-lg">
							<Image
								src={store.cover}
								alt={store.name}
								fill
								className="object-cover"
							/>
						</div>
						<div className="relative -mt-16 px-6">
							<div className="flex items-end gap-6">
								<div className="relative h-32 w-32 overflow-hidden rounded-lg border-4 border-background bg-background">
									<Image
										src={store.logo}
										alt={store.name}
										fill
										className="object-cover"
									/>
								</div>
								<div className="flex-1 pb-4">
									<div className="flex items-center gap-3 mb-2">
										<h2 className="text-2xl font-bold">{store.name}</h2>
										<Badge variant={statusInfo.variant}>
											{statusInfo.label}
										</Badge>
										{store.featured && (
											<Badge variant="default">In Evidenza</Badge>
										)}
									</div>
									<p className="text-muted-foreground">{store.description}</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					{/* Stats Cards */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Prodotti Totali
							</CardTitle>
							<Package className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{store._count.products}</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Ordini</CardTitle>
							<ShoppingCart className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{store._count.orderGroups}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Followers</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{store._count.followers}</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Rating</CardTitle>
							<Star className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{store.averageRating.toFixed(1)}
							</div>
							<p className="text-xs text-muted-foreground">
								{store.numReviews} recensioni
							</p>
						</CardContent>
					</Card>
				</div>

				<div className="grid gap-6 lg:grid-cols-2">
					{/* Store Information */}
					<Card>
						<CardHeader>
							<CardTitle>Informazioni Negozio</CardTitle>
							<CardDescription>
								Dettagli di contatto e configurazione
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-start gap-3">
								<Store className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div className="flex-1 space-y-1">
									<p className="text-sm font-medium">URL Negozio</p>
									<p className="text-sm text-muted-foreground">
										{store.url}
									</p>
								</div>
							</div>

							<Separator />

							<div className="flex items-start gap-3">
								<Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div className="flex-1 space-y-1">
									<p className="text-sm font-medium">Email</p>
									<p className="text-sm text-muted-foreground">
										{store.email}
									</p>
								</div>
							</div>

							<Separator />

							<div className="flex items-start gap-3">
								<Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div className="flex-1 space-y-1">
									<p className="text-sm font-medium">Telefono</p>
									<p className="text-sm text-muted-foreground">
										{store.phone}
									</p>
								</div>
							</div>

							<Separator />

							<div className="flex items-start gap-3">
								<Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div className="flex-1 space-y-1">
									<p className="text-sm font-medium">Data Creazione</p>
									<p className="text-sm text-muted-foreground">
										{new Date(store.createdAt).toLocaleDateString("it-IT", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Owner Information */}
					<Card>
						<CardHeader>
							<CardTitle>Proprietario</CardTitle>
							<CardDescription>
								Informazioni sul venditore del negozio
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-start gap-4">
								<div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted">
									<Image
										src={store.user.picture}
										alt={store.user.name}
										fill
										className="object-cover"
									/>
								</div>
								<div className="flex-1 space-y-3">
									<div>
										<p className="font-medium">{store.user.name}</p>
										<p className="text-sm text-muted-foreground">
											{store.user.email}
										</p>
									</div>
									<div className="flex items-center gap-2">
										<Badge variant="outline">{store.user.role}</Badge>
										<span className="text-xs text-muted-foreground">
											Membro dal{" "}
											{new Date(store.user.createdAt).toLocaleDateString(
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
				</div>

				{/* Shipping Information */}
				<Card>
					<CardHeader>
						<CardTitle>Informazioni Spedizione</CardTitle>
						<CardDescription>
							Configurazione predefinita delle spedizioni
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-1">
								<p className="text-sm font-medium">Servizio Predefinito</p>
								<p className="text-sm text-muted-foreground">
									{store.defaultShippingService}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-sm font-medium">Tempo di Consegna</p>
								<p className="text-sm text-muted-foreground">
									{store.defaultDeliveryTimeMin}-{store.defaultDeliveryTimeMax}{" "}
									giorni
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-sm font-medium">Tariffa per Articolo</p>
								<p className="text-sm text-muted-foreground">
									€{store.defaultShippingFeePerItem.toFixed(2)}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-sm font-medium">Tariffa Fissa</p>
								<p className="text-sm text-muted-foreground">
									€{store.defaultShippingFeeFixed.toFixed(2)}
								</p>
							</div>
							<div className="space-y-1 md:col-span-2">
								<p className="text-sm font-medium">Politica di Reso</p>
								<p className="text-sm text-muted-foreground">
									{store.returnPolicy}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Top Products */}
				{store.products.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle>Prodotti Principali</CardTitle>
							<CardDescription>
								I 10 prodotti più venduti del negozio
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{store.products.map((product) => (
									<div
										key={product.id}
										className="flex items-center justify-between rounded-lg border p-3">
										<div className="flex-1">
											<Link
												href={`/products/${product.slug}`}
												className="font-medium hover:underline">
												{product.name}
											</Link>
											<div className="flex items-center gap-4 mt-1">
												<span className="text-xs text-muted-foreground">
													Vendite: {product.sales}
												</span>
												<span className="text-xs text-muted-foreground">
													Visualizzazioni: {product.views}
												</span>
												<span className="text-xs text-muted-foreground">
													Rating: {product.rating.toFixed(1)}
												</span>
											</div>
										</div>
										<Badge
											variant={product.isActive ? "default" : "secondary"}>
											{product.isActive ? "Attivo" : "Inattivo"}
										</Badge>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		);
	} catch (error) {
		return (
			<div className="flex flex-col gap-6 p-6">
				<div className="flex items-center gap-4">
					<Link href="/dashboard/admin/stores">
						<Button variant="ghost" size="icon">
							<ArrowLeft className="h-5 w-5" />
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Errore</h1>
						<p className="text-muted-foreground">
							Impossibile caricare i dettagli del negozio
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
