import Link from "next/link";
import { Logo } from "../shared/logo";
import { Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
	company: [
		{ href: "/about", label: "Chi Siamo" },
		{ href: "/contact", label: "Contatti" },
		{ href: "/careers", label: "Lavora con Noi" },
		{ href: "/press", label: "Stampa" },
	],
	shopping: [
		{ href: "/products", label: "Prodotti" },
		{ href: "/stores", label: "Negozi" },
		{ href: "/categories", label: "Categorie" },
		{ href: "/deals", label: "Offerte" },
	],
	support: [
		{ href: "/help", label: "Centro Assistenza" },
		{ href: "/shipping", label: "Spedizioni" },
		{ href: "/returns", label: "Resi" },
		{ href: "/faq", label: "FAQ" },
	],
	legal: [
		{ href: "/privacy", label: "Privacy Policy" },
		{ href: "/terms", label: "Termini di Servizio" },
		{ href: "/cookies", label: "Cookie Policy" },
	],
};

export default function Footer() {
	return (
		<footer className="border-t bg-background">
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
					{/* Brand Section */}
					<div className="lg:col-span-2">
						<Logo />
						<p className="mt-4 text-sm text-muted-foreground max-w-xs">
							La tua piattaforma di e-commerce multivendor di fiducia. Scopri
							migliaia di prodotti dai migliori venditori.
						</p>

						{/* Contact Info */}
						<div className="mt-6 space-y-3">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Mail className="h-4 w-4" />
								<a
									href="mailto:info@goshop.it"
									className="hover:text-primary transition-colors">
									info@goshop.it
								</a>
							</div>
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Phone className="h-4 w-4" />
								<a
									href="tel:+390123456789"
									className="hover:text-primary transition-colors">
									+39 012 345 6789
								</a>
							</div>
							<div className="flex items-start gap-2 text-sm text-muted-foreground">
								<MapPin className="h-4 w-4 mt-0.5" />
								<span>Via Roma 123, 00100 Roma, Italia</span>
							</div>
						</div>
					</div>

					{/* Company Links */}
					<div>
						<h3 className="font-semibold mb-4">Azienda</h3>
						<ul className="space-y-3">
							{footerLinks.company.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-primary transition-colors">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Shopping Links */}
					<div>
						<h3 className="font-semibold mb-4">Shopping</h3>
						<ul className="space-y-3">
							{footerLinks.shopping.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-primary transition-colors">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Support Links */}
					<div>
						<h3 className="font-semibold mb-4">Supporto</h3>
						<ul className="space-y-3">
							{footerLinks.support.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-primary transition-colors">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="mt-12 pt-8 border-t">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						{/* Copyright */}
						<p className="text-sm text-muted-foreground">
							© {new Date().getFullYear()} GoShop. Tutti i diritti riservati.
						</p>

						{/* Legal Links */}
						<div className="flex flex-wrap gap-4">
							{footerLinks.legal.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className="text-sm text-muted-foreground hover:text-primary transition-colors">
									{link.label}
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
