'use client';

import {
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
	UserButton,
} from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import { Logo } from "../shared/logo";
import { LoadingLink } from "../shared/loading-link";
import { ShoppingBag, Store, Info, Phone, Briefcase, Home } from "lucide-react";

const SearchBar = dynamic(() => import("./search-bar").then(mod => ({ default: mod.SearchBar })), { ssr: false });
const CartIcon = dynamic(() => import("../cart/cart-icon").then(mod => ({ default: mod.CartIcon })), { ssr: false });
const ModeToggle = dynamic(() => import("./mode-toggle").then(mod => ({ default: mod.ModeToggle })), { ssr: false });
const MobileMenu = dynamic(() => import("./mobile-menu").then(mod => ({ default: mod.MobileMenu })), { ssr: false });

const navLinks = [
	{ href: "/", label: "Home", icon: Home },
	{ href: "/products", label: "Prodotti", icon: ShoppingBag },
	{ href: "/stores", label: "Negozi", icon: Store },
	{ href: "/about", label: "Chi Siamo", icon: Info },
	{ href: "/contact", label: "Contatti", icon: Phone },
];

interface NavbarProps {
	userRole?: string;
}

export default function Navbar({ userRole }: NavbarProps) {
	const isSeller = userRole === "SELLER" || userRole === "ADMIN";

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
							<LoadingLink
								key={link.href}
								href={link.href}
								className="text-sm font-medium transition-colors hover:text-primary">
								{link.label}
							</LoadingLink>
						))}
					</nav>

					{/* Right Side Actions */}
					<div className="flex items-center gap-2">
						<SignedIn>
							<CartIcon />
						</SignedIn>
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
								{!isSeller && (
									<LoadingLink href="/become-seller">
										<Button variant="outline" size="sm">
											<Briefcase className="h-4 w-4 mr-2" />
											Diventa Seller
										</Button>
									</LoadingLink>
								)}
								<LoadingLink href="/dashboard">
									<Button size="sm">Dashboard</Button>
								</LoadingLink>
								<UserButton />
							</SignedIn>
						</div>
						<ModeToggle />

						{/* Mobile Menu Button */}
						<MobileMenu navLinks={navLinks} userRole={userRole} />
					</div>
				</div>
			</div>
		</header>
	);
}
