import {
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
	UserButton,
} from "@clerk/nextjs";
import { Button } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "../shared/logo";
import { SearchBar } from "./search-bar";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag, Store, Info, Phone } from "lucide-react";

const navLinks = [
	{ href: "/", label: "Home" },
	{ href: "/products", label: "Prodotti", icon: ShoppingBag },
	{ href: "/stores", label: "Negozi", icon: Store },
	{ href: "/about", label: "Chi Siamo", icon: Info },
	{ href: "/contact", label: "Contatti", icon: Phone },
];

export default function Navbar() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<Logo />

					{/* Search Bar */}
					<div className="hidden lg:flex flex-1 max-w-md mx-6">
						<SearchBar />
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-6">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="text-sm font-medium transition-colors hover:text-primary">
								{link.label}
							</Link>
						))}
					</nav>

					{/* Right Side Actions */}
					<div className="flex items-center gap-2">
						<div className="hidden md:flex items-center gap-2">
							<SignedOut>
								<SignInButton>
									<Button variant="ghost" size="sm">
										Accedi
									</Button>
								</SignInButton>
								<SignUpButton>
									<Button size="sm">Registrati</Button>
								</SignUpButton>
							</SignedOut>
							<SignedIn>
								<Link href="/dashboard">
									<Button size="sm">Dashboard</Button>
								</Link>
								<UserButton />
							</SignedIn>
						</div>
						<ThemeToggle />

						{/* Mobile Menu Button */}
						<Button
							variant="ghost"
							size="icon"
							className="md:hidden"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							aria-label="Toggle menu">
							{mobileMenuOpen ? (
								<X className="h-5 w-5" />
							) : (
								<Menu className="h-5 w-5" />
							)}
						</Button>
					</div>
				</div>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className="md:hidden border-t py-4">
						{/* Mobile Search */}
						<div className="mb-4">
							<SearchBar />
						</div>
						<nav className="flex flex-col space-y-3">
							{navLinks.map((link) => {
								const Icon = link.icon;
								return (
									<Link
										key={link.href}
										href={link.href}
										onClick={() => setMobileMenuOpen(false)}
										className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary px-2 py-2 rounded-md hover:bg-accent">
										{Icon && <Icon className="h-4 w-4" />}
										{link.label}
									</Link>
								);
							})}

							<div className="flex flex-col gap-2 pt-4 border-t">
								<SignedOut>
									<SignInButton>
										<Button variant="ghost" className="w-full justify-start">
											Accedi
										</Button>
									</SignInButton>
									<SignUpButton>
										<Button className="w-full justify-start">Registrati</Button>
									</SignUpButton>
								</SignedOut>
								<SignedIn>
									<Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
										<Button className="w-full justify-start">Dashboard</Button>
									</Link>
								</SignedIn>
							</div>
						</nav>
					</div>
				)}
			</div>
		</header>
	);
}
