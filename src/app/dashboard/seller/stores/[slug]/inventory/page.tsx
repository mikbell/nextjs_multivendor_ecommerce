import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingDown, AlertTriangle } from "lucide-react";

interface SellerInventoryPageProps {
	params: Promise<{ slug: string }>;
}

export default async function SellerInventoryPage({
	params,
}: SellerInventoryPageProps) {
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
				},
			},
		},
	});

	if (!store) {
		redirect("/dashboard/seller/stores");
	}

	// Flatten inventory data
	const inventoryData = store.products.flatMap((product) =>
		product.variants.flatMap((variant) =>
			variant.sizes.map((size) => ({
				id: size.id,
				productId: product.id,
				productName: product.name,
				productSlug: product.slug,
				variantId: variant.id,
				variantName: variant.variantName,
				variantSlug: variant.slug,
				sku: variant.sku,
				size: size.size,
				quantity: size.quantity,
				price: size.price,
				discount: size.discount,
				finalPrice: size.price * (1 - size.discount / 100),
				isActive: variant.isActive && product.isActive,
			}))
		)
	);

	// Calculate statistics
	const totalItems = inventoryData.reduce((sum, item) => sum + item.quantity, 0);
	const lowStockItems = inventoryData.filter(
		(item) => item.quantity > 0 && item.quantity <= 10
	).length;
	const outOfStockItems = inventoryData.filter(
		(item) => item.quantity === 0
	).length;
	const totalValue = inventoryData.reduce(
		(sum, item) => sum + item.finalPrice * item.quantity,
		0
	);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
				<p className="text-muted-foreground">
					Monitora lo stock dei tuoi prodotti
				</p>
			</div>

			{/* Statistics Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Totale Articoli
						</CardTitle>
						<Package className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalItems}</div>
						<p className="text-xs text-muted-foreground">
							In {inventoryData.length} varianti
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Stock Basso
						</CardTitle>
						<TrendingDown className="h-4 w-4 text-orange-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-orange-600">
							{lowStockItems}
						</div>
						<p className="text-xs text-muted-foreground">
							≤10 unità disponibili
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Esauriti
						</CardTitle>
						<AlertTriangle className="h-4 w-4 text-red-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">
							{outOfStockItems}
						</div>
						<p className="text-xs text-muted-foreground">
							Prodotti da rifornire
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Valore Inventario
						</CardTitle>
						<Package className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							€{totalValue.toFixed(2)}
						</div>
						<p className="text-xs text-muted-foreground">
							Valore totale stock
						</p>
					</CardContent>
				</Card>
			</div>

			<DataTable columns={columns} data={inventoryData} searchKey="productName" />
		</div>
	);
}
