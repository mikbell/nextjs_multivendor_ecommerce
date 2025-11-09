import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import {
	User,
	Mail,
	Shield,
	Calendar,
	Settings,
	Database,
	Server,
} from "lucide-react";
import { db } from "@/lib/db";

export default async function SettingsPage() {
	try {
		// Get current user
		const user = await currentUser();

		// Ensure user is authenticated
		if (!user) {
			throw new Error("Unauthenticated.");
		}

		// Verify admin permission
		if (user.privateMetadata.role !== "ADMIN") {
			throw new Error("Unauthorized Access: Admin Privileges Required.");
		}

		// Get platform statistics
		const [totalUsers, totalStores, totalProducts, totalOrders] =
			await Promise.all([
				db.user.count(),
				db.store.count(),
				db.product.count(),
				db.order.count(),
			]);

		return (
			<div className="flex flex-col gap-6 p-6">
				{/* Header */}
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Impostazioni</h1>
					<p className="text-muted-foreground">
						Gestisci le impostazioni dell&apos;account e visualizza le
						informazioni della piattaforma
					</p>
				</div>

				{/* Account Information */}
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<User className="h-5 w-5" />
							<CardTitle>Informazioni Account</CardTitle>
						</div>
						<CardDescription>
							Dettagli del tuo account amministratore
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-start gap-6">
							<div className="relative h-20 w-20 overflow-hidden rounded-full bg-muted">
								<Image
									src={user.imageUrl}
									alt={user.fullName || "Admin"}
									fill
									className="object-cover"
								/>
							</div>
							<div className="flex-1 space-y-4">
								<div className="flex items-center gap-3">
									<h3 className="text-2xl font-bold">
										{user.fullName || user.firstName || "Admin"}
									</h3>
									<Badge variant="default">
										<Shield className="h-3 w-3 mr-1" />
										Amministratore
									</Badge>
								</div>

								<div className="grid gap-4 md:grid-cols-2">
									<div className="flex items-start gap-3">
										<Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
										<div className="flex-1 space-y-1">
											<p className="text-sm font-medium">Email</p>
											<p className="text-sm text-muted-foreground">
												{user.emailAddresses[0]?.emailAddress || "N/A"}
											</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<User className="h-5 w-5 text-muted-foreground mt-0.5" />
										<div className="flex-1 space-y-1">
											<p className="text-sm font-medium">ID Utente</p>
											<p className="text-sm text-muted-foreground font-mono">
												{user.id}
											</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
										<div className="flex-1 space-y-1">
											<p className="text-sm font-medium">Data Creazione</p>
											<p className="text-sm text-muted-foreground">
												{new Date(user.createdAt).toLocaleDateString("it-IT", {
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
										<div className="flex-1 space-y-1">
											<p className="text-sm font-medium">
												Ultimo Aggiornamento
											</p>
											<p className="text-sm text-muted-foreground">
												{new Date(user.updatedAt).toLocaleDateString("it-IT", {
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Platform Statistics */}
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<Database className="h-5 w-5" />
							<CardTitle>Statistiche Piattaforma</CardTitle>
						</div>
						<CardDescription>
							Panoramica dei dati della piattaforma
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
							<div className="space-y-2">
								<p className="text-sm font-medium text-muted-foreground">
									Utenti Totali
								</p>
								<p className="text-3xl font-bold">{totalUsers}</p>
								<p className="text-xs text-muted-foreground">
									Utenti registrati sulla piattaforma
								</p>
							</div>

							<div className="space-y-2">
								<p className="text-sm font-medium text-muted-foreground">
									Negozi Totali
								</p>
								<p className="text-3xl font-bold">{totalStores}</p>
								<p className="text-xs text-muted-foreground">
									Negozi attivi e in attesa
								</p>
							</div>

							<div className="space-y-2">
								<p className="text-sm font-medium text-muted-foreground">
									Prodotti Totali
								</p>
								<p className="text-3xl font-bold">{totalProducts}</p>
								<p className="text-xs text-muted-foreground">
									Prodotti nel catalogo
								</p>
							</div>

							<div className="space-y-2">
								<p className="text-sm font-medium text-muted-foreground">
									Ordini Totali
								</p>
								<p className="text-3xl font-bold">{totalOrders}</p>
								<p className="text-xs text-muted-foreground">
									Ordini effettuati
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* System Information */}
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<Server className="h-5 w-5" />
							<CardTitle>Informazioni Sistema</CardTitle>
						</div>
						<CardDescription>
							Dettagli tecnici della piattaforma
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<p className="text-sm font-medium">Versione Piattaforma</p>
									<p className="text-sm text-muted-foreground">v1.0.0</p>
								</div>
								<Badge variant="default">Stabile</Badge>
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<p className="text-sm font-medium">Framework</p>
									<p className="text-sm text-muted-foreground">Next.js 15</p>
								</div>
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<p className="text-sm font-medium">Database</p>
									<p className="text-sm text-muted-foreground">
										MySQL + Prisma
									</p>
								</div>
								<Badge variant="outline">Connesso</Badge>
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<p className="text-sm font-medium">Autenticazione</p>
									<p className="text-sm text-muted-foreground">Clerk</p>
								</div>
								<Badge variant="default">Attivo</Badge>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Settings Sections */}
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<Settings className="h-5 w-5" />
							<CardTitle>Gestione Account</CardTitle>
						</div>
						<CardDescription>
							Per modificare le impostazioni del tuo account, utilizza il
							pulsante profilo nell&apos;angolo in alto a destra della pagina.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="rounded-lg border p-4">
								<h4 className="font-medium mb-2">Profilo</h4>
								<p className="text-sm text-muted-foreground">
									Aggiorna foto profilo, nome e informazioni personali
								</p>
							</div>

							<div className="rounded-lg border p-4">
								<h4 className="font-medium mb-2">Sicurezza</h4>
								<p className="text-sm text-muted-foreground">
									Modifica password e gestisci l&apos;autenticazione a due
									fattori
								</p>
							</div>

							<div className="rounded-lg border p-4">
								<h4 className="font-medium mb-2">Email</h4>
								<p className="text-sm text-muted-foreground">
									Gestisci gli indirizzi email associati al tuo account
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	} catch (error) {
		console.error(error);
		return (
			<div className="flex flex-col gap-6 p-6">
				<Card>
					<CardContent className="pt-6">
						<p className="text-center text-muted-foreground">
							Errore durante il caricamento delle impostazioni.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}
}
