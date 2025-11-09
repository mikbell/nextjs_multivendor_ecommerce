import { ArrowRight, ShoppingBag, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/home/category-card";
import { ProductCard } from "@/components/home/product-card";
import {
	getHomeFeaturedCategories,
	getHomeFeaturedProducts,
} from "@/queries/home";

export default async function Home() {
	const [categories, products] = await Promise.all([
		getHomeFeaturedCategories(),
		getHomeFeaturedProducts(),
	]);

	return (
		<div className="space-y-16">
			{/* Hero Section */}
			<section className="relative rounded-2xl bg-linear-to-r from-primary/10 via-primary/5 to-background p-8 md:p-12 lg:p-16">
				<div className="relative z-10 max-w-3xl space-y-6">
					<div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
						<TrendingUp className="h-4 w-4" />
						Nuovo su GoShop
					</div>
					<h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
						Scopri il meglio dell&apos;e-commerce
					</h1>
					<p className="text-lg text-muted-foreground md:text-xl">
						Migliaia di prodotti dai migliori venditori. Prezzi competitivi,
						consegna veloce e assistenza dedicata.
					</p>
					<div className="flex flex-col sm:flex-row gap-4">
						<Link href="/products">
							<Button size="lg">
								<ShoppingBag className="mr-2 h-5 w-5" />
								Esplora prodotti
							</Button>
						</Link>
						<Link href="#categories">
							<Button size="lg" variant="outline">
								Scopri le categorie
								<ArrowRight className="ml-2 h-5 w-5" />
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Featured Categories */}
			<section id="categories" className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-3xl font-bold tracking-tight">Categorie</h2>
						<p className="text-muted-foreground mt-2">
							Esplora le nostre categorie più popolari
						</p>
					</div>
					<Link href="/categories">
						<Button variant="ghost" className="hidden md:flex">
							Vedi tutte
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</Link>
				</div>

				{categories.length > 0 ? (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
						{categories.map((category) => (
							<CategoryCard key={category.id} {...category} />
						))}
					</div>
				) : (
					<div className="text-center py-12 text-muted-foreground">
						Nessuna categoria disponibile al momento.
					</div>
				)}
			</section>

			{/* Featured Products */}
			<section className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-3xl font-bold tracking-tight">
							Prodotti in evidenza
						</h2>
						<p className="text-muted-foreground mt-2">
							I prodotti più venduti e meglio recensiti
						</p>
					</div>
					<Link href="/products">
						<Button variant="ghost" className="hidden md:flex">
							Vedi tutti
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</Link>
				</div>

				{products.length > 0 ? (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
						{products.map((product) => (
							<ProductCard key={product.id} {...product} />
						))}
					</div>
				) : (
					<div className="text-center py-12 text-muted-foreground">
						Nessun prodotto disponibile al momento.
					</div>
				)}
			</section>

			{/* Call to Action */}
			<section className="rounded-2xl bg-primary/5 p-8 md:p-12 text-center space-y-4">
				<h2 className="text-3xl font-bold tracking-tight">
					Diventa un venditore su GoShop
				</h2>
				<p className="text-muted-foreground max-w-2xl mx-auto">
					Apri il tuo negozio online e raggiungi migliaia di clienti. È facile,
					veloce e conveniente.
				</p>
				<Link href="/dashboard/seller/stores">
					<Button size="lg">
						Inizia ora
						<ArrowRight className="ml-2 h-5 w-5" />
					</Button>
				</Link>
			</section>
		</div>
	);
}
