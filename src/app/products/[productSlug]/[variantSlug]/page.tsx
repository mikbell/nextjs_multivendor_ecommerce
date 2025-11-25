import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductCard } from "@/components/home/product-card";
import Image from "next/image";
import {
	getProductDetails,
	getRelatedProducts,
} from "@/queries/product-details";

interface ProductPageProps {
	params: Promise<{
		productSlug: string;
		variantSlug: string;
	}>;
}

export default async function ProductPage({ params }: ProductPageProps) {
	const { productSlug, variantSlug } = await params;
	const product = await getProductDetails(productSlug, variantSlug);

	if (!product) {
		notFound();
	}

	const relatedProducts = await getRelatedProducts(
		product.category.id,
		product.id
	);

	return (
		<div className="space-y-12">
			{/* Breadcrumb */}
			<div className="flex items-center gap-2 text-sm">
				<Link href="/" className="text-muted-foreground hover:text-primary">
					Home
				</Link>
				<ChevronRight className="h-4 w-4 text-muted-foreground" />
				<Link
					href={`/categories/${product.category.slug}`}
					className="text-muted-foreground hover:text-primary">
					{product.category.name}
				</Link>
				<ChevronRight className="h-4 w-4 text-muted-foreground" />
				<span className="font-medium">{product.name}</span>
			</div>

			{/* Back Button */}
			<Link href={`/categories/${product.category.slug}`}>
				<Button variant="ghost" size="sm">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Torna a {product.category.name}
				</Button>
			</Link>

			{/* Product Main Content */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
				{/* Gallery */}
				<ProductGallery images={product.variant?.images || []} productName={product.name} />

				{/* Info */}
				<ProductInfo
					productId={product.id}
					variantId={product.variant?.id || ""}
					name={product.name}
					brand={product.brand}
					rating={product.rating}
					numReviews={product.numReviews}
					sizes={product.variant?.sizes || []}
					store={product.store}
					isSale={product.variant?.isSale || false}
					saleEndDate={product.variant?.saleEndDate || null}
				/>
			</div>

			{/* Variant Selector */}
			{product.allVariants.length > 1 && (
				<div className="space-y-4">
					<h3 className="text-lg font-semibold">Altre varianti disponibili</h3>
					<div className="flex flex-wrap gap-3">
						{product.allVariants.map((variant: { id: string; slug: string; variantName: string; variantImage: string }) => (
							<Link
								key={variant.id}
								href={`/products/${productSlug}/${variant.slug}`}>
								<Card
									className={
										variant.slug === variantSlug
											? "border-primary ring-2 ring-primary/20"
											: "hover:border-primary/50"
									}>
									<CardContent className="p-3 flex items-center gap-3">
										{variant.variantImage && (
											<Image
												width={48}
												height={48}
												src={variant.variantImage}
												alt={variant.variantName}
												className="h-12 w-12 rounded object-cover"
											/>
										)}
										<span className="text-sm font-medium">
											{variant.variantName}
										</span>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				</div>
			)}

			{/* Product Details Tabs */}
			<Tabs defaultValue="description" className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="description">Descrizione</TabsTrigger>
					<TabsTrigger value="specs">Specifiche</TabsTrigger>
					<TabsTrigger value="faq">Domande Frequenti</TabsTrigger>
				</TabsList>

				<TabsContent value="description" className="space-y-4">
					<Card>
						<CardContent className="p-6">
							<div
								className="prose max-w-none"
								dangerouslySetInnerHTML={{ __html: product.description }}
							/>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="specs" className="space-y-4">
					<Card>
						<CardContent className="p-6">
							{(product.variant?.specs && product.variant.specs.length > 0) || product.specs.length > 0 ? (
								<div className="space-y-4">
									{product.specs.length > 0 && (
										<div>
											<h4 className="font-semibold mb-3">
												Specifiche Prodotto
											</h4>
											<dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
												{product.specs.map((spec) => (
													<div
														key={spec.id}
														className="border-b pb-2 flex justify-between">
														<dt className="text-muted-foreground">
															{spec.name}
														</dt>
														<dd className="font-medium">{spec.value}</dd>
													</div>
												))}
											</dl>
											</div>
										)}
										{product.variant?.specs && product.variant.specs.length > 0 && (
											<div>
											<h4 className="font-semibold mb-3">
												Specifiche Variante
											</h4>
											<dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
												{product.variant.specs.map((spec) => (
													<div
														key={spec.id}
														className="border-b pb-2 flex justify-between">
														<dt className="text-muted-foreground">
															{spec.name}
														</dt>
														<dd className="font-medium">{spec.value}</dd>
													</div>
												))}
											</dl>
										</div>
									)}
								</div>
							) : (
								<p className="text-muted-foreground text-center py-8">
									Nessuna specifica disponibile
								</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="faq" className="space-y-4">
					<Card>
						<CardContent className="p-6">
							{product.questions.length > 0 ? (
								<div className="space-y-6">
									{product.questions.map((q) => (
										<div key={q.id} className="space-y-2">
											<h4 className="font-semibold">{q.question}</h4>
											<p className="text-muted-foreground">{q.answer}</p>
										</div>
									))}
								</div>
							) : (
								<p className="text-muted-foreground text-center py-8">
									Nessuna domanda disponibile
								</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Related Products */}
			{relatedProducts.length > 0 && (
				<div className="space-y-6">
					<h2 className="text-2xl font-bold">Prodotti correlati</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
						{relatedProducts.map((product) => (
							<ProductCard key={product.id} {...product} />
						))}
					</div>
				</div>
			)}
		</div>
	);
}
