"use client";

import { FileText } from "lucide-react";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	SimpleSelect,
	SimpleSelectOption,
} from "@/components/ui/simple-select";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { TipsDropdown } from "@/components/ui/TipsDropdown";
import { ProductBasicInfoProps } from "../types";

export const ProductBasicInfo = ({
	form,
	isLoading,
	isNewVariantPage,
	categories,
	subCategories,
}: ProductBasicInfoProps) => {
	if (isNewVariantPage) {
		return null; // For new variant page, basic info is inherited from parent product
	}

	return (
		<Card className="shadow-sm hover:shadow-md transition-shadow">
			<CardHeader>
				<div className="flex items-center gap-3">
					<div className="p-2 bg-primary rounded-lg">
						<FileText className="h-5 w-5 text-primary-foreground" />
					</div>
					<div>
						<CardTitle className="text-xl">Informazioni di Base</CardTitle>
						<CardDescription>
							Nome, descrizione e categorizzazione del prodotto
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				<TipsDropdown
					title="💡 Consigli per le Informazioni di Base"
					tips={[
						"Usa nomi prodotto descrittivi e specifici (es. 'Maglietta Cotone Organico Unisex' invece di 'Maglietta')",
						"Includi materiali, stile e caratteristiche distintive nel nome del prodotto",
						"Il nome della variante dovrebbe distinguerla dalle altre (colore, taglia, edizione speciale)",
						"Scegli marche riconosciute o crea un brand coerente per tutti i tuoi prodotti",
						"La descrizione dovrebbe rispondere a: Cosa è? Perché è speciale? Come si usa?",
						"Usa la categoria più specifica possibile per migliorare la visibilità",
						"Controlla che categoria e sottocategoria siano coerenti tra loro",
					]}
				/>

				{/* Suggerimento per iniziare */}
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
					<h4 className="text-sm font-medium text-blue-900 mb-2">
						🎆 Inizia da qui per creare il tuo prodotto
					</h4>
					<p className="text-sm text-blue-700">
						Compila prima i tre campi essenziali: <strong>Nome prodotto</strong>
						, <strong>Nome variante</strong> e <strong>Marca</strong>. Poi
						aggiungi descrizione e categoria per completare le informazioni di
						base.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Product Name */}
					<div className="space-y-6">
						<FormField
							disabled={isLoading}
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium">
										Nome del Prodotto <span className="text-red-500">*</span>
									</FormLabel>
									<FormDescription>
										Scegli un nome accattivante e descrittivo (es.
										&quot;Maglietta Cotone Organico&quot;)
									</FormDescription>
									<FormControl>
										<Input
											placeholder="es. Maglietta Basic Cotone 100% - Nome descrittivo del prodotto"
											{...field}
											className="h-10"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Variant Name */}
						<FormField
							disabled={isLoading}
							control={form.control}
							name="variantName"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium">
										Nome della Variante <span className="text-red-500">*</span>
									</FormLabel>
									<FormDescription>
										Nome specifico di questa variante (es. &quot;Bianco&quot;,
										&quot;Taglia L&quot;, &quot;Modello Estate&quot;)
									</FormDescription>
									<FormControl>
										<Input
											placeholder="es. Rosso Fuoco, Taglia XL, Edizione Limitata - Caratteristiche specifiche"
											{...field}
											className="h-10"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Brand */}
						<FormField
							disabled={isLoading}
							control={form.control}
							name="brand"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium">
										Marca del Prodotto <span className="text-red-500">*</span>
									</FormLabel>
									<FormDescription>
										Inserisci il nome del brand/marchio
									</FormDescription>
									<FormControl>
										<Input
											placeholder="es. Nike, Adidas, Supreme - Nome del brand/marchio"
											{...field}
											className="h-10"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Categories */}
					<div className="space-y-6">
						<FormField
							disabled={isLoading}
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium">
										Categoria <span className="text-red-500">*</span>
									</FormLabel>
									<FormDescription>
										Seleziona la categoria principale del prodotto
									</FormDescription>
									<FormControl>
										<SimpleSelect
											disabled={isLoading}
											value={field.value || ""}
											onChange={(e) => field.onChange(e.target.value)}
											placeholder="Seleziona una categoria"
											className="h-10">
											{categories.map((category) => (
												<SimpleSelectOption key={category.id} value={category.id}>
													{category.name}
												</SimpleSelectOption>
											))}
										</SimpleSelect>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							disabled={isLoading}
							control={form.control}
							name="subCategoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium">
										Sottocategoria <span className="text-red-500">*</span>
									</FormLabel>
									<FormDescription>Affina la categorizzazione</FormDescription>
									<FormControl>
										<SimpleSelect
											disabled={isLoading || subCategories.length === 0}
											value={field.value || ""}
											onChange={(e) => field.onChange(e.target.value)}
											placeholder="Prima seleziona una categoria"
											className="h-10">
											{subCategories.map((subCategory) => (
												<SimpleSelectOption key={subCategory.id} value={subCategory.id}>
													{subCategory.name}
												</SimpleSelectOption>
											))}
										</SimpleSelect>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				{/* Description */}
				<FormField
					disabled={isLoading}
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-medium">
								Descrizione del Prodotto <span className="text-red-500">*</span>
							</FormLabel>
							<FormDescription className="mb-2">
								Descrizione dettagliata delle caratteristiche e benefici del
								prodotto (minimo 20 caratteri)
							</FormDescription>
							<FormControl>
								<Textarea
									placeholder="es. Maglietta realizzata in cotone organico al 100%, con vestibilità comoda e design moderno. Perfetta per l'uso quotidiano e gli outfit casual..."
									{...field}
									className="min-h-[120px] resize-none"
								/>
							</FormControl>
							<div className="flex justify-between items-center mt-2">
								<FormMessage />
								<span className="text-xs text-muted-foreground">
									{field.value?.length || 0}/200 caratteri
								</span>
							</div>
						</FormItem>
					)}
				/>
			</CardContent>
		</Card>
	);
};
