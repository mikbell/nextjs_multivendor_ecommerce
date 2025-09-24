"use client";

import { Store } from "@prisma/client";
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
	data?: Store;
}

const StoreDetails: FC<StoreDetailsProps> = ({ data }) => {
	const router = useRouter(); // Initialize router here

	// Helper to slugify a string
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
			logo: data?.logo ? [{ url: data.logo }] : [],
			cover: data?.cover ? [{ url: data.cover }] : [],
			email: data?.email ?? "",
			phone: data?.phone ?? "",
			slug: data?.slug ?? "",
			featured: data?.featured ?? false,
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

	// Auto-generate slug from name while creating a new store (do not override when editing)
	const nameValue = form.watch("name");
	useEffect(() => {
		if (!data?.id) {
			form.setValue("slug", slugify(nameValue || ""), {
				shouldValidate: true,
				shouldDirty: true,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [nameValue, data?.id]);

	const handleSubmit = async (values: z.infer<typeof StoreFormSchema>) => {
		try {
			const payload = {
				id: data?.id ? data.id : uuid(),
				name: values.name,
				logo: values.logo[0].url,
				cover: values.cover[0].url,
				email: values.email,
				phone: values.phone,
				slug: values.slug,
				description: values.description,
				featured: values.featured,
				status: values.status ?? "PENDING",
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
				throw new Error(data?.error || "Errore durante il salvataggio del negozio.");
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
		<Card className="w-full">
			<CardHeader>
				<CardTitle>
					{data?.id ? `Modifica negozio: ${data?.name}` : "Nuovo negozio"}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-10"
						autoComplete="off"
						suppressHydrationWarning>
						<FormField
							control={form.control}
							name="logo"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Logo negozio</FormLabel>
									<FormDescription>
										Carica una sola immagine per il logo del negozio.
									</FormDescription>
									<FormControl>
										<ImageUpload
											type="logo"
											maxImages={1}
											uploadText="Carica logo"
											removeText="Rimuovi"
											value={(field.value ?? []).map((image) => image.url)}
											disabled={isLoading}
											onChange={(url) => field.onChange([{ url }])}
											onRemove={(url) =>
												field.onChange(
													(field.value ?? []).filter(
														(image) => image.url !== url
													)
												)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="cover"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Immagine negozio</FormLabel>
									<FormDescription>
										Carica una sola immagine rappresentativa del negozio.
									</FormDescription>
									<FormControl>
										<ImageUpload
											type="cover"
											maxImages={1}
											uploadText="Carica cover"
											removeText="Rimuovi"
											value={(field.value ?? []).map((image) => image.url)}
											disabled={isLoading}
											onChange={(url) => field.onChange([{ url }])}
											onRemove={(url) =>
												field.onChange(
													(field.value ?? []).filter(
														(image) => image.url !== url
													)
												)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome negozio</FormLabel>
									<FormDescription>
										Il nome verrà mostrato agli utenti e nei menu.
									</FormDescription>
									<FormControl>
										<Input placeholder="Nome" {...field} />
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
									<FormLabel>Email negozio</FormLabel>
									<FormDescription>
										L&apos;email verrà usata per contatti e notifiche.
									</FormDescription>
									<FormControl>
										<Input placeholder="email@negozio.it" type="email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Telefono negozio</FormLabel>
									<FormDescription>
										Numero di telefono per i contatti.
									</FormDescription>
									<FormControl>
										<Input placeholder="0123456789" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descrizione negozio</FormLabel>
									<FormDescription>
										La descrizione verrà mostrata agli utenti.
									</FormDescription>
									<FormControl>
										<Textarea placeholder="Descrizione" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
											onBlur={field.onBlur}
											name={field.name}
											ref={field.ref}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Salvataggio..." : "Salva"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default StoreDetails;
