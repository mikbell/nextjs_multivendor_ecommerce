import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";

interface CategoryCardProps {
	id: string;
	name: string;
	slug: string;
	image: string;
}

export function CategoryCard({ name, slug, image }: CategoryCardProps) {
	return (
		<Link href={`/categories/${slug}`}>
			<Card className="group relative overflow-hidden transition-all hover:shadow-lg">
				<div className="aspect-square relative">
					<Image
						src={image}
						alt={name}
						fill
						className="object-cover transition-transform group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
					<div className="absolute bottom-0 left-0 right-0 p-4">
						<h3 className="text-white font-semibold text-lg">{name}</h3>
					</div>
				</div>
			</Card>
		</Link>
	);
}
