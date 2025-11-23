import { Metadata } from "next";
import { Building2, Users, Target, Award, TrendingUp, Shield } from "lucide-react";
import Heading from "@/components/shared/heading";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Chi Siamo - GoShop",
	description:
		"Scopri la storia di GoShop, la piattaforma di e-commerce multivendor italiana. La nostra missione, i nostri valori e il nostro team.",
};

const stats = [
	{ label: "Venditori Attivi", value: "10,000+", icon: Users },
	{ label: "Prodotti", value: "500,000+", icon: Building2 },
	{ label: "Clienti Soddisfatti", value: "1M+", icon: Award },
	{ label: "Crescita Annuale", value: "300%", icon: TrendingUp },
];

const values = [
	{
		icon: Shield,
		title: "Affidabilità",
		description:
			"Garantiamo transazioni sicure e protezione dei dati personali per tutti i nostri utenti.",
	},
	{
		icon: Users,
		title: "Comunità",
		description:
			"Creiamo un ecosistema dove venditori e acquirenti possono crescere insieme.",
	},
	{
		icon: Target,
		title: "Innovazione",
		description:
			"Utilizziamo le tecnologie più avanzate per offrire la migliore esperienza di shopping online.",
	},
	{
		icon: Award,
		title: "Qualità",
		description:
			"Selezioniamo attentamente i nostri venditori per garantire prodotti di alta qualità.",
	},
];

export default function AboutPage() {
	return (
		<div className="space-y-16">
			{/* Hero Section */}
			<section className="text-center space-y-4">
				<Heading>Chi Siamo</Heading>
				<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
					GoShop è la piattaforma di e-commerce multivendor italiana che
					connette migliaia di venditori con milioni di acquirenti in tutta
					Italia.
				</p>
			</section>

			{/* Stats Section */}
			<section className="grid grid-cols-2 md:grid-cols-4 gap-6">
				{stats.map((stat) => (
					<Card key={stat.label}>
						<CardContent className="pt-6 text-center space-y-2">
							<stat.icon className="h-8 w-8 mx-auto text-primary" />
							<p className="text-3xl font-bold">{stat.value}</p>
							<p className="text-sm text-muted-foreground">{stat.label}</p>
						</CardContent>
					</Card>
				))}
			</section>

			{/* Story Section */}
			<section className="space-y-6">
				<h2 className="text-3xl font-bold tracking-tight text-center">
					La Nostra Storia
				</h2>
				<div className="max-w-3xl mx-auto space-y-4 text-muted-foreground">
					<p>
						Fondata nel 2020, GoShop nasce dall&apos;idea di creare una
						piattaforma che permettesse a piccoli e grandi venditori italiani
						di raggiungere un pubblico più ampio, mantenendo al contempo
						l&apos;autenticità e la qualità dei prodotti Made in Italy.
					</p>
					<p>
						Negli ultimi anni abbiamo visto una crescita esponenziale, passando
						da poche centinaia di venditori a oltre 10,000 negozi attivi sulla
						nostra piattaforma. Questo successo è dovuto alla fiducia che i
						nostri utenti ripongono in noi e al nostro impegno costante per
						migliorare l&apos;esperienza di shopping online.
					</p>
					<p>
						Oggi, GoShop è molto più di un semplice marketplace: è una comunità
						di venditori appassionati e acquirenti esigenti che condividono la
						stessa passione per la qualità e l&apos;innovazione.
					</p>
				</div>
			</section>

			{/* Values Section */}
			<section className="space-y-6">
				<h2 className="text-3xl font-bold tracking-tight text-center">
					I Nostri Valori
				</h2>
				<div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
					{values.map((value) => (
						<Card key={value.title}>
							<CardContent className="pt-6 space-y-4">
								<div className="flex items-center gap-3">
									<div className="p-2 rounded-lg bg-primary/10">
										<value.icon className="h-6 w-6 text-primary" />
									</div>
									<h3 className="text-xl font-semibold">{value.title}</h3>
								</div>
								<p className="text-muted-foreground">{value.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* Mission Section */}
			<section className="rounded-2xl bg-primary/5 p-8 md:p-12 space-y-4">
				<h2 className="text-3xl font-bold tracking-tight text-center">
					La Nostra Missione
				</h2>
				<p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
					Rendere l&apos;e-commerce accessibile a tutti, offrendo una
					piattaforma sicura, intuitiva e conveniente dove venditori e
					acquirenti possono incontrarsi e crescere insieme. Vogliamo essere il
					punto di riferimento per lo shopping online in Italia, promuovendo
					l&apos;eccellenza e l&apos;innovazione.
				</p>
			</section>
		</div>
	);
}
