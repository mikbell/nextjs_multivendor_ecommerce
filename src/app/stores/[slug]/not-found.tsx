import Link from "next/link";
import { Store, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function StoreNotFound() {
	return (
		<div className="container mx-auto px-4 py-16">
			<Card className="max-w-2xl mx-auto p-12 text-center">
				<div className="mb-6">
					<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
						<Store className="h-10 w-10 text-muted-foreground" />
					</div>
					<h1 className="text-4xl font-bold mb-2">Negozio non trovato</h1>
					<p className="text-muted-foreground text-lg">
						Il negozio che stai cercando non esiste o è stato rimosso.
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
					<Button asChild variant="default">
						<Link href="/stores">
							<Store className="h-4 w-4 mr-2" />
							Tutti i Negozi
						</Link>
					</Button>
					<Button asChild variant="outline">
						<Link href="/">
							<Home className="h-4 w-4 mr-2" />
							Homepage
						</Link>
					</Button>
				</div>
			</Card>
		</div>
	);
}
