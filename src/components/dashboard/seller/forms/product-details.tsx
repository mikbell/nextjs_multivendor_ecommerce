"use client";

import { FC, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/dashboard/shared/image-upload";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";

import {
	ProductFormSchema,
	ProductFormSchemaInputType,
	ProductFormSchemaOutputType,
} from "@/lib/schemas"; // Assicurati che il percorso sia corretto

interface ProductDetailsProps {
	stores: { id: string; name: string }[];
	categories: { id: string; name: string }[];
	subcategories: { id: string; name: string; categoryId: string }[];
}

const ProductDetails: FC<ProductDetailsProps> = ({
	stores,
	categories,
	subcategories,
}) => {
	// Rimosso useMemo, non necessario per valori statici
	const defaultValues: ProductFormSchemaInputType = {
		name: "",
		description: "",
		slug: "",
		brand: "",
		storeId: "",
		categoryId: "",
		subCategoryId: "",
		rating: 0,
		variants: [
			{
				name: "",
				description: "",
				slug: "",
				isOnSale: false,
				keywords: "",
				sku: "",
				mainImage: "",
				price: 0,
				sizes: [],
				images: [],
				colors: [],
			},
		],
	};

	const form = useForm<
		ProductFormSchemaInputType,
		undefined,
		ProductFormSchemaOutputType
	>({
		resolver: zodResolver(ProductFormSchema),
		defaultValues,
	});

	const isLoading = form.formState.isSubmitting;

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "variants",
	});

	const handleSubmit = async (values: ProductFormSchemaOutputType) => {
		try {
			console.log("Submitting product payload", values);
			toast.success("Prodotto creato!", {
				description: "Il prodotto è stato preparato con successo.",
			});
		} catch (error) {
			console.error(error);
			toast.error("Errore", {
				description:
					"Si è verificato un errore durante la creazione del prodotto.",
			});
		}
	};

	// Uso di useMemo per filtrare le sottocategorie in modo efficiente
	const selectedCategory = form.watch("categoryId");
	const filteredSubcategories = useMemo(
		() => subcategories.filter((sub) => sub.categoryId === selectedCategory),
		[subcategories, selectedCategory]
	);

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Nuovo Prodotto</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-8"
						autoComplete="off"
						suppressHydrationWarning>
						{/* Campi del Prodotto Principale */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Dettagli Principali</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nome prodotto</FormLabel>
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
											<FormLabel>Slug</FormLabel>
											<FormControl>
												<Input placeholder="slug-del-prodotto" {...field} />
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
												placeholder="Descrizione dettagliata"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{/* Componente Select per Negozio */}
								<FormField
									control={form.control}
									name="storeId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Negozio</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Seleziona un negozio" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{stores.map((store) => (
														<SelectItem key={store.id} value={store.id}>
															{store.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* Componente Select per Categoria */}
								<FormField
									control={form.control}
									name="categoryId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Categoria</FormLabel>
											<Select
												onValueChange={(value) => {
													field.onChange(value);
													form.setValue("subCategoryId", ""); // Resetta la sottocategoria
												}}
												defaultValue={field.value}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Seleziona una categoria" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{categories.map((c) => (
														<SelectItem key={c.id} value={c.id}>
															{c.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* Componente Select per Sottocategoria */}
								<FormField
									control={form.control}
									name="subCategoryId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Sottocategoria</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
												disabled={!selectedCategory}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Seleziona una sottocategoria" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{filteredSubcategories.map((sub) => (
														<SelectItem key={sub.id} value={sub.id}>
															{sub.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Campi delle Varianti */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Varianti Prodotto</h3>
							{fields.map((field, index) => (
								<div
									key={field.id}
									className="space-y-4 border p-4 rounded-md relative">
									{fields.length > 1 && (
										<Button
											type="button"
											variant="destructive"
											size="icon"
											onClick={() => remove(index)}
											className="absolute top-2 right-2"
											disabled={isLoading}>
											<Trash2 className="h-4 w-4" />
										</Button>
									)}
									<FormField
										control={form.control}
										name={`variants.${index}.name`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Nome variante</FormLabel>
												<FormControl>
													<Input placeholder="Es. Colore Rosso" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name={`variants.${index}.description`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Descrizione variante</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Dettagli specifici della variante"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name={`variants.${index}.slug`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Slug variante</FormLabel>
												<FormControl>
													<Input placeholder="slug-variante" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name={`variants.${index}.sku`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>SKU</FormLabel>
													<FormControl>
														<Input placeholder="SKU" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`variants.${index}.price`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Prezzo</FormLabel>
													<FormControl>
														<Input
															type="number"
															step="0.01"
															placeholder="Prezzo"
															{...field}
															value={field.value}
															onChange={(e) =>
																field.onChange(Number(e.target.value))
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<FormField
										control={form.control}
										name={`variants.${index}.mainImage`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Immagine principale</FormLabel>
												<FormControl>
													<ImageUpload
														type="standard"
														maxImages={1}
														uploadText="Carica immagine principale"
														removeText="Rimuovi"
														value={field.value ? [field.value] : []}
														disabled={isLoading}
														onChange={(url) => field.onChange(url)}
														onRemove={() => field.onChange("")}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								</div>
							))}
							<Button
								type="button"
								variant="outline"
								onClick={() =>
									append({
										name: "",
										description: "",
										slug: "",
										isOnSale: false,
										keywords: "",
										sku: "",
										mainImage: "",
										price: 0,
										sizes: [],
										images: [],
										colors: [],
									})
								}
								disabled={isLoading}>
								Aggiungi Variante
							</Button>
						</div>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Creazione in corso..." : "Crea Prodotto"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
export default ProductDetails;
