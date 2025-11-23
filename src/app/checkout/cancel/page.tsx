"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutCancelPage() {
	return (
		<div className="container mx-auto px-4 py-16">
			<Card className="max-w-2xl mx-auto">
				<CardContent className="flex flex-col items-center justify-center py-12">
					<XCircle className="h-24 w-24 text-orange-500 mb-6" />
					<h1 className="text-3xl font-bold mb-2">Pagamento annullato</h1>
					<p className="text-muted-foreground text-center mb-8">
						Il pagamento è stato annullato. Nessun addebito è stato effettuato.
						Puoi tornare al carrello per riprovare o continuare a fare acquisti.
					</p>

					<div className="flex gap-4">
						<Link href="/cart">
							<Button size="lg">Torna al carrello</Button>
						</Link>
						<Link href="/products">
							<Button variant="outline" size="lg">
								Continua lo shopping
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
