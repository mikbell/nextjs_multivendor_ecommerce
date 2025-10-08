"use client";

import { StoreFormSchema } from "@/lib/schemas";
import { FC, useEffect, useMemo } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
	BasicInfo,
	MediaUpload,
	StoreDescription,
	ShippingSettings,
	StorePolicies,
} from "./store-details/index";

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
						className="space-y-8">

						{/* Media Upload Section */}
						<MediaUpload form={form} />

						{/* Basic Information Section */}
						<BasicInfo form={form} />

						{/* Store Description Section */}
						<StoreDescription form={form} />

						{/* Shipping Settings Section */}
						<ShippingSettings form={form} />

						{/* Store Policies Section */}
						<StorePolicies form={form} />

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
