"use client";

import { SubCategory } from "@/generated/prisma";
import { SubCategoryFormSchema } from "@/lib/schemas";
import { FC, useEffect, useMemo } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { Category } from "@/generated/prisma";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

interface SubCategoryDetailsProps {
	data?: SubCategory;
	categories?: Category[];
}

const SubCategoryDetails: FC<SubCategoryDetailsProps> = ({
	data,
	categories,
}) => {
	const router = useRouter(); // Initialize router here

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

	const isLoading = form.formState.isSubmitting;

	const handleSubmit = async (
		values: z.infer<typeof SubCategoryFormSchema>
	) => {
		try {
			const payload = {
				id: data?.id ? data.id : uuid(),
				name: values.name,
				image: values.image[0].url,
				slug: values.slug,
				description: values.description,
				featured: values.featured,
				categoryId: values.categoryId,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			const res = await fetch("/api/subCategories/upsert", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data?.error || "Errore durante il salvataggio.");
			}
			toast.success(
				data?.id ? "Modifica sotto-categoria" : "Nuova sotto-categoria",
				{
					description: "Sotto-categoria salvata con successo.",
				}
			);
			router.push("/dashboard/admin/subCategories");
		} catch (error) {
			console.log(error);
			toast.error(
				data?.id ? "Modifica sotto-categoria" : "Nuova sotto-categoria",
				{
					description: "Errore durante il salvataggio.",
				}
			);
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
					{data?.id
						? `Modifica sotto-categoria: ${data?.name}`
						: "Nuova sotto-categoria"}
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
							name="image"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Immagine sotto-categoria</FormLabel>
									<FormDescription>
										Carica una sola immagine rappresentativa della
										sotto-categoria.
									</FormDescription>
									<FormControl>
										<ImageUpload
											type="standard"
											maxImages={1}
											uploadText="Carica immagine"
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
									<FormLabel>Nome categoria</FormLabel>
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
							name="slug"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Slug sotto-categoria</FormLabel>
									<FormDescription>
										Inserisci lo slug (es. <code>t-shirt</code>). Niente spazi o
										caratteri speciali.
									</FormDescription>
									<FormControl>
										<Input placeholder="slug" {...field} />
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
									<FormLabel>Categoria</FormLabel>
									<FormDescription>
										Seleziona la categoria a cui appartiene la sotto-categoria.
									</FormDescription>
									<FormControl>
										<Select
											disabled={isLoading || (categories?.length ?? 0) === 0}
											value={field.value}
											onValueChange={field.onChange}
										>
											<SelectTrigger>
												<SelectValue placeholder="Seleziona una categoria" />
											</SelectTrigger>
											<SelectContent>
												{(categories ?? []).map((c) => (
													<SelectItem key={c.id} value={c.id}>
														{c.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
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
									<FormLabel>Descrizione sotto-categoria</FormLabel>
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

export default SubCategoryDetails;
