import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from "@/components/shared/back-button";

export default function DashboardNotFound() {
	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-8rem)] p-4">
			<Card className="max-w-md w-full">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
						<FileQuestion className="h-10 w-10 text-muted-foreground" />
					</div>
					<CardTitle className="text-2xl">Pagina non trovata</CardTitle>
					<CardDescription>
						La pagina che stai cercando non esiste o è stata spostata.
					</CardDescription>
				</CardHeader>
				<CardContent className="text-center">
					<p className="text-sm text-muted-foreground">
						Codice errore: <span className="font-mono font-semibold">404</span>
					</p>
				</CardContent>
				<CardFooter className="flex flex-col gap-2">
					<Link href="/dashboard" className="w-full">
						<Button className="w-full" size="lg">
							<Home className="mr-2 h-4 w-4" />
							Torna alla Dashboard
						</Button>
					</Link>
					<BackButton />
				</CardFooter>
			</Card>
		</div>
	);
}
