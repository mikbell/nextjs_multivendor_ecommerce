"use client";

// React, Next.js
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Prisma model
import { category, country, offertag, subcategory } from "@prisma/client";
import { product_shippingFeeMethod } from "@prisma/client";

// Form handling utilities
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
import { ProductFormSchema } from "@/lib/schemas";

// UI Components
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/dashboard/shared/image-upload";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MultiSelect } from "react-multi-select-component";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Queries
import { upsertProduct } from "@/queries/product";
import { getAllCategoriesForCategory } from "@/queries/category";

// ReactTags
import {
	WithOutContext as ReactTags,
	type Tag as ReactTag,
} from "react-tag-input";

// Utils
import { v4 } from "uuid";

// Types
import { ProductWithVariantType } from "@/lib/types";
import ImagesPreviewGrid from "@/components/dashboard/shared/images-preview-grid";
import ClickToAddInputs from "./click-to-add";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// React date time picker
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { format } from "date-fns";

// Textarea for now instead of RichTextEditor
import { NumberInput } from "@tremor/react";
import InputFieldset from "@/components/shared/input-fieldset";
import { ArrowRight, Dot, ChevronDown, ChevronRight, Info, CheckCircle } from "lucide-react";

const shippingFeeMethods = [
	{
		value: product_shippingFeeMethod.ITEM,
		description: "PER ARTICOLO - Spese calcolate in base al numero di prodotti",
	},
	{
		value: product_shippingFeeMethod.WEIGHT,
		description: "PER PESO - Spese calcolate in base al peso del prodotto",
	},
	{
		value: product_shippingFeeMethod.FIXED,
		description: "FISSO - Spese di spedizione fisse",
	},
];

interface ProductDetailsProps {
	data?: Partial<ProductWithVariantType>;
	categories: category[];
	subcategories: subcategory[];
	offerTags: offertag[];
	storeUrl: string;
	countries: country[];
}

const ProductDetails: FC<ProductDetailsProps> = ({
	data,
	categories,
	offerTags,
	storeUrl,
	countries,
}) => {
	// Initializing necessary hooks
	const router = useRouter(); // Hook for routing

	// Is new variant page - only if we have BOTH productId and name (existing product) but no variantId
	const isNewVariantPage = data?.productId && data?.name && !data?.variantId;
	
	// Debug: Force show all fields for debugging
	const debugForceShowAllFields = true;
	
	// Debug: log the values
	console.log("Debug - Form render:", {
		isNewVariantPage,
		data: data ? { productId: data.productId, variantId: data.variantId, name: data.name } : 'No data'
	});
	
	// Alert for debugging
	alert(`isNewVariantPage: ${isNewVariantPage}, debugForceShowAllFields: ${debugForceShowAllFields}`);
	
	// Debug: Log current form values
	useEffect(() => {
		const currentValues = form.getValues();
		console.log("Debug - Current form values:", {
			name: currentValues.name,
			variantName: currentValues.variantName,
			brand: currentValues.brand,
			description: currentValues.description
		});
	}, []);

	// State for subCategories
	const [subCategories, setSubCategories] = useState<subcategory[]>([]);

	// State for collapsible sections
	const [openSections, setOpenSections] = useState({
		basic: true,
		images: true,
		pricing: false,
		specifications: false,
		shipping: false,
		advanced: false,
	});

	// State for colors
	const [colors, setColors] = useState<{ color: string }[]>(
		data?.colors || [{ color: "" }]
	);

	// Temporary state for images
	const [images, setImages] = useState<{ url: string }[]>([]);

	// State for sizes
	const [sizes, setSizes] = useState<
		{ size: string; price: number; quantity: number; discount: number }[]
	>(data?.sizes || [{ size: "", quantity: 1, price: 0.01, discount: 0 }]);

	// State for product specs
	const [productSpecs, setProductSpecs] = useState<
		{ name: string; value: string }[]
	>(data?.product_specs || [{ name: "", value: "" }]);

	// State for product variant specs
	const [variantSpecs, setVariantSpecs] = useState<
		{ name: string; value: string }[]
	>(data?.variant_specs || [{ name: "", value: "" }]);

	// State for product variant specs
	const [questions, setQuestions] = useState<
		{ question: string; answer: string }[]
	>(data?.questions || [{ question: "", answer: "" }]);

	// Form hook for managing form state and validation
	const form = useForm<
		z.input<typeof ProductFormSchema>,
		unknown,
		z.infer<typeof ProductFormSchema>
	>({
		mode: "onChange", // Form validation mode
		resolver: zodResolver(ProductFormSchema),
		defaultValues: {
			// Setting default form values from data (if available)
			name: data?.name || "",
			description: data?.description || "",
			variantName: data?.variantName || "",
			variantDescription: data?.variantDescription || "",
			images: data?.images || [],
			variantImage: data?.variantImage ? [{ url: data.variantImage }] : [],
			categoryId: data?.categoryId || "",
			offerTagId: data?.offerTagId || "",
			subCategoryId: data?.subCategoryId || "",
			brand: data?.brand || "",
			sku: data?.sku || "",
			colors: data?.colors || [{ color: "" }],
			sizes: data?.sizes ? (data.sizes || []).map((s) => ({
				size: s.size,
				quantity: s.quantity,
				price: s.price,
				discount: (s as { discount?: number }).discount ?? 0,
			})) : [{ size: "", quantity: 1, price: 0.01, discount: 0 }],
			product_specs: data?.product_specs || [{ name: "", value: "" }],
			variant_specs: data?.variant_specs || [{ name: "", value: "" }],
			keywords: data?.keywords || [],
			questions: data?.questions || [],
			isSale: data?.isSale || false,
			weight: data?.weight || 0.01,
			saleEndDate:
				data?.saleEndDate || format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
			freeShippingForAllCountries: data?.freeShippingForAllCountries || false,
			freeShippingCountriesIds: data?.freeShippingCountriesIds || [],
			shippingFeeMethod: data?.shippingFeeMethod || "ITEM",
		},
	});

	// Calcola il progresso del form
	const calculateFormProgress = () => {
		const values = form.getValues();
		let completedFields = 0;
		const totalFields = 12; // numero totale di campi obbligatori

		if (values.name?.length > 0) completedFields++;
		if (values.variantName?.length > 0) completedFields++;
		if (values.description?.length >= 20) completedFields++;
		if (values.images?.length >= 3) completedFields++;
		if (values.categoryId) completedFields++;
		if (values.subCategoryId) completedFields++;
		if (values.brand?.length > 0) completedFields++;
		if (values.sku?.length >= 6) completedFields++;
		if (values.weight && values.weight > 0) completedFields++;
		if (values.colors?.length > 0 && values.colors.every(c => c.color.length > 0)) completedFields++;
		if (values.sizes?.length > 0 && values.sizes.every(s => s.size && s.price > 0 && s.quantity > 0)) completedFields++;
		if (values.keywords?.length >= 5) completedFields++;

		return Math.round((completedFields / totalFields) * 100);
	};

	const formProgress = calculateFormProgress();
	console.log("errors", form.formState.errors);
	console.log("form progress", formProgress);

	const saleEndDate = form.getValues().saleEndDate || new Date().toISOString();

	const formattedDate = new Date(saleEndDate).toLocaleString("en-Us", {
		weekday: "short", // Abbreviated day name (e.g., "Mon")
		month: "long", // Abbreviated month name (e.g., "Nov")
		day: "2-digit", // Two-digit day (e.g., "25")
		year: "numeric", // Full year (e.g., "2024")
		hour: "2-digit", // Two-digit hour (e.g., "02")
		minute: "2-digit", // Two-digit minute (e.g., "30")
		second: "2-digit", // Two-digit second (optional)
		hour12: false, // 12-hour format (change to false for 24-hour format)
	});

	// UseEffect to get subCategories when user pick/change a category
	const watchedCategoryId = form.watch().categoryId;
	useEffect(() => {
		const getSubCategories = async () => {
			const res = await getAllCategoriesForCategory(watchedCategoryId);
			setSubCategories(res);
		};
		getSubCategories();
	}, [watchedCategoryId]);

	// Extract errors state from form
	const errors = form.formState.errors;

	// Loading status based on form submission
	const isLoading = form.formState.isSubmitting;

	// Reset form values when data changes (only for existing products)
	useEffect(() => {
		if (data && data.productId && data.name) {
			// Only reset if we're editing an existing product
			form.reset({
				...data,
				variantImage: data.variantImage ? [{ url: data.variantImage }] : [],
			});
		}
	}, [data, form]);

	// Submit handled inline in the form element below to avoid generic mismatches

	// Handle keywords input
	const [keywords, setKeywords] = useState<string[]>(data?.keywords || []);

	const handleAddition = (keyword: ReactTag) => {
		if (keywords.length === 10) return;
		if (!keyword.text) return;
		setKeywords([...keywords, keyword.text]);
	};

	const handleDeleteKeyword = (i: number) => {
		setKeywords(keywords.filter((_, index) => index !== i));
	};

	// Helper functions for quality checks
	const getQualityChecks = () => {
		const values = form.getValues();
		const checks = {
			hasGoodTitle: values.name && values.name.length >= 5,
			hasDetailedDescription: values.description && values.description.length >= 50,
			hasEnoughImages: values.images && values.images.length >= 3,
			hasCompetitivePrice: values.sizes?.some(s => s.price > 0 && s.price < 1000),
			hasStock: values.sizes?.some(s => s.quantity > 0),
			hasGoodKeywords: values.keywords && values.keywords.length >= 5,
			hasBrand: values.brand && values.brand.length > 0,
			hasValidWeight: values.weight && values.weight > 0 && values.weight < 50,
		};
		const passedChecks = Object.values(checks).filter(Boolean).length;
		const totalChecks = Object.keys(checks).length;
		return { checks, passedChecks, totalChecks, score: Math.round((passedChecks / totalChecks) * 100) };
	};

	// Watch form values for real-time validation
	const watchedValues = form.watch();
	const qualityChecks = getQualityChecks();

	// Whenever colors, sizes, keywords changes we update the form values
	useEffect(() => {
		form.setValue("colors", colors as unknown as never);
		form.setValue("sizes", sizes as unknown as never);
		form.setValue("keywords", keywords as unknown as never);
		form.setValue("product_specs", productSpecs as unknown as never);
		form.setValue("variant_specs", variantSpecs as unknown as never);
		form.setValue("questions", questions as unknown as never);
	}, [
		colors,
		sizes,
		keywords,
		productSpecs,
		questions,
		variantSpecs,
		data,
		form,
	]);

	//Countries options
	type CountryOption = {
		label: string;
		value: string;
	};

	const countryOptions: CountryOption[] = countries.map((c) => ({
		label: c.name,
		value: c.id,
	}));

	const handleDeleteCountryFreeShipping = (index: number) => {
		const currentValues = form.getValues().freeShippingCountriesIds || [];
		const updatedValues = currentValues.filter((_, i) => i !== index);
		form.setValue("freeShippingCountriesIds", updatedValues);
	};

	return (
		<AlertDialog>
			<Card className="w-full">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						{isNewVariantPage
							? `Aggiungi nuova variante a ${data?.name}`
							: data?.productId && data.variantId ? "Aggiorna Prodotto" : "Crea Nuovo Prodotto"}
						{formProgress === 100 && <CheckCircle className="h-5 w-5 text-green-500" />}
					</CardTitle>
					<CardDescription>
						{data?.productId && data.variantId
							? `Aggiorna le informazioni del prodotto ${data?.name}.`
							: "Compila tutti i campi per creare il tuo prodotto. Potrai modificarlo in seguito."}
					</CardDescription>
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Progresso completamento</span>
							<Badge variant={formProgress === 100 ? "default" : "secondary"}>
								{formProgress}%
							</Badge>
						</div>
						<Progress value={formProgress} className="h-2" />
					</div>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(
								async (values) => {
									console.log("Debug - Form submission started");
									console.log("Debug - Form values before submit:", JSON.stringify(values, null, 2));
									console.log("Debug - Form validation state:", form.formState);
									
									// Alert per debug
									alert(`Debug values:\nname: ${values.name}\nvariantName: ${values.variantName}\nbrand: ${values.brand}\ndescription: ${values.description}`);
									
									try {
									await upsertProduct(
										{
											productId: data?.productId ? data.productId : v4(),
											variantId: data?.variantId ? data.variantId : v4(),
											name: values.name,
											description: values.description,
											variantName: values.variantName,
											variantDescription: values.variantDescription || "",
											images: values.images,
											variantImage: values.variantImage?.[0]?.url || "",
											categoryId: values.categoryId,
											subCategoryId: values.subCategoryId,
											offerTagId: values.offerTagId || "",
											isSale: values.isSale,
											saleEndDate: values.saleEndDate,
											brand: values.brand,
											sku: values.sku,
											weight: values.weight,
											colors: values.colors,
											sizes: values.sizes,
											product_specs: values.product_specs,
											variant_specs: values.variant_specs,
											keywords: values.keywords,
											questions: values.questions,
											shippingFeeMethod: values.shippingFeeMethod,
											freeShippingForAllCountries:
												values.freeShippingForAllCountries,
											freeShippingCountriesIds:
												values.freeShippingCountriesIds || [],
											createdAt: new Date(),
											updatedAt: new Date(),
										},
										storeUrl
									);

								toast.success(
									data?.productId && data?.variantId
										? "Prodotto aggiornato con successo! \ud83c\udf89"
										: "Congratulazioni! Il prodotto \u00e8 stato creato con successo! \ud83c\udf89",
									{
										description: "Il tuo prodotto \u00e8 ora disponibile nel tuo negozio.",
										duration: 5000,
									}
								);

									if (data?.productId && data?.variantId) {
										router.refresh();
									} else {
										router.push(
											`/dashboard/seller/stores/${storeUrl}/products`
											);
									}
								} catch (error: unknown) {
									console.log(error);
									toast.error(
										error instanceof Error ? error.message : String(error)
									);
								}
							},
							(errors) => {
								console.log("Debug - Form validation errors:", errors);
								toast.error("Si sono verificati errori nella validazione del form. Controlla i campi richiesti.");
							}
						)
						}
						className="space-y-4">
							{/* Images - colors */}
							<div className="flex flex-col gap-y-6 xl:flex-row">
								{/* Images */}
								<FormField
									control={form.control}
									name="images"
									render={({ field }) => (
										<FormItem className="w-full xl:border-r">
											<FormControl>
												<div>
													<ImagesPreviewGrid
														images={form.getValues().images}
														onRemove={(url) => {
															const updatedImages = images.filter(
																(img) => img.url !== url
															);
															setImages(updatedImages);
															field.onChange(updatedImages);
														}}
														colors={colors}
														setColors={setColors}
													/>
													<FormMessage className="!mt-4" />
													<ImageUpload
														dontShowPreview
														type="standard"
														value={field.value.map((image) => image.url)}
														disabled={isLoading}
														onChange={(url) => {
															const urlString = Array.isArray(url)
																? url[0]
																: url;
															if (urlString) {
																setImages((prevImages) => {
																	const updatedImages = [
																		...prevImages,
																		{ url: urlString },
																	];
																	field.onChange(updatedImages);
																	return updatedImages;
																});
															}
														}}
														onRemove={(url) =>
															field.onChange([
																...field.value.filter(
																	(current) => current.url !== url
																),
															])
														}
													/>
												</div>
											</FormControl>
										</FormItem>
									)}
								/>
								{/* Colors */}
								<div className="w-full flex flex-col gap-y-3 xl:pl-5">
									<ClickToAddInputs
										details={data?.colors || colors}
										setDetails={setColors}
										initialDetail={{ color: "" }}
										header="Colors"
										colorPicker
									/>
									{errors.colors && (
										<span className="text-sm font-medium text-destructive">
											{errors.colors.message}
										</span>
									)}
								</div>
							</div>
							{/* Name */}
							<InputFieldset label="Name">
								<div className="flex flex-col lg:flex-row gap-4">
									<FormField
											disabled={isLoading}
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem className="flex-1">
													<FormControl>
													<Input placeholder="es. Maglietta Basic Cotton" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
										)}
									/>
									<FormField
										disabled={isLoading}
										control={form.control}
										name="variantName"
										render={({ field }) => (
											<FormItem className="flex-1">
												<FormControl>
													<Input placeholder="es. Rosso - Taglia M" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</InputFieldset>
							{/* Product and variant description editors (tabs) */}
							<InputFieldset
								label="Description"
								description={
									isNewVariantPage
										? ""
										: "Note: The product description is the main description for the product (Will display in every variant page). You can add an extra description specific to this variant using 'Variant description' tab."
								}>
								<Tabs
									defaultValue={isNewVariantPage ? "variant" : "product"}
									className="w-full">
									{(!isNewVariantPage || debugForceShowAllFields) && (
										<TabsList className="w-full grid grid-cols-2">
											<TabsTrigger value="product">
												Product description
											</TabsTrigger>
											<TabsTrigger value="variant">
												Variant description
											</TabsTrigger>
										</TabsList>
									)}
									<TabsContent value="product">
										<FormField
											disabled={isLoading}
											control={form.control}
											name="description"
											render={({ field }) => (
												<FormItem className="flex-1">
													<FormControl>
													<textarea
														value={field.value || ""}
														onChange={(e) => field.onChange(e.target.value)}
														placeholder="Descrivi il tuo prodotto in modo dettagliato: materiali, caratteristiche, utilizzo..."
														disabled={isLoading}
														rows={10}
														className="w-full p-3 border border-input rounded-md"
													/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</TabsContent>
									<TabsContent value="variant">
										<FormField
											disabled={isLoading}
											control={form.control}
											name="variantDescription"
											render={({ field }) => (
												<FormItem className="flex-1">
													<FormControl>
														<textarea
															value={field.value || ""}
															onChange={(e) => field.onChange(e.target.value)}
															placeholder="Aggiungi dettagli specifici per questa variante (opzionale)..."
															disabled={isLoading}
															rows={10}
															className="w-full p-3 border border-input rounded-md"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</TabsContent>
								</Tabs>
							</InputFieldset>
							{/* Category - SubCategory - offer*/}
							<div>
								<InputFieldset label="Category">
									<div className="flex gap-4">
										<FormField
											disabled={isLoading}
											control={form.control}
											name="categoryId"
											render={({ field }) => (
												<FormItem className="flex-1">
													<Select
														disabled={isLoading || categories.length == 0}
														onValueChange={field.onChange}
														value={field.value}
														defaultValue={field.value}>
														<FormControl>
															<SelectTrigger>
																<SelectValue
																	defaultValue={field.value}
																	placeholder="Seleziona una categoria"
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{categories.map((category) => (
																<SelectItem
																	key={category.id}
																	value={category.id}>
																	{category.name}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											disabled={isLoading}
											control={form.control}
											name="subCategoryId"
											render={({ field }) => (
												<FormItem className="flex-1">
													<Select
														disabled={
															isLoading ||
															categories.length == 0 ||
															!form.getValues().categoryId
														}
														onValueChange={field.onChange}
														value={field.value}
														defaultValue={field.value}>
														<FormControl>
															<SelectTrigger>
																<SelectValue
																	defaultValue={field.value}
																	placeholder="Seleziona una sottocategoria"
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{subCategories.map((sub) => (
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
										{/* Offer Tag */}
										<FormField
											disabled={isLoading}
											control={form.control}
											name="offerTagId"
											render={({ field }) => (
												<FormItem className="flex-1">
													<Select
														disabled={isLoading || categories.length == 0}
														onValueChange={field.onChange}
														value={field.value}
														defaultValue={field.value}>
														<FormControl>
															<SelectTrigger>
																<SelectValue
																	defaultValue={field.value}
																	placeholder="Seleziona un'offerta (opzionale)"
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{offerTags &&
																offerTags.map((offer) => (
																	<SelectItem key={offer.id} value={offer.id}>
																		{offer.name}
																	</SelectItem>
																))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</InputFieldset>
							</div>
							{/* Brand, Sku, Weight */}
							<InputFieldset
								label={isNewVariantPage ? "SKU e Peso" : "Marca, SKU e Peso"}>
								<FormDescription className="text-sm text-muted-foreground mb-4">
									<Info className="inline h-4 w-4 mr-1" />
									Informazioni tecniche del prodotto. Lo SKU deve essere unico.
								</FormDescription>
								<div className="flex flex-col lg:flex-row gap-4">
										<FormField
											disabled={isLoading}
											control={form.control}
											name="brand"
											render={({ field }) => (
												<FormItem className="flex-1">
													<FormControl>
													<Input placeholder="es. Nike, Adidas, Zara" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
										)}
									/>
									<FormField
										disabled={isLoading}
										control={form.control}
										name="sku"
										render={({ field }) => (
											<FormItem className="flex-1">
												<FormControl>
													<Input placeholder="es. MAG-001-RED-M" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										disabled={isLoading}
										control={form.control}
										name="weight"
										render={({ field }) => (
											<FormItem className="flex-1">
												<FormControl>
													<NumberInput
														defaultValue={field.value}
														onValueChange={field.onChange}
														placeholder="Peso in kg (es. 0.5)"
														min={0.01}
														step={0.01}
														className="!shadow-none rounded-md !text-sm"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</InputFieldset>
							{/* Variant image - Keywords*/}
							<div className="flex items-center gap-10 py-14">
								{/* Variant image */}
								<div className="border-r pr-10">
									<FormField
										control={form.control}
										name="variantImage"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="ml-14">Immagine Variante</FormLabel>
												<FormDescription className="text-xs text-muted-foreground mb-2">
													Immagine principale di questa variante specifica
												</FormDescription>
												<FormControl>
													<ImageUpload
														dontShowPreview
														type="profile"
														value={field.value.map((image) => image.url)}
														disabled={isLoading}
														onChange={(url) => {
															const urlString = Array.isArray(url)
																? url[0]
																: url;
															if (urlString) {
																field.onChange([{ url: urlString }]);
															}
														}}
														onRemove={(url) =>
															field.onChange([
																...field.value.filter(
																	(current) => current.url !== url
																),
															])
														}
													/>
												</FormControl>
												<FormMessage className="!mt-4" />
											</FormItem>
										)}
									/>
								</div>
								{/* Keywords */}
								<div className="w-full flex-1 space-y-3">
									<FormField
										control={form.control}
										name="keywords"
										render={() => (
											<FormItem className="relative flex-1">
												<FormLabel>Parole Chiave Prodotto</FormLabel>
												<FormDescription className="text-xs text-muted-foreground mb-2">
													Aggiungi 5-10 parole chiave per migliorare la ricerca. Premi Invio per aggiungere.
												</FormDescription>
												<FormControl>
													<ReactTags
														handleAddition={handleAddition}
														handleDelete={() => {}}
														placeholder="es. maglietta, cotone, casual, estate"
														classNames={{
															tagInputField:
																"bg-background border rounded-md p-2 w-full focus:outline-none",
														}}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
									<div className="flex flex-wrap gap-1">
										{keywords.map((k, i) => (
											<div
												key={i}
												className="text-xs inline-flex items-center px-3 py-1 bg-blue-200 text-blue-700 rounded-full gap-x-2">
												<span>{k}</span>
												<span
													className="cursor-pointer"
													onClick={() => handleDeleteKeyword(i)}>
													x
												</span>
											</div>
										))}
									</div>
								</div>
							</div>
							{/* Sizes*/}
							<InputFieldset label="Taglie, Quantità, Prezzi e Sconti">
								<FormDescription className="text-sm text-muted-foreground mb-4">
									<Info className="inline h-4 w-4 mr-1" />
									Specifica le varianti di taglia disponibili con prezzi e quantità. Lo sconto è opzionale.
								</FormDescription>
								<div className="w-full flex flex-col gap-y-3">
									<ClickToAddInputs
										details={sizes}
										setDetails={setSizes}
										initialDetail={{
											size: "",
											quantity: 1,
											price: 0.01,
											discount: 0,
										}}
										containerClassName="flex-1"
										inputClassName="w-full"
									/>
									{errors.sizes && (
										<span className="text-sm font-medium text-destructive">
											{errors.sizes.message}
										</span>
									)}
								</div>
							</InputFieldset>
							{/* Product and variant specs*/}
							<InputFieldset
								label="Specifications"
								description={
									isNewVariantPage
										? ""
										: "Note: The product specifications are the main specs for the product (Will display in every variant page). You can add extra specs specific to this variant using 'Variant Specifications' tab."
								}>
								<Tabs
									defaultValue={
										isNewVariantPage ? "variantSpecs" : "productSpecs"
									}
									className="w-full">
									{(!isNewVariantPage || debugForceShowAllFields) && (
										<TabsList className="w-full grid grid-cols-2">
											<TabsTrigger value="productSpecs">
												Product Specifications
											</TabsTrigger>
											<TabsTrigger value="variantSpecs">
												Variant Specifications
											</TabsTrigger>
										</TabsList>
									)}
									<TabsContent value="productSpecs">
										<div className="w-full flex flex-col gap-y-3">
											<ClickToAddInputs
												details={productSpecs}
												setDetails={setProductSpecs}
												initialDetail={{
													name: "",
													value: "",
												}}
												containerClassName="flex-1"
												inputClassName="w-full"
											/>
											{errors.product_specs && (
												<span className="text-sm font-medium text-destructive">
													{errors.product_specs.message}
												</span>
											)}
										</div>
									</TabsContent>
									<TabsContent value="variantSpecs">
										<div className="w-full flex flex-col gap-y-3">
											<ClickToAddInputs
												details={variantSpecs}
												setDetails={setVariantSpecs}
												initialDetail={{
													name: "",
													value: "",
												}}
												containerClassName="flex-1"
												inputClassName="w-full"
											/>
											{errors.variant_specs && (
												<span className="text-sm font-medium text-destructive">
													{errors.variant_specs.message}
												</span>
											)}
										</div>
									</TabsContent>
								</Tabs>
							</InputFieldset>
							{/* Questions*/}
							{(!isNewVariantPage || debugForceShowAllFields) && (
								<InputFieldset label="Questions & Answers">
									<div className="w-full flex flex-col gap-y-3">
										<ClickToAddInputs
											details={questions}
											setDetails={setQuestions}
											initialDetail={{
												question: "",
												answer: "",
											}}
											containerClassName="flex-1"
											inputClassName="w-full"
										/>
										{errors.questions && (
											<span className="text-sm font-medium text-destructive">
												{errors.questions.message}
											</span>
										)}
									</div>
								</InputFieldset>
							)}
							{/* Is On Sale */}
							<InputFieldset
								label="Sale"
								description="Is your product on sale ?">
								<div>
									<label
										htmlFor="yes"
										className="ml-5 flex items-center gap-x-2 cursor-pointer">
										<FormField
											control={form.control}
											name="isSale"
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<div>
															<input
																type="checkbox"
																id="yes"
																checked={field.value}
																onChange={field.onChange}
																hidden
															/>
															<Checkbox
																checked={field.value}
																onCheckedChange={field.onChange}
															/>
														</div>
													</FormControl>
												</FormItem>
											)}
										/>
										<span>Yes</span>
									</label>
									{form.getValues().isSale && (
										<div className="mt-5">
											<p className="text-sm text-main-secondary dark:text-gray-400 pb-3 flex">
												<Dot className="-me-1" />
												When sale does end ?
											</p>
											<div className="flex items-center gap-x-5">
												<FormField
													control={form.control}
													name="saleEndDate"
													render={({ field }) => (
														<FormItem className="ml-4">
															<FormControl>
																<DateTimePicker
																	className="inline-flex items-center gap-2 p-2 border rounded-md shadow-sm"
																	calendarIcon={
																		<span className="text-gray-500 hover:text-gray-600">
																			📅
																		</span>
																	}
																	clearIcon={
																		<span className="text-gray-500 hover:text-gray-600">
																			✖️
																		</span>
																	}
																	onChange={(date) => {
																		field.onChange(
																			date
																				? format(date, "yyyy-MM-dd'T'HH:mm:ss")
																				: ""
																		);
																	}}
																	value={
																		field.value ? new Date(field.value) : null
																	}
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<ArrowRight className="w-4 text-[#1087ff]" />
												<span>{formattedDate}</span>
											</div>
										</div>
									)}
								</div>
							</InputFieldset>
							{/* Shipping fee method */}
							{!isNewVariantPage && (
								<InputFieldset label="Product shipping fee method">
									<FormField
										disabled={isLoading}
										control={form.control}
										name="shippingFeeMethod"
										render={({ field }) => (
											<FormItem className="flex-1">
												<Select
													disabled={isLoading}
													onValueChange={field.onChange}
													value={field.value}
													defaultValue={field.value}>
													<FormControl>
														<SelectTrigger>
															<SelectValue
																defaultValue={field.value}
									placeholder="Seleziona metodo calcolo spedizione"
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{shippingFeeMethods.map((method) => (
															<SelectItem
																key={method.value}
																value={method.value}>
																{method.description}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</InputFieldset>
							)}
							{/* Fee Shipping */}
							{!isNewVariantPage && (
								<InputFieldset
									label="Spedizione Gratuita (Opzionale)"
									description="Offri spedizione gratuita mondiale?">
									<div>
										<label
											htmlFor="freeShippingForAll"
											className="ml-5 flex items-center gap-x-2 cursor-pointer">
											<FormField
												control={form.control}
												name="freeShippingForAllCountries"
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<div>
																<input
																	type="checkbox"
																	id="freeShippingForAll"
																	checked={field.value}
																	onChange={field.onChange}
																	hidden
																/>
																<Checkbox
																	checked={field.value}
																	onCheckedChange={field.onChange}
																/>
															</div>
														</FormControl>
													</FormItem>
												)}
											/>
											<span>Sì</span>
										</label>
									</div>
									<div>
										<p className="mt-4 text-sm text-main-secondary dark:text-gray-400 pb-3 flex">
											<Dot className="-me-1" />
											Altrimenti seleziona i paesi per cui offrire spedizione
											gratuita per questo prodotto
										</p>
									</div>
									<div className="">
										{!form.getValues().freeShippingForAllCountries && (
											<div>
												<FormField
													control={form.control}
													name="freeShippingCountriesIds"
													render={({ field }) => (
														<FormItem>
															<FormControl>
																<MultiSelect
																	className="!max-w-[800px]"
																	options={countryOptions} // Array of options, each with `label` and `value`
																	value={field.value || []} // Pass the array of objects directly
																	onChange={(selected: CountryOption[]) => {
																		field.onChange(selected);
																	}}
																	labelledBy="Select"
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<p className="mt-4 text-sm text-main-secondary dark:text-gray-400 pb-3 flex">
													<Dot className="-me-1" />
													Paesi con spedizione gratuita per questo
													prodotto:&nbsp;
													{form.getValues().freeShippingCountriesIds &&
														form.getValues().freeShippingCountriesIds
															?.length === 0 &&
														"None"}
												</p>
												{/* Free shipping counties */}
												<div className="flex flex-wrap gap-1">
													{form
														.getValues()
														.freeShippingCountriesIds?.map((country, index) => (
															<div
																key={country?.value || index}
																className="text-xs inline-flex items-center px-3 py-1 bg-blue-200 text-blue-primary rounded-md gap-x-2">
																<span>{country?.label || "Unknown"}</span>
																<span
																	className="cursor-pointer hover:text-red-500"
																	onClick={() =>
																		handleDeleteCountryFreeShipping(index)
																	}>
																	x
																</span>
															</div>
														))}
												</div>
											</div>
										)}
									</div>
								</InputFieldset>
							)}
							
							{/* Pannello Controllo Qualità */}
							<Collapsible>
								<CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
									<ChevronRight className="h-4 w-4 transition-transform data-[state=open]:rotate-90" />
									Controllo Qualità Prodotto
									<Badge variant={qualityChecks.score >= 80 ? "default" : qualityChecks.score >= 60 ? "secondary" : "destructive"}>
										{qualityChecks.score}%
									</Badge>
								</CollapsibleTrigger>
								<CollapsibleContent className="mt-4 space-y-2">
									<div className="grid grid-cols-2 gap-2 text-sm">
										<div className={`flex items-center gap-2 ${qualityChecks.checks.hasGoodTitle ? 'text-green-600' : 'text-amber-600'}`}>
											{qualityChecks.checks.hasGoodTitle ? '✅' : '⚠️'} Titolo descrittivo (min. 5 caratteri)
										</div>
										<div className={`flex items-center gap-2 ${qualityChecks.checks.hasDetailedDescription ? 'text-green-600' : 'text-amber-600'}`}>
											{qualityChecks.checks.hasDetailedDescription ? '✅' : '⚠️'} Descrizione dettagliata (min. 50 caratteri)
										</div>
										<div className={`flex items-center gap-2 ${qualityChecks.checks.hasEnoughImages ? 'text-green-600' : 'text-amber-600'}`}>
											{qualityChecks.checks.hasEnoughImages ? '✅' : '⚠️'} Immagini sufficienti (min. 3)
										</div>
										<div className={`flex items-center gap-2 ${qualityChecks.checks.hasCompetitivePrice ? 'text-green-600' : 'text-amber-600'}`}>
											{qualityChecks.checks.hasCompetitivePrice ? '✅' : '⚠️'} Prezzo competitivo
										</div>
										<div className={`flex items-center gap-2 ${qualityChecks.checks.hasStock ? 'text-green-600' : 'text-amber-600'}`}>
											{qualityChecks.checks.hasStock ? '✅' : '⚠️'} Scorte disponibili
										</div>
										<div className={`flex items-center gap-2 ${qualityChecks.checks.hasGoodKeywords ? 'text-green-600' : 'text-amber-600'}`}>
											{qualityChecks.checks.hasGoodKeywords ? '✅' : '⚠️'} Keywords ottimizzate (min. 5)
										</div>
										<div className={`flex items-center gap-2 ${qualityChecks.checks.hasBrand ? 'text-green-600' : 'text-amber-600'}`}>
											{qualityChecks.checks.hasBrand ? '✅' : '⚠️'} Marca specificata
										</div>
										<div className={`flex items-center gap-2 ${qualityChecks.checks.hasValidWeight ? 'text-green-600' : 'text-amber-600'}`}>
											{qualityChecks.checks.hasValidWeight ? '✅' : '⚠️'} Peso realistico
										</div>
									</div>
									{qualityChecks.score < 80 && (
										<div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md">
											<p className="text-sm text-amber-700 dark:text-amber-300">
												💡 Suggerimento: Migliora gli elementi contrassegnati per aumentare la visibilità del tuo prodotto!
											</p>
										</div>
									)}
								</CollapsibleContent>
							</Collapsible>

							<Button 
								type="submit" 
								disabled={isLoading || formProgress < 90}
								size="lg"
								className="w-full"
							>
								{isLoading ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
										Salvataggio...
									</>
								) : formProgress < 90 ? (
									`Completa il form (${formProgress}%)`
								) : (
									data?.productId && data.variantId
										? "💾 Salva Modifiche Prodotto"
										: "🚀 Crea Prodotto"
								)}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</AlertDialog>
	);
};

export default ProductDetails;
