"use client";

import { Category, ShippingFeeMethod } from "@prisma/client";
import { ProductFormSchema } from "@/lib/schemas";
import { FC, useMemo } from "react";
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
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface ProductDetailsProps {
	categories: Category[];
}

const ProductDetails: FC<ProductDetailsProps> = ({ categories }) => {

	const defaultValues = useMemo<Partial<z.input<typeof ProductFormSchema>>>(
		() => ({
			name: "",
			description: "",
			variantName: "",
			variantDescription: "",
			images: [],
			variantImage: [],
			brand: "",
			sku: "",
			weight: 0.01,
			categoryId: "",
			subCategoryId: "",
			offerTagId: undefined,
			keywords: [],
			colors: [],
			sizes: [
				{ size: "", quantity: 1, price: 0.01, discount: 0 },
			],
			product_specs: [{ name: "", value: "" }],
			variant_specs: [{ name: "", value: "" }],
			questions: [{ question: "", answer: "" }],
			isSale: false,
			saleEndDate: undefined,
			freeShippingForAllCountries: false,
			freeShippingCountriesIds: [],
			shippingFeeMethod: ShippingFeeMethod.ITEM,
		}),
		[]
	);

	const form = useForm<
		z.input<typeof ProductFormSchema>,
		unknown,
		z.infer<typeof ProductFormSchema>
	>({
		resolver: zodResolver(ProductFormSchema),
		defaultValues,
	});

	const isLoading = form.formState.isSubmitting;

	const handleSubmit = async (values: z.infer<typeof ProductFormSchema>) => {
		try {
			// At this point, values already match ProductFormSchema
			console.log("Submitting product payload", values);
			// TODO: integrate with your API or server action, e.g. /api/products/upsert
			// const res = await fetch("/api/products/upsert", { ... });
			toast.success("Prodotto", {
				description: "Prodotto pronto per la creazione (payload in console).",
			});
			// Optionally navigate to a products page
			// router.push(`/dashboard/seller/products`);
		} catch (error) {
			console.log(error);
			toast.error("Prodotto", {
				description: "Errore durante la preparazione del prodotto.",
			});
		}
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Nuovo prodotto</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-10"
						autoComplete="off"
						suppressHydrationWarning>
						{/* Images */}
						<FormField
							control={form.control}
							name="images"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Immagini prodotto</FormLabel>
									<FormDescription>Fino a 6 immagini.</FormDescription>
									<FormControl>
										<ImageUpload
											type="product"
											maxImages={6}
											uploadText="Carica immagini"
											removeText="Rimuovi"
											value={(field.value ?? []).map((image) => image.url)}
											disabled={isLoading}
											onChange={(url) => field.onChange([...(field.value ?? []), { url }])}
											onRemove={(url) =>
												field.onChange((field.value ?? []).filter((image) => image.url !== url))
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Variant Image */}
						<FormField
							control={form.control}
							name="variantImage"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Immagine variante</FormLabel>
									<FormDescription>Una sola immagine per la variante.</FormDescription>
									<FormControl>
										<ImageUpload
											type="variant"
											maxImages={1}
											uploadText="Carica immagine"
											removeText="Rimuovi"
											value={(field.value ?? []).map((image) => image.url)}
											disabled={isLoading}
											onChange={(url) => field.onChange([{ url }])}
											onRemove={(url) =>
												field.onChange((field.value ?? []).filter((image) => image.url !== url))
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Core info */}
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
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descrizione</FormLabel>
									<FormControl>
										<Textarea placeholder="Descrizione dettagliata" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Variant core */}
						<FormField
							control={form.control}
							name="variantName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome variante</FormLabel>
									<FormControl>
										<Input placeholder="Es. Rosso, 64GB" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="variantDescription"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descrizione variante</FormLabel>
									<FormControl>
										<Textarea placeholder="Dettagli della variante (opzionale)" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Categorization */}
						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Categoria</FormLabel>
									<FormDescription>Seleziona la categoria.</FormDescription>
									<FormControl>
										<select
											className="w-full border rounded h-10 px-3"
											value={field.value || ""}
											onChange={(e) => field.onChange(e.target.value)}
										>
											<option value="">-- seleziona --</option>
											{categories.map((c) => (
												<option key={c.id} value={c.id}>
													{c.name}
												</option>
											))}
										</select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="subCategoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Sottocategoria</FormLabel>
									<FormControl>
										<Input placeholder="ID sottocategoria" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Product details */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<FormField
								control={form.control}
								name="brand"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Marca</FormLabel>
										<FormControl>
											<Input placeholder="Marca" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="sku"
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
								name="weight"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Peso (kg)</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												min="0.01"
												name={field.name}
												onBlur={field.onBlur}
												ref={field.ref}
												value={Number(field.value ?? 0.01)}
												onChange={(e) => field.onChange(Number(e.target.value))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Keyword & Colors (comma-separated helpers) */}
						<FormField
							control={form.control}
							name="keywords"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Parole chiave (separate da virgola)</FormLabel>
									<FormControl>
										<Input
											placeholder="es. smartphone, 5g, android"
											value={(field.value ?? []).join(", ")}
											onChange={(e) =>
												field.onChange(
													e.target.value
														.split(",")
														.map((s) => s.trim())
														.filter(Boolean)
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
							name="colors"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Colori (separati da virgola)</FormLabel>
									<FormControl>
										<Input
											placeholder="es. rosso, blu, nero"
											value={
												((field.value as { color: string }[] | undefined) ?? [])
													.map((c) => c.color)
													.join(", ")
											}
											onChange={(e) => {
												const next = e.target.value
													.split(",")
													.map((s) => s.trim())
													.filter(Boolean)
													.map((color) => ({ color }));
												field.onChange(next);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Sizes - single entry helper */}
						<FormField
							control={form.control}
							name="sizes"
							render={({ field }) => {
								type SizeItem = { size: string; quantity: number; price: number; discount: number };
								const list = (field.value as SizeItem[] | undefined) ?? [];
								const current: SizeItem = list[0] ?? {
									size: "",
									quantity: 1,
									price: 0.01,
									discount: 0,
								};
								return (
									<FormItem>
										<FormLabel>Taglia e Prezzo</FormLabel>
										<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
											<Input
												placeholder="Taglia"
												value={current.size}
												onChange={(e) =>
													field.onChange([{ ...current, size: e.target.value } as SizeItem])
												}
											/>
											<Input
												type="number"
												min={1}
												placeholder="Quantità"
												value={current.quantity}
												onChange={(e) =>
													field.onChange([
														{ ...current, quantity: Number(e.target.value) } as SizeItem,
													])
												}
											/>
											<Input
												type="number"
												step="0.01"
												min={0.01}
												placeholder="Prezzo"
												value={current.price}
												onChange={(e) =>
													field.onChange([
														{ ...current, price: Number(e.target.value) } as SizeItem,
													])
												}
											/>
											<Input
												type="number"
												min={0}
												placeholder="Sconto %"
												value={current.discount}
												onChange={(e) =>
													field.onChange([
														{ ...current, discount: Number(e.target.value) } as SizeItem,
													])
												}
											/>
										</div>
										<FormMessage />
									</FormItem>
								);
							}}
						/>

						{/* Specs & Questions - single entry helpers */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<FormField
								control={form.control}
								name="product_specs"
								render={({ field }) => {
									const cur = (field.value && field.value[0]) || { name: "", value: "" };
									return (
										<FormItem>
											<FormLabel>Specifica prodotto</FormLabel>
											<div className="grid grid-cols-2 gap-2">
												<Input placeholder="Nome" value={cur.name} onChange={(e) => field.onChange([{ ...cur, name: e.target.value }])} />
												<Input placeholder="Valore" value={cur.value} onChange={(e) => field.onChange([{ ...cur, value: e.target.value }])} />
											</div>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
							<FormField
								control={form.control}
								name="variant_specs"
								render={({ field }) => {
									const cur = (field.value && field.value[0]) || { name: "", value: "" };
									return (
										<FormItem>
											<FormLabel>Specifica variante</FormLabel>
											<div className="grid grid-cols-2 gap-2">
												<Input placeholder="Nome" value={cur.name} onChange={(e) => field.onChange([{ ...cur, name: e.target.value }])} />
												<Input placeholder="Valore" value={cur.value} onChange={(e) => field.onChange([{ ...cur, value: e.target.value }])} />
											</div>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
							<FormField
								control={form.control}
								name="questions"
								render={({ field }) => {
									const cur = (field.value && field.value[0]) || { question: "", answer: "" };
									return (
										<FormItem>
											<FormLabel>FAQ</FormLabel>
											<div className="grid grid-cols-2 gap-2">
												<Input placeholder="Domanda" value={cur.question} onChange={(e) => field.onChange([{ ...cur, question: e.target.value }])} />
												<Input placeholder="Risposta" value={cur.answer} onChange={(e) => field.onChange([{ ...cur, answer: e.target.value }])} />
											</div>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
						</div>

						{/* Shipping & Offers */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<FormField
								control={form.control}
								name="shippingFeeMethod"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Metodo spedizione</FormLabel>
										<FormControl>
											<select
												className="w-full border rounded h-10 px-3"
												value={field.value}
												onChange={(e) => field.onChange(e.target.value)}
											>
												<option value="ITEM">Per articolo</option>
												<option value="WEIGHT">Per peso</option>
												<option value="FIXED">Fisso</option>
											</select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="offerTagId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Offer tag (opzionale)</FormLabel>
										<FormControl>
											<Input placeholder="ID tag offerta" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="isSale"
								render={({ field }) => (
									<FormItem className="flex items-center gap-2">
										<FormLabel>In promozione</FormLabel>
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={(checked) => field.onChange(checked === true)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="saleEndDate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Fine promozione (opzionale)</FormLabel>
									<FormControl>
										<Input type="date" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="freeShippingForAllCountries"
							render={({ field }) => (
								<FormItem className="flex items-center gap-2">
									<FormLabel>Spedizione gratuita globale</FormLabel>
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={(checked) => field.onChange(checked === true)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Salvataggio..." : "Crea prodotto"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default ProductDetails;
