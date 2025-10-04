"use client";

import { Category } from "@/generated/prisma";
import { CategoryFormSchema } from "@/lib/schemas";
import { apiClient } from "@/lib/api-client";
import { handleFormError, showSuccessToast } from "@/lib/error-handler";
import { FC, useEffect, useMemo, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Separator } from "@/components/ui/separator";
import ImageUpload from "@/components/dashboard/shared/image-upload";
import { FormCard } from "@/components/dashboard/shared/form-card";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

interface CategoryDetailsProps {
	data?: Category;
}

const CategoryDetails: FC<CategoryDetailsProps> = ({ data }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const defaultValues = useMemo<Partial<z.input<typeof CategoryFormSchema>>>(
		() => ({
			name: data?.name ?? "",
			description: data?.description ?? "",
			image: data?.image ? [{ url: data.image }] : [],
			slug: data?.slug ?? "",
			featured: data?.featured ?? false,
		}),
		[data]
	);

	const form = useForm<
		z.input<typeof CategoryFormSchema>,
		unknown,
		z.infer<typeof CategoryFormSchema>
	>({
		resolver: zodResolver(CategoryFormSchema),
		defaultValues,
	});

	const isFormLoading = form.formState.isSubmitting || isLoading;

	const handleSubmit = async (values: z.infer<typeof CategoryFormSchema>) => {
		setIsLoading(true);
		try {
			const payload = {
				id: data?.id || uuid(),
				name: values.name,
				image: values.image[0]?.url || '',
				slug: values.slug,
				description: values.description,
				featured: values.featured,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			await apiClient.post("/api/categories/upsert", payload);

			showSuccessToast(
				data?.id ? "Categoria aggiornata" : "Categoria creata",
				"Operazione completata con successo."
			);

			router.push("/dashboard/admin/categories");
		} catch (error) {
			handleFormError(error, "salvataggio categoria");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (data) {
			form.reset(defaultValues);
		}
	}, [data, defaultValues, form]);

	return (
		<FormCard
			title={data?.id ? `Modifica categoria: ${data.name}` : "Nuova categoria"}
			description={data?.id ? "Aggiorna i dettagli della categoria" : "Crea una nuova categoria per organizzare i tuoi prodotti"}
			loading={isFormLoading}
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="space-y-8"
					autoComplete="off"
					suppressHydrationWarning
				>
					<FormField
						control={form.control}
						name="image"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Immagine categoria</FormLabel>
								<FormDescription>
									Carica una sola immagine rappresentativa della categoria.
								</FormDescription>
								<FormControl>
									<ImageUpload
										type="standard"
										maxImages={1}
										uploadText="Carica immagine"
										removeText="Rimuovi"
										value={(field.value ?? []).map((image) => image.url)}
										disabled={isFormLoading}
										onChange={(urls) => field.onChange(urls.map(url => ({ url })))}
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

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome categoria</FormLabel>
									<FormDescription>
										Il nome verrà mostrato agli utenti e nei menu.
									</FormDescription>
									<FormControl>
										<Input placeholder="Nome categoria" {...field} />
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
									<FormLabel>Slug categoria</FormLabel>
									<FormDescription>
										Inserisci lo slug (es. <code>t-shirt</code>). Niente spazi o caratteri speciali.
									</FormDescription>
									<FormControl>
										<Input placeholder="slug-categoria" {...field} />
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
								<FormLabel>Descrizione categoria</FormLabel>
								<FormDescription>
									La descrizione verrà mostrata agli utenti per spiegare il tipo di prodotti nella categoria.
								</FormDescription>
								<FormControl>
									<Textarea
										placeholder="Descrivi questa categoria..."
										className="min-h-[100px]"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="featured"
						render={({ field }) => (
							<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
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
								<div className="space-y-1 leading-none">
									<FormLabel>Categoria in evidenza</FormLabel>
									<FormDescription>
										Le categorie in evidenza vengono mostrate nella homepage e nelle sezioni principali.
									</FormDescription>
								</div>
							</FormItem>
						)}
					/>

					<Separator className="my-6" />

					<div className="flex justify-end gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={() => router.back()}
							disabled={isFormLoading}
						>
							Annulla
						</Button>
						<Button
							type="submit"
							disabled={isFormLoading}
							size="default"
						>
							{isFormLoading ? "Salvataggio..." : "Salva categoria"}
						</Button>
					</div>
				</form>
			</Form>
		</FormCard>
	);
};

export default CategoryDetails;