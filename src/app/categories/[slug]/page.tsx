import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CategoryProductsGrid } from "@/components/category/category-products-grid";
import {
	getCategoryBySlug,
	getCategoryProducts,
} from "@/queries/category-products";
import Heading from "@/components/shared/heading";

interface CategoryPageProps {
	params: Promise<{
		slug: string;
	}>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
	const { slug } = await params;
	const [category, products] = await Promise.all([
		getCategoryBySlug(slug),
		getCategoryProducts(slug),
	]);

	if (!category) {
		notFound();
	}

	return (
		<div className="space-y-8">
			{/* Breadcrumb & Back */}
			<div className="flex items-center gap-4">
				<Link href="/">
					<Button variant="ghost" size="sm">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Home
					</Button>
				</Link>
				<span className="text-muted-foreground">/</span>
				<span className="text-sm font-medium">{category.name}</span>
			</div>

			{/* Category Header */}
			<div className="relative rounded-2xl overflow-hidden bg-linear-to-r from-primary/10 to-primary/5 p-8 md:p-12">
				<div className="relative z-10 max-w-2xl space-y-4">
					<Heading>{category.name}</Heading>

					<p className="text-lg text-muted-foreground">
						{category.description}
					</p>
					<div className="text-sm text-muted-foreground">
						{products.length} {products.length === 1 ? "prodotto" : "prodotti"}{" "}
						disponibili
					</div>
				</div>
				{category.image && (
					<div className="absolute right-0 top-0 bottom-0 w-1/3">
						<Image
							src={category.image}
							alt={category.name}
							fill
							className="object-cover"
						/>
					</div>
				)}
			</div>

			{/* Products Grid */}
			<div>
				<h2 className="text-2xl font-bold mb-6">Tutti i prodotti</h2>
				{products.length > 0 ? (
					<CategoryProductsGrid
						initialProducts={products}
						categorySlug={slug}
					/>
				) : (
					<div className="text-center py-16 space-y-4">
						<p className="text-muted-foreground text-lg">
							Nessun prodotto disponibile in questa categoria al momento.
						</p>
						<Link href="/">
							<Button>Torna alla home</Button>
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
