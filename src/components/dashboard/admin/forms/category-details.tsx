"use client";

import { Category } from "@/generated/prisma";
import { CategoryFormSchema } from "@/lib/schemas";
import { FC, useEffect, useMemo } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Card,
	CardContent,
	CardTitle,
	CardHeader,
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

interface CategoryDetailsProps {
	data?: Category;
}

const CategoryDetails: FC<CategoryDetailsProps> = ({ data }) => {
	const router = useRouter(); // Initialize router here

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

	const isLoading = form.formState.isSubmitting;

	const handleSubmit = async (values: z.infer<typeof CategoryFormSchema>) => {
		try {
			const payload = {
				id: data?.id ? data.id : uuid(),
				name: values.name,
				image: values.image[0].url,
				slug: values.slug,
				description: values.description,
				featured: values.featured,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			const res = await fetch("/api/categories/upsert", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data?.error || "Errore durante il salvataggio.");
			}
			toast.success(data?.id ? "Modifica categoria" : "Nuova categoria", {
				description: "Categoria salvata con successo.",
			});
			router.push("/dashboard/admin/categories");
		} catch (error) {
			console.log(error);
			toast.error(data?.id ? "Modifica categoria" : "Nuova categoria", {
				description: "Errore durante il salvataggio.",
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
					{data?.id
						? `Modifica categoria: ${data?.name}`
						: "Nuova categoria"}
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
									<FormLabel>Slug categoria</FormLabel>
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
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descrizione categoria</FormLabel>
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

export default CategoryDetails;
