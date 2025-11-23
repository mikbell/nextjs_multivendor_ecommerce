import { db } from "@/lib/db";
import { StoreCard } from "./store-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StoresGridProps {
	page: number;
	search?: string;
	sortBy: "newest" | "popular" | "rating" | "products";
	categoryId?: string;
}

export async function StoresGrid({
	page = 1,
	search,
	sortBy = "popular",
	categoryId,
}: StoresGridProps) {
	const limit = 12;
	const skip = (page - 1) * limit;

	// Build where clause
	const where: {
		status: string;
		OR?: Array<{
			name?: { contains: string; mode: "insensitive" };
			description?: { contains: string; mode: "insensitive" };
		}>;
		products?: {
			some: {
				categoryId: string;
				isActive: boolean;
			};
		};
	} = {
		status: "ACTIVE",
	};

	if (search) {
		where.OR = [
			{ name: { contains: search, mode: "insensitive" } },
			{ description: { contains: search, mode: "insensitive" } },
		];
	}

	// Add category filter if provided
	if (categoryId) {
		where.products = {
			some: {
				categoryId,
				isActive: true,
			},
		};
	}

	// Build orderBy clause
	let orderBy:
		| { createdAt: "desc" }
		| { averageRating: "desc" }
		| { numReviews: "desc" } = { numReviews: "desc" };
	switch (sortBy) {
		case "newest":
			orderBy = { createdAt: "desc" };
			break;
		case "rating":
			orderBy = { averageRating: "desc" };
			break;
		case "popular":
			orderBy = { numReviews: "desc" };
			break;
		case "products":
			// We'll need to count products, fallback to newest for now
			orderBy = { createdAt: "desc" };
			break;
		default:
			orderBy = { numReviews: "desc" };
	}

	// Fetch stores with counts
	const [stores, total] = await Promise.all([
		db.store.findMany({
			where,
			skip,
			take: limit,
			orderBy,
			include: {
				_count: {
					select: {
						products: {
							where: {
								isActive: true,
							},
						},
						followers: true,
					},
				},
			},
		}),
		db.store.count({ where }),
	]);

	const totalPages = Math.ceil(total / limit);
	const hasMore = skip + stores.length < total;

	// Map stores to include counts
	const storesWithCounts = stores.map((store) => ({
		...store,
		productCount: store._count.products,
		followerCount: store._count.followers,
	}));

	if (stores.length === 0) {
		return (
			<div className="text-center py-16">
				<p className="text-xl text-muted-foreground mb-4">
					Nessun negozio trovato
				</p>
				{(search || categoryId) && (
					<Link href="/stores">
						<Button variant="outline">Rimuovi filtri</Button>
					</Link>
				)}
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Results Info */}
			<div className="flex items-center justify-between">
				<p className="text-sm text-muted-foreground">
					Mostrando {skip + 1}-{Math.min(skip + limit, total)} di {total}{" "}
					negozi
				</p>
			</div>

			{/* Stores Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{storesWithCounts.map((store) => (
					<StoreCard key={store.id} store={store} />
				))}
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-2">
					{page > 1 && (
						<Link
							href={`/stores?page=${page - 1}${search ? `&search=${search}` : ""}${sortBy ? `&sortBy=${sortBy}` : ""}${categoryId ? `&categoryId=${categoryId}` : ""}`}>
							<Button variant="outline" size="sm">
								<ChevronLeft className="h-4 w-4 mr-1" />
								Precedente
							</Button>
						</Link>
					)}

					<div className="flex items-center gap-1">
						{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
							let pageNumber;
							if (totalPages <= 5) {
								pageNumber = i + 1;
							} else if (page <= 3) {
								pageNumber = i + 1;
							} else if (page >= totalPages - 2) {
								pageNumber = totalPages - 4 + i;
							} else {
								pageNumber = page - 2 + i;
							}

							return (
								<Link
									key={i}
									href={`/stores?page=${pageNumber}${search ? `&search=${search}` : ""}${sortBy ? `&sortBy=${sortBy}` : ""}${categoryId ? `&categoryId=${categoryId}` : ""}`}>
									<Button
										variant={page === pageNumber ? "default" : "outline"}
										size="sm"
										className="w-10">
										{pageNumber}
									</Button>
								</Link>
							);
						})}
					</div>

					{hasMore && (
						<Link
							href={`/stores?page=${page + 1}${search ? `&search=${search}` : ""}${sortBy ? `&sortBy=${sortBy}` : ""}${categoryId ? `&categoryId=${categoryId}` : ""}`}>
							<Button variant="outline" size="sm">
								Successiva
								<ChevronRight className="h-4 w-4 ml-1" />
							</Button>
						</Link>
					)}
				</div>
			)}
		</div>
	);
}
