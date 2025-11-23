import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Globe, DollarSign } from "lucide-react";

interface SellerShippingPageProps {
	params: Promise<{ slug: string }>;
}

export default async function SellerShippingPage({
	params,
}: SellerShippingPageProps) {
	const user = await currentUser();
	if (!user || user.privateMetadata.role !== "SELLER") {
		redirect("/");
	}

	const { slug } = await params;

	const store = await db.store.findUnique({
		where: { slug, userId: user.id },
		include: {
			shippingRates: {
				include: {
					country: true,
				},
				orderBy: {
					country: {
						name: "asc",
					},
				},
			},
		},
	});

	if (!store) {
		redirect("/dashboard/seller/stores");
	}

	const shippingData = store.shippingRates.map((rate) => ({
		id: rate.id,
		country: rate.country.name,
		countryCode: rate.country.code,
		shippingService: rate.shippingService,
		shippingFeePerItem: rate.shippingFeePerItem,
		shippingFeeForAdditionalItem: rate.shippingFeeForAdditionalItem,
		shippingFeePerKg: rate.shippingFeePerKg,
		shippingFeeFixed: rate.shippingFeeFixed,
		deliveryTimeMin: rate.deliveryTimeMin,
		deliveryTimeMax: rate.deliveryTimeMax,
		returnPolicy: rate.returnPolicy,
		createdAt: rate.createdAt,
		updatedAt: rate.updatedAt,
	}));

	// Calculate statistics
	const totalCountries = shippingData.length;
	const avgDeliveryTime =
		totalCountries > 0
			? shippingData.reduce(
					(sum, rate) => sum + (rate.deliveryTimeMin + rate.deliveryTimeMax) / 2,
					0
				) / totalCountries
			: 0;
	const avgShippingFee =
		totalCountries > 0
			? shippingData.reduce((sum, rate) => {
					const avgFee =
						rate.shippingFeeFixed > 0
							? rate.shippingFeeFixed
							: rate.shippingFeePerItem > 0
								? rate.shippingFeePerItem
								: rate.shippingFeePerKg;
					return sum + avgFee;
				}, 0) / totalCountries
			: 0;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Spedizioni</h1>
					<p className="text-muted-foreground">
						Gestisci le tariffe di spedizione per paese
					</p>
				</div>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Nuova Tariffa
				</Button>
			</div>

			{/* Default Shipping Info */}
			<Card>
				<CardHeader>
					<CardTitle>Impostazioni Predefinite</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Servizio di Spedizione
							</p>
							<p className="text-lg font-semibold">
								{store.defaultShippingService}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Tempo di Consegna
							</p>
							<p className="text-lg font-semibold">
								{store.defaultDeliveryTimeMin}-
								{store.defaultDeliveryTimeMax} giorni
							</p>
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Tariffa Fissa
							</p>
							<p className="text-lg font-semibold">
								€{store.defaultShippingFeeFixed.toFixed(2)}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Tariffa per Articolo
							</p>
							<p className="text-lg font-semibold">
								€{store.defaultShippingFeePerItem.toFixed(2)}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Articolo Aggiuntivo
							</p>
							<p className="text-lg font-semibold">
								€{store.defaultShippingFeeForAdditionalItem.toFixed(2)}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Tariffa per Kg
							</p>
							<p className="text-lg font-semibold">
								€{store.defaultShippingFeePerKg.toFixed(2)}
							</p>
						</div>
					</div>
					<div>
						<p className="text-sm font-medium text-muted-foreground">
							Politica di Reso
						</p>
						<p className="text-base">{store.returnPolicy}</p>
					</div>
				</CardContent>
			</Card>

			{/* Statistics Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Paesi Serviti
						</CardTitle>
						<Globe className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalCountries}</div>
						<p className="text-xs text-muted-foreground">
							Tariffe configurate
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Tempo Medio
						</CardTitle>
						<Truck className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{avgDeliveryTime.toFixed(0)} giorni
						</div>
						<p className="text-xs text-muted-foreground">
							Consegna media
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Tariffa Media
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							€{avgShippingFee.toFixed(2)}
						</div>
						<p className="text-xs text-muted-foreground">
							Spedizione media
						</p>
					</CardContent>
				</Card>
			</div>

			<DataTable columns={columns} data={shippingData} searchKey="country" />
		</div>
	);
}
