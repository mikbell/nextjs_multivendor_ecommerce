import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/home/category-card";
import { getAllCategories } from "@/queries/products-listing";

export default async function CategoriesPage() {
	const categories = await getAllCategories();

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-4">
				<Link href="/">
					<Button variant="ghost" size="sm">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Home
					</Button>
				</Link>
				<h1 className="text-4xl font-bold tracking-tight">
					Tutte le categorie
				</h1>
				<p className="text-lg text-muted-foreground">
					Esplora i nostri prodotti per categoria
				</p>
			</div>

			{/* Categories Grid */}
			{categories.length > 0 ? (
				<div className="space-y-6">
					<div className="text-sm text-muted-foreground">
						{categories.length} categorie disponibili
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
						{categories.map((category) => (
							<div key={category.id} className="space-y-2">
								<CategoryCard {...category} />
								<div className="text-center">
									<div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
										<Package className="h-3 w-3" />
										{category._count.products}{" "}
										{category._count.products === 1 ? "prodotto" : "prodotti"}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			) : (
				<div className="text-center py-16 space-y-4">
					<div className="text-6xl">📦</div>
					<h3 className="text-2xl font-semibold">
						Nessuna categoria disponibile
					</h3>
					<p className="text-muted-foreground max-w-md mx-auto">
						Le categorie saranno disponibili a breve.
					</p>
					<Link href="/">
						<Button>Torna alla home</Button>
					</Link>
				</div>
			)}
		</div>
	);
}
