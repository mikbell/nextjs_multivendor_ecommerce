import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ProductCardProps {
	id: string;
	name: string;
	slug: string;
	image: string;
	price: number;
	rating?: number;
	numReviews?: number;
	variantSlug: string;
}

export function ProductCard({
	name,
	slug,
	image,
	price,
	rating = 0,
	numReviews = 0,
	variantSlug,
}: ProductCardProps) {
	return (
		<Link href={`/products/${slug}/${variantSlug}`}>
			<Card className="group overflow-hidden transition-all hover:shadow-lg">
				<div className="relative aspect-square overflow-hidden">
					<Image
						src={image || "/placeholder-product.jpg"}
						alt={name}
						fill
						sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
						className="object-cover transition-transform group-hover:scale-105"
						loading="lazy"
					/>
				</div>
				<CardContent className="p-4">
					<h3 className="font-medium text-sm line-clamp-2 min-h-10">
						{name}
					</h3>
					<div className="mt-2 flex items-center gap-1">
						<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
						<span className="text-sm text-muted-foreground">
							{rating.toFixed(1)} ({numReviews})
						</span>
					</div>
					<p className="mt-2 font-bold text-lg text-primary">
						€{price.toFixed(2)}
					</p>
				</CardContent>
			</Card>
		</Link>
	);
}
