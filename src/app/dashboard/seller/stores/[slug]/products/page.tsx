import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

interface SellerProductsPageProps {
	params: Promise<{ slug: string }>;
}

export default async function SellerProductsPage({
	params,
}: SellerProductsPageProps) {
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
					category: true,
					subCategory: true,
					variants: {
						include: {
							sizes: true,
						},
					},
					_count: {
						select: {
							reviews: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			},
		},
	});

	if (!store) {
		redirect("/dashboard/seller/stores");
	}

	const productsData = store.products.map((product) => {
		const totalStock = product.variants.reduce((sum, variant) => {
			const variantStock = variant.sizes.reduce(
				(sizeSum, size) => sizeSum + size.quantity,
				0
			);
			return sum + variantStock;
		}, 0);

		const minPrice = Math.min(
			...product.variants.flatMap((v) => v.sizes.map((s) => s.price))
		);

		return {
			id: product.id,
			name: product.name,
			slug: product.slug,
			brand: product.brand,
			category: product.category.name,
			subCategory: product.subCategory.name,
			variants: product.variants.length,
			stock: totalStock,
			price: minPrice,
			sales: product.sales,
			views: product.views,
			rating: product.rating,
			reviews: product._count.reviews,
			isActive: product.isActive,
			createdAt: product.createdAt,
		};
	});

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Prodotti</h1>
					<p className="text-muted-foreground">
						Gestisci i prodotti del tuo negozio
					</p>
				</div>
				<Link href={`/dashboard/seller/stores/${slug}/products/new`}>
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Nuovo Prodotto
					</Button>
				</Link>
			</div>

			<DataTable columns={columns} data={productsData} searchKey="name" />
		</div>
	);
}
