"use client";

import Image from "next/image";
import { Star, Package, Users, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface StoreHeaderProps {
	store: {
		id: string;
		name: string;
		slug: string;
		description: string;
		logo: string;
		cover: string;
		email: string;
		phone: string;
		averageRating: number;
		numReviews: number;
		productCount: number;
		followerCount: number;
		user: {
			id: string;
			name: string;
			picture: string;
		};
	};
}

export function StoreHeader({ store }: StoreHeaderProps) {
	return (
		<div className="relative">
			{/* Cover Image */}
			<div className="relative h-64 md:h-80 w-full bg-muted overflow-hidden">
				<Image
					src={store.cover || "/placeholder-cover.jpg"}
					alt={`${store.name} cover`}
					fill
					className="object-cover"
					priority
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
			</div>

			{/* Store Info */}
			<div className="container mx-auto px-4">
				<div className="relative -mt-20 mb-8">
					<Card className="p-6 shadow-lg">
						<div className="flex flex-col md:flex-row gap-6">
							{/* Logo */}
							<div className="flex-shrink-0">
								<div className="relative w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden border-4 border-background shadow-xl bg-white">
									<Image
										src={store.logo || "/placeholder-logo.jpg"}
										alt={store.name}
										fill
										className="object-cover"
									/>
								</div>
							</div>

							{/* Store Details */}
							<div className="flex-1 min-w-0">
								<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
									<div className="flex-1">
										<h1 className="text-3xl md:text-4xl font-bold mb-2">
											{store.name}
										</h1>

										{/* Rating */}
										<div className="flex items-center gap-4 mb-3">
											<div className="flex items-center gap-1">
												<Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
												<span className="font-semibold">
													{store.averageRating.toFixed(1)}
												</span>
												<span className="text-sm text-muted-foreground">
													({store.numReviews} recensioni)
												</span>
											</div>
										</div>

										{/* Stats */}
										<div className="flex flex-wrap items-center gap-4 mb-4">
											<div className="flex items-center gap-2 text-sm">
												<Package className="h-4 w-4 text-muted-foreground" />
												<span>
													<span className="font-semibold">{store.productCount}</span>{" "}
													prodotti
												</span>
											</div>
											<div className="flex items-center gap-2 text-sm">
												<Users className="h-4 w-4 text-muted-foreground" />
												<span>
													<span className="font-semibold">{store.followerCount}</span>{" "}
													follower
												</span>
											</div>
										</div>

										{/* Description */}
										<p className="text-muted-foreground line-clamp-2 mb-4">
											{store.description}
										</p>

										{/* Contact Info */}
										<div className="flex flex-wrap items-center gap-4 text-sm">
											<div className="flex items-center gap-2">
												<Mail className="h-4 w-4 text-muted-foreground" />
												<span>{store.email}</span>
											</div>
											<div className="flex items-center gap-2">
												<Phone className="h-4 w-4 text-muted-foreground" />
												<span>{store.phone}</span>
											</div>
										</div>
									</div>

									{/* Actions */}
									<div className="flex flex-row md:flex-col gap-2">
										<Button className="flex-1 md:flex-none">
											<Users className="h-4 w-4 mr-2" />
											Segui
										</Button>
										<Button variant="outline" className="flex-1 md:flex-none">
											Contatta
										</Button>
									</div>
								</div>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
