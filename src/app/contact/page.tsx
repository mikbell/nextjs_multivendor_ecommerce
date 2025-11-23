"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from "lucide-react";
import Heading from "@/components/shared/heading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const contactInfo = [
	{
		icon: Mail,
		title: "Email",
		content: "info@goshop.it",
		link: "mailto:info@goshop.it",
	},
	{
		icon: Phone,
		title: "Telefono",
		content: "+39 012 345 6789",
		link: "tel:+390123456789",
	},
	{
		icon: MapPin,
		title: "Indirizzo",
		content: "Via Roma 123, 00100 Roma, Italia",
		link: null,
	},
	{
		icon: Clock,
		title: "Orari",
		content: "Lun-Ven: 9:00-18:00",
		link: null,
	},
];

const faqTopics = [
	{
		icon: MessageSquare,
		title: "Supporto Acquirenti",
		description: "Assistenza per ordini, spedizioni e resi",
	},
	{
		icon: MessageSquare,
		title: "Supporto Venditori",
		description: "Assistenza per gestione negozio e prodotti",
	},
	{
		icon: MessageSquare,
		title: "Assistenza Tecnica",
		description: "Problemi tecnici e funzionalità della piattaforma",
	},
	{
		icon: MessageSquare,
		title: "Partnership",
		description: "Collaborazioni e opportunità di business",
	},
];

export default function ContactPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate form submission
		await new Promise((resolve) => setTimeout(resolve, 1500));

		toast.success("Messaggio inviato con successo!", {
			description: "Ti risponderemo al più presto.",
		});

		setFormData({
			name: "",
			email: "",
			subject: "",
			message: "",
		});
		setIsSubmitting(false);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	};

	return (
		<div className="space-y-16">
			{/* Hero Section */}
			<section className="text-center space-y-4">
				<Heading>Contattaci</Heading>
				<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
					Hai domande o necessiti di assistenza? Il nostro team è qui per
					aiutarti. Compila il form o contattaci direttamente.
				</p>
			</section>

			{/* Contact Info Cards */}
			<section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
				{contactInfo.map((info) => (
					<Card key={info.title}>
						<CardContent className="pt-6 space-y-4">
							<div className="p-2 rounded-lg bg-primary/10 w-fit">
								<info.icon className="h-6 w-6 text-primary" />
							</div>
							<div>
								<h3 className="font-semibold mb-1">{info.title}</h3>
								{info.link ? (
									<a
										href={info.link}
										className="text-sm text-muted-foreground hover:text-primary transition-colors">
										{info.content}
									</a>
								) : (
									<p className="text-sm text-muted-foreground">
										{info.content}
									</p>
								)}
							</div>
						</CardContent>
					</Card>
				))}
			</section>

			{/* Contact Form and FAQ Topics */}
			<section className="grid lg:grid-cols-2 gap-12">
				{/* Contact Form */}
				<div className="space-y-6">
					<div>
						<h2 className="text-3xl font-bold tracking-tight mb-2">
							Invia un messaggio
						</h2>
						<p className="text-muted-foreground">
							Compila il form e ti risponderemo entro 24 ore.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Nome e Cognome</Label>
							<Input
								id="name"
								type="text"
								placeholder="Mario Rossi"
								value={formData.name}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="mario.rossi@example.com"
								value={formData.email}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="subject">Oggetto</Label>
							<Input
								id="subject"
								type="text"
								placeholder="Come possiamo aiutarti?"
								value={formData.subject}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="message">Messaggio</Label>
							<Textarea
								id="message"
								placeholder="Scrivi qui il tuo messaggio..."
								rows={6}
								value={formData.message}
								onChange={handleChange}
								required
							/>
						</div>

						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? (
								"Invio in corso..."
							) : (
								<>
									<Send className="mr-2 h-4 w-4" />
									Invia Messaggio
								</>
							)}
						</Button>
					</form>
				</div>

				{/* FAQ Topics */}
				<div className="space-y-6">
					<div>
						<h2 className="text-3xl font-bold tracking-tight mb-2">
							Argomenti Frequenti
						</h2>
						<p className="text-muted-foreground">
							Scegli l&apos;argomento più adatto alla tua richiesta.
						</p>
					</div>

					<div className="space-y-4">
						{faqTopics.map((topic) => (
							<Card key={topic.title} className="hover:border-primary/50 transition-colors">
								<CardContent className="pt-6">
									<div className="flex gap-4">
										<div className="p-2 rounded-lg bg-primary/10 h-fit">
											<topic.icon className="h-5 w-5 text-primary" />
										</div>
										<div>
											<h3 className="font-semibold mb-1">{topic.title}</h3>
											<p className="text-sm text-muted-foreground">
												{topic.description}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					{/* Additional Info */}
					<Card className="bg-primary/5 border-primary/20">
						<CardContent className="pt-6 space-y-2">
							<h3 className="font-semibold">Tempi di risposta</h3>
							<p className="text-sm text-muted-foreground">
								Il nostro team risponde generalmente entro 24 ore nei giorni
								lavorativi. Per richieste urgenti, ti consigliamo di contattarci
								telefonicamente.
							</p>
						</CardContent>
					</Card>
				</div>
			</section>
		</div>
	);
}
