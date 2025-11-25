import Link from "next/link";
import { Home, Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/shared/heading";

export const dynamic = 'force-dynamic';

export default function NotFound() {
	return (
		<div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
			<div className="space-y-6">
				{/* 404 Number */}
				<div className="relative">
					<Heading className="text-9xl text-primary/20 md:text-[12rem]">
						404
					</Heading>
					<div className="absolute inset-0 flex items-center justify-center">
						<Search className="h-16 w-16 text-muted-foreground animate-pulse md:h-20 md:w-20" />
					</div>
				</div>

				{/* Message */}
				<div className="space-y-2">
					<h2 className="text-2xl font-bold tracking-tight md:text-3xl">
						Pagina non trovata
					</h2>
					<p className="text-muted-foreground max-w-md mx-auto">
						Ops! La pagina che stai cercando non esiste o è stata spostata.
					</p>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
					<Link href="/">
						<Button size="lg">
							<Home className="mr-2 h-4 w-4" />
							Torna alla home
						</Button>
					</Link>
					<Link href="/products">
						<Button variant="outline" size="lg">
							<ShoppingBag className="mr-2 h-4 w-4" />
							Vai ai prodotti
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
