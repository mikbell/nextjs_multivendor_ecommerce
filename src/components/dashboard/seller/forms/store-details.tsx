"use client";

import { StoreFormSchema } from "@/lib/schemas";
import { FC, useEffect, useMemo } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/dashboard/shared/image-upload";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

interface StoreDetailsProps {
	data?: Partial<z.input<typeof StoreFormSchema>> & { id?: string };
}

const StoreDetails: FC<StoreDetailsProps> = ({ data }) => {
	const router = useRouter();

	const slugify = (value: string) =>
		value
			.normalize("NFD")
			.replace(/\p{Diacritic}+/gu, "")
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)+/g, "");

	const defaultValues = useMemo<Partial<z.input<typeof StoreFormSchema>>>(
		() => ({
			name: data?.name ?? "",
			description: data?.description ?? "",
			logo: data?.logo ?? "",
			cover: data?.cover ?? "",
			email: data?.email ?? "",
			phone: data?.phone ?? "",
			slug: data?.slug ?? "",
			featured: data?.featured ?? false,
			returnPolicy: data?.returnPolicy ?? "Return in 30 days.",
			defaultShippingService: data?.defaultShippingService ?? "International Delivery",
			defaultShippingFee: data?.defaultShippingFee ?? 0,
			defaultDeliveryTimeMin: data?.defaultDeliveryTimeMin ?? 7,
			defaultDeliveryTimeMax: data?.defaultDeliveryTimeMax ?? 31,
		}),
		[data]
	);

	const form = useForm<
		z.input<typeof StoreFormSchema>,
		unknown,
		z.infer<typeof StoreFormSchema>
	>({
		resolver: zodResolver(StoreFormSchema),
		defaultValues,
	});

	const isLoading = form.formState.isSubmitting;

	const nameValue = form.watch("name");
	useEffect(() => {
		if (!data?.id) {
			form.setValue("slug", slugify(nameValue || ""), {
				shouldValidate: true,
				shouldDirty: true,
			});
		}
	}, [nameValue, data?.id, form]);

	const handleSubmit = async (values: z.infer<typeof StoreFormSchema>) => {
		try {
		const payload = {
			id: data?.id ? data.id : uuid(),
			name: values.name,
			logo: values.logo,
			cover: values.cover,
			email: values.email,
			phone: values.phone,
			slug: values.slug,
			url: values.slug, // Use slug as URL for now
			description: values.description,
			featured: values.featured || false,
			status: "PENDING" as const,
			averageRating: 0,
			numReviews: 0,
			returnPolicy: values.returnPolicy,
			defaultShippingService: values.defaultShippingService,
			defaultShippingFeePerItem: Number(values.defaultShippingFee) || 0,
			defaultShippingFeeForAdditionalItem: 0,
			defaultShippingFeePerKg: 0,
			defaultShippingFeeFixed: 0,
			defaultDeliveryTimeMin: Number(values.defaultDeliveryTimeMin) || 7,
			defaultDeliveryTimeMax: Number(values.defaultDeliveryTimeMax) || 31,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
			const res = await fetch("/api/stores/upsert", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(
					data?.error || "Errore durante il salvataggio del negozio."
				);
			}
			toast.success(data?.id ? "Modifica negozio" : "Nuovo negozio", {
				description: "Negozio salvato con successo.",
			});
			router.push(`/dashboard/seller/stores/${values.slug}`);
		} catch (error) {
			console.log(error);
			toast.error(data?.id ? "Modifica negozio" : "Nuovo negozio", {
				description: "Errore durante il salvataggio del negozio.",
			});
		}
	};

	useEffect(() => {
		if (data) {
			form.reset(defaultValues);
		}
	}, [data, defaultValues, form]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Dettagli negozio</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* CAMPO LOGO AGGIORNATO */}
							<FormField
								control={form.control}
								name="logo"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Logo</FormLabel>
										<FormControl>
											<ImageUpload
												value={
													field.value ? [field.value] : []
												}
												onChange={(urls) => field.onChange(urls[0] ?? "")}
												onRemove={() => field.onChange("")}
												type="logo"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* CAMPO COVER AGGIORNATO */}
							<FormField
								control={form.control}
								name="cover"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Cover</FormLabel>
										<FormControl>
											<ImageUpload
												value={
													field.value ? [field.value] : []
												}
												onChange={(urls) => field.onChange(urls[0] ?? "")}
												onRemove={() => field.onChange("")}
												type="cover"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{/* Resto del form invariato */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nome</FormLabel>
										<FormControl>
											<Input placeholder="es. Mio negozio" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="es. nome@dominio.it"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Telefono</FormLabel>
										<FormControl>
											<Input placeholder="es. +39 333 1234567" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="slug"
								render={({ field }) => (
									<FormItem>
										<FormLabel>URL</FormLabel>
										<FormDescription>
											Minuscole, numeri e trattini.
										</FormDescription>
										<FormControl>
											<Input placeholder="es. mio-negozio" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descrizione</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Descrivi il tuo negozio"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<FormField
								control={form.control}
								name="featured"
								render={({ field }) => (
									<FormItem className="flex items-center gap-2">
										<FormLabel>In evidenza</FormLabel>
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={(checked) =>
													field.onChange(checked === true)
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="defaultShippingService"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Servizio di spedizione predefinito</FormLabel>
										<FormControl>
											<Input placeholder="es. DHL, Poste, ..." {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="defaultShippingFee"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Spedizione (euro)</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												min={0}
												name={field.name}
												onBlur={field.onBlur}
												ref={field.ref}
												value={Number(field.value ?? 0)}
												onChange={(e) => field.onChange(Number(e.target.value))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="defaultDeliveryTimeMin"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tempo consegna min (giorni)</FormLabel>
										<FormControl>
											<Input
												type="number"
												min={0}
												name={field.name}
												onBlur={field.onBlur}
												ref={field.ref}
												value={Number(field.value ?? 0)}
												onChange={(e) => field.onChange(Number(e.target.value))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="defaultDeliveryTimeMax"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tempo consegna max (giorni)</FormLabel>
										<FormControl>
											<Input
												type="number"
												min={0}
												name={field.name}
												onBlur={field.onBlur}
												ref={field.ref}
												value={Number(field.value ?? 0)}
												onChange={(e) => field.onChange(Number(e.target.value))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="returnPolicy"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Politica di reso</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Dettagli sulla politica di reso"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" disabled={isLoading}>
							{isLoading
								? "Salvataggio..."
								: data?.id
								? "Salva modifiche"
								: "Crea negozio"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default StoreDetails;
