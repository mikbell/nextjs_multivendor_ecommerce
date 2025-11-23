import { useState } from "react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { SearchBar } from "./search-bar";
import { Briefcase, ShoppingBag, User } from "lucide-react";

interface MobileMenuProps {
	navLinks: {
		href: string;
		label: string;
        icon?: React.ComponentType<{ className?: string }>;
	}[];
	userRole: string | undefined;
}

export function MobileMenu({ navLinks, userRole }: MobileMenuProps) {
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const isSeller = userRole === "SELLER" || userRole === "ADMIN";

	// Funzione per chiudere il menu dopo aver cliccato un link
	const handleLinkClick = () => {
		setIsSheetOpen(false);
	};

	return (
		<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
			{/* Pulsante per aprire il menu (Trigger) */}
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="md:hidden"
					aria-label="Toggle menu">
					<Menu className="h-5 w-5" />
				</Button>
			</SheetTrigger>

			{/* Contenuto del menu (Content) */}
			<SheetContent side="right">
				<SheetHeader>
					<SheetTitle>Navigazione Principale</SheetTitle>
					<div className="text-sm text-muted-foreground">
						Esplora e gestisci il tuo account.
					</div>
				</SheetHeader>

				<div className="flex flex-col space-y-6 pt-4 h-full">
					{/* Mobile Search - spostato in alto per visibilità */}
					<div className="mb-4">
						<SearchBar />
					</div>

					{/* Navigazione principale */}
					<nav className="flex flex-col space-y-1 overflow-y-auto grow">
						{navLinks.map((link) => {
							const Icon = link.icon;
							return (
								<Link
									key={link.href}
									href={link.href}
									onClick={handleLinkClick} // Chiude il menu al click
									className="flex items-center gap-3 text-base font-medium transition-colors hover:text-primary px-3 py-3 rounded-lg hover:bg-accent">
									{Icon && <Icon className="h-5 w-5 text-primary" />}
									{link.label}
								</Link>
							);
						})}
					</nav>

					{/* Autenticazione e Azioni Utente (Spostato in fondo, separato) */}
					<div className="flex flex-col gap-3 py-4 border-t">
						<SignedOut>
							<SignInButton>
								<Button
									variant="outline"
									className="w-full justify-start text-base">
									<User className="h-4 w-4 mr-2" />
									Accedi
								</Button>
							</SignInButton>
							<SignUpButton>
								<Button className="w-full justify-start text-base">
									Registrati
								</Button>
							</SignUpButton>
						</SignedOut>
						<SignedIn>
							<Link href="/cart" onClick={handleLinkClick}>
								<Button variant="ghost" className="w-full justify-start">
									<ShoppingBag className="h-4 w-4 mr-2" />
									Carrello
								</Button>
							</Link>
							{!isSeller && (
								<Link href="/become-seller" onClick={handleLinkClick}>
									<Button variant="outline" className="w-full justify-start">
										<Briefcase className="h-4 w-4 mr-2" />
										Diventa Seller
									</Button>
								</Link>
							)}
							<Link href="/dashboard" onClick={handleLinkClick}>
								<Button className="w-full justify-start">Dashboard</Button>
							</Link>
						</SignedIn>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
