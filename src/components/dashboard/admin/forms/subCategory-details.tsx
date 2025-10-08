"use client";

import { SubCategory, Category } from "@/generated/prisma";
import { SubCategoryFormSchema } from "@/lib/schemas/category";
import { apiClient, ApiClientError } from "@/lib/api-client";
import { FC, useEffect, useMemo, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormCard } from "@/components/dashboard/shared/form-card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
	SubCategoryImage,
	CategorySelector,
	SubCategoryBasicInfo,
	SubCategoryDescription,
	SubCategorySettings,
	SubCategoryFormActions,
} from "./subCategory-details/index";

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
			url: (data as SubCategory & { url?: string })?.url ?? "",
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
			const payload: Record<string, unknown> = {
				name: values.name,
				image: values.image || [], // Invia l'array completo come richiesto dallo schema
				slug: values.slug,
				url: values.url,
				description: values.description,
				featured: values.featured,
				categoryId: values.categoryId,
			};
			
			// Aggiungi ID solo se stiamo modificando una sottocategoria esistente
			if (data?.id) {
				payload.id = data.id;
			}
			
			// Aggiungi timestamp solo per nuove sottocategorie (il server gestirà quelli per gli update)
			if (!data?.id) {
				payload.createdAt = new Date();
				payload.updatedAt = new Date();
			}

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
					{/* SubCategory Image Section */}
					<SubCategoryImage form={form} isLoading={isFormLoading} />

					{/* Category Selector Section */}
					<CategorySelector form={form} categories={categories} isLoading={isFormLoading} />

					{/* SubCategory Basic Info Section */}
					<SubCategoryBasicInfo form={form} />

					{/* SubCategory Description Section */}
					<SubCategoryDescription form={form} />

					{/* SubCategory Settings Section */}
					<SubCategorySettings form={form} />

					{/* Form Actions Section */}
					<SubCategoryFormActions isLoading={isFormLoading} />
				</form>
			</Form>
		</FormCard>
	);
};

export default SubCategoryDetails;