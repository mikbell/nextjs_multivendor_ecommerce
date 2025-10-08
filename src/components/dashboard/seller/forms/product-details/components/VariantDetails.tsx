"use client";

import { ImageIcon, Tag, Info } from "lucide-react";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TipsDropdown } from "@/components/ui/TipsDropdown";
import SimpleImageUpload from "@/components/dashboard/shared/simple-image-upload";
import ClickToAddInputs from "./ClickToAddInputs";
import InputFieldset from "@/components/shared/input-fieldset";
import { SimpleKeywordInput } from "@/components/ui/simple-keyword-input";
import { VariantDetailsProps } from "../types";

export const VariantDetails = ({
	form,
	isLoading,
	colors,
	setColors,
	sizes,
	setSizes,
}: VariantDetailsProps) => {
	return (
		<Card className="shadow-sm hover:shadow-md transition-shadow">
			<CardHeader>
				<div className="flex items-center gap-3">
					<div className="p-2 bg-primary rounded-lg">
						<ImageIcon className="h-5 w-5 text-primary-foreground" />
					</div>
					<div>
						<CardTitle className="text-xl">Dettagli Variante</CardTitle>
						<CardDescription>
							Immagine, colori, taglie e parole chiave della variante
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				<TipsDropdown
					title="🎨 Consigli per i Dettagli Variante"
					tips={[
						"L'immagine della variante dovrebbe mostrare chiaramente le differenze rispetto al prodotto base",
						"Usa colori specifici e riconoscibili (es. 'Rosso Carminio' invece di 'Rosso')",
						"Per le taglie, sii coerente: usa sempre lo stesso sistema (S, M, L o 38, 40, 42)",
						"Imposta prezzi competitivi ma realistici per ogni taglia",
						"Le parole chiave dovrebbero includere: materiale, stile, stagione, tipo di utilizzo",
						"Controlla che le quantità siano sempre maggiori di 0 per rendere il prodotto acquistabile",
						"Usa sconti strategici per varianti meno popolari o per liquidare stock",
					]}
				/>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Variant Image */}
					<div>
						<FormField
							control={form.control}
							name="variantImage"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium flex items-center gap-2">
										Immagine Variante
										<Badge variant="destructive" className="text-xs">
											Richiesto
										</Badge>
									</FormLabel>
									<FormDescription className="mb-4">
										Immagine principale che rappresenta questa specifica
										variante del prodotto
									</FormDescription>
									<FormControl>
										<div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors bg-muted/20">
											<SimpleImageUpload
												value={field.value.map((image) => image.url)}
												disabled={isLoading}
												maxImages={1}
												onChange={(urls) => {
													// Debug logging
													console.log(
														"VariantImage onChange - urls ricevute:",
														urls
													);
													const imageObjects = urls.map((url) => ({ url }));
													console.log(
														"VariantImage onChange - oggetti creati:",
														imageObjects
													);
													field.onChange(imageObjects);
												}}
												onRemove={(url) => {
													// Debug logging
													console.log(
														"VariantImage onRemove - url da rimuovere:",
														url
													);
													console.log(
														"VariantImage onRemove - immagini attuali:",
														field.value
													);
													const updatedImages = field.value.filter(
														(current) => current.url !== url
													);
													console.log(
														"VariantImage onRemove - immagini dopo rimozione:",
														updatedImages
													);
													field.onChange(updatedImages);
												}}
											/>
										</div>
									</FormControl>
									<FormMessage className="mt-4" />

									{/* Debug info per l'utente */}
									{process.env.NODE_ENV === "development" && (
										<Alert className="mt-3">
											<AlertDescription>
												<p className="font-semibold mb-1">Debug Info:</p>
												<p className="text-sm">
													Immagini attuali: {field.value.length}
												</p>
												<p className="text-sm">
													URLs:{" "}
													{JSON.stringify(field.value.map((img) => img.url))}
												</p>
												<p className="text-sm mt-1">
													Se l&apos;upload non funziona, controlla la console
													del browser per errori Cloudinary
												</p>
											</AlertDescription>
										</Alert>
									)}
								</FormItem>
							)}
						/>
					</div>

					{/* Keywords */}
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="keywords"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium flex items-center gap-2">
										Parole Chiave SEO
										<Badge variant="outline" className="text-xs">
											Opzionale
										</Badge>
									</FormLabel>
									<FormDescription className="mb-4">
										Aggiungi 5-10 parole chiave per migliorare la visibilità nei
										motori di ricerca. Premi Invio o virgola per aggiungere.
									</FormDescription>
									<FormControl>
										<SimpleKeywordInput
											value={field.value || []}
											onChange={field.onChange}
											placeholder="es. maglietta, cotone, casual, estate, moda"
											maxKeywords={10}
											disabled={isLoading}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				{/* Colors */}
				<div className="mt-8">
					<InputFieldset label="Colori Disponibili">
						<FormDescription className="mb-4">
							<Tag className="inline h-4 w-4 mr-1" />
							Specifica i colori disponibili per questo prodotto (es. Rosso,
							Blu, Verde)
						</FormDescription>
						<div className="w-full flex flex-col gap-y-3">
							<ClickToAddInputs
								details={colors}
								setDetails={setColors}
								initialDetail={{ color: "" }}
								containerClassName="flex-1"
								inputClassName="w-full"
							/>
							{form.formState.errors.colors && (
								<span className="text-sm font-medium text-destructive">
									{form.formState.errors.colors.message}
								</span>
							)}
						</div>
					</InputFieldset>
				</div>

				{/* Sizes */}
				<div className="mt-8">
					<InputFieldset label="Taglie, Quantità, Prezzi e Sconti">
						<FormDescription className="mb-4">
							<Info className="inline h-4 w-4 mr-1" />
							Specifica le varianti di taglia disponibili con prezzi e quantità.
							Lo sconto è opzionale.
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
							{form.formState.errors.sizes && (
								<span className="text-sm font-medium text-destructive">
									{form.formState.errors.sizes.message}
								</span>
							)}
						</div>
					</InputFieldset>
				</div>
			</CardContent>
		</Card>
	);
};
