"use client";

import { SubCategory, Category } from "@/generated/prisma";
import { SubCategoryFormSchema } from "@/lib/schemas";
import { apiClient, ApiClientError } from "@/lib/api-client";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ImageUpload from "@/components/dashboard/shared/image-upload";
import { FormCard } from "@/components/dashboard/shared/form-card";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

interface SubCategoryDetailsProps {
	data?: SubCategory;
	categories: Category[];
}

const SubCategoryDetails: FC<SubCategoryDetailsProps> = ({ data, categories }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const defaultValues = useMemo<Partial<z.input<typeof SubCategoryFormSchema>>>(
		() => ({
			name: data?.name ?? "",
			description: data?.description ?? "",
			image: data?.image ? [{ url: data.image }] : [],
			slug: data?.slug ?? "",
			featured: data?.featured ?? false,
			categoryId: data?.categoryId ?? "",
		}),
		[data]
	);

	const form = useForm<
		z.input<typeof SubCategoryFormSchema>,
		unknown,
		z.infer<typeof SubCategoryFormSchema>
	>({
		resolver: zodResolver(SubCategoryFormSchema),
		defaultValues,
	});

	const isFormLoading = form.formState.isSubmitting || isLoading;

	const handleSubmit = async (values: z.infer<typeof SubCategoryFormSchema>) => {
		setIsLoading(true);
		try {
			const payload = {
				id: data?.id || uuid(),
				name: values.name,
				image: values.image[0]?.url || '',
				slug: values.slug,
				description: values.description,
				featured: values.featured,
				categoryId: values.categoryId,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			await apiClient.post("/api/subCategories/upsert", payload);

			toast.success(data?.id ? "Sottocategoria aggiornata" : "Sottocategoria creata", {
				description: "Operazione completata con successo.",
			});

			router.push("/dashboard/admin/subCategories");
		} catch (error) {
			console.error("Error saving subcategory:", error);

			const message = error instanceof ApiClientError
				? error.message
				: "Errore imprevisto durante il salvataggio";

			toast.error(data?.id ? "Errore modifica sottocategoria" : "Errore creazione sottocategoria", {
				description: message,
			});
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
			title={data?.id ? `Modifica sottocategoria: ${data.name}` : "Nuova sottocategoria"}
			description={data?.id ? "Aggiorna i dettagli della sottocategoria" : "Crea una nuova sottocategoria per specializzare le tue categorie"}
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
								<FormLabel>Immagine sottocategoria</FormLabel>
								<FormDescription>
									Carica una sola immagine rappresentativa della sottocategoria.
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

					<FormField
						control={form.control}
						name="categoryId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Categoria padre</FormLabel>
								<FormDescription>
									Seleziona la categoria a cui appartiene questa sottocategoria.
								</FormDescription>
								<Select
									onValueChange={field.onChange}
									value={field.value}
									disabled={isFormLoading}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Seleziona una categoria" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{categories.map((category) => (
											<SelectItem key={category.id} value={category.id}>
												{category.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
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
									<FormLabel>Nome sottocategoria</FormLabel>
									<FormDescription>
										Il nome verrà mostrato agli utenti e nei menu.
									</FormDescription>
									<FormControl>
										<Input placeholder="Nome sottocategoria" {...field} />
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
									<FormLabel>Slug sottocategoria</FormLabel>
									<FormDescription>
										Inserisci lo slug (es. <code>t-shirt-uomo</code>). Niente spazi o caratteri speciali.
									</FormDescription>
									<FormControl>
										<Input placeholder="slug-sottocategoria" {...field} />
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
								<FormLabel>Descrizione sottocategoria</FormLabel>
								<FormDescription>
									La descrizione verrà mostrata agli utenti per spiegare il tipo specifico di prodotti.
								</FormDescription>
								<FormControl>
									<Textarea
										placeholder="Descrivi questa sottocategoria..."
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
									<FormLabel>Sottocategoria in evidenza</FormLabel>
									<FormDescription>
										Le sottocategorie in evidenza vengono mostrate nelle sezioni principali della categoria.
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
							{isFormLoading ? "Salvataggio..." : "Salva sottocategoria"}
						</Button>
					</div>
				</form>
			</Form>
		</FormCard>
	);
};

export default SubCategoryDetails;