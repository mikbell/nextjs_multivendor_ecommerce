"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
	const searchParams = useSearchParams();
	const sessionId = searchParams.get("session_id");

	return (
		<div className="container mx-auto px-4 py-16">
			<Card className="max-w-2xl mx-auto">
				<CardContent className="flex flex-col items-center justify-center py-12">
					<CheckCircle2 className="h-24 w-24 text-green-500 mb-6" />
					<h1 className="text-3xl font-bold mb-2">Pagamento completato!</h1>
					<p className="text-muted-foreground text-center mb-8">
						Il tuo ordine è stato ricevuto con successo. Riceverai una email di
						conferma a breve.
					</p>

					{sessionId && (
						<p className="text-sm text-muted-foreground mb-8">
							ID Sessione: {sessionId}
						</p>
					)}

					<div className="flex gap-4">
						<Link href="/dashboard">
							<Button size="lg">Vai ai tuoi ordini</Button>
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

export default function CheckoutSuccessPage() {
	return (
		<Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">Caricamento...</div>}>
			<SuccessContent />
		</Suspense>
	);
}
