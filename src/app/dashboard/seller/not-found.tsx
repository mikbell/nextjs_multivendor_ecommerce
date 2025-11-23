import Link from "next/link";
import { FileQuestion, Home, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from "@/components/shared/back-button";

export default function SellerNotFound() {
	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-12rem)] p-4">
			<Card className="max-w-md w-full">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
						<FileQuestion className="h-10 w-10 text-muted-foreground" />
					</div>
					<CardTitle className="text-2xl">Pagina non trovata</CardTitle>
					<CardDescription>
						La pagina del negozio che stai cercando non esiste o è stata spostata.
					</CardDescription>
				</CardHeader>
				<CardContent className="text-center">
					<p className="text-sm text-muted-foreground mb-2">
						Codice errore: <span className="font-mono font-semibold">404</span>
					</p>
					<p className="text-xs text-muted-foreground">
						Verifica l'URL o contatta il supporto se il problema persiste.
					</p>
				</CardContent>
				<CardFooter className="flex flex-col gap-2">
					<Link href="/dashboard/seller" className="w-full">
						<Button className="w-full" size="lg">
							<Store className="mr-2 h-4 w-4" />
							I miei negozi
						</Button>
					</Link>
					<div className="flex gap-2 w-full">
						<Link href="/dashboard" className="flex-1">
							<Button variant="outline" size="lg" className="w-full">
								<Home className="mr-2 h-4 w-4" />
								Home
							</Button>
						</Link>
						<BackButton className="flex-1">
							Indietro
						</BackButton>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
