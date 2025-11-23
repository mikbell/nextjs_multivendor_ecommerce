"use client";

import Image from "next/image";
import { Star, Package, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingLink } from "@/components/shared/loading-link";

interface StoreCardProps {
	store: {
		id: string;
		slug: string;
		name: string;
		description: string;
		logo: string;
		cover: string;
		averageRating: number;
		numReviews: number;
		featured: boolean;
		productCount?: number;
		followerCount?: number;
	};
}

export function StoreCard({ store }: StoreCardProps) {
	return (
		<LoadingLink href={`/stores/${store.slug}`}>
			<Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full">
				{/* Cover Image */}
				<div className="relative h-32 w-full bg-muted overflow-hidden">
					<Image
						src={store.cover || "/placeholder-cover.jpg"}
						alt={`${store.name} cover`}
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-300"
					/>
					{store.featured && (
						<Badge className="absolute top-2 right-2" variant="default">
							In evidenza
						</Badge>
					)}
				</div>

				<CardContent className="p-4">
					{/* Logo */}
					<div className="flex items-start gap-4 -mt-10 mb-4">
						<div className="relative w-16 h-16 rounded-lg overflow-hidden border-4 border-background shadow-lg bg-white flex-shrink-0">
							<Image
								src={store.logo || "/placeholder-logo.jpg"}
								alt={store.name}
								fill
								className="object-cover"
							/>
						</div>

						<div className="flex-1 min-w-0 mt-8">
							<h3 className="font-semibold text-lg mb-1 truncate group-hover:text-primary transition-colors">
								{store.name}
							</h3>

							{/* Rating */}
							<div className="flex items-center gap-1 text-sm">
								<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
								<span className="font-medium">{store.averageRating.toFixed(1)}</span>
								<span className="text-muted-foreground">
									({store.numReviews})
								</span>
							</div>
						</div>
					</div>

					{/* Description */}
					<p className="text-sm text-muted-foreground line-clamp-2 mb-4">
						{store.description}
					</p>

					{/* Stats */}
					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						{typeof store.productCount !== "undefined" && (
							<div className="flex items-center gap-1">
								<Package className="h-4 w-4" />
								<span>{store.productCount} prodotti</span>
							</div>
						)}
						{typeof store.followerCount !== "undefined" && (
							<div className="flex items-center gap-1">
								<Users className="h-4 w-4" />
								<span>{store.followerCount} follower</span>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</LoadingLink>
	);
}
