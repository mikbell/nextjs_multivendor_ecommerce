"use client";

import { ImageIcon } from "lucide-react";
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
import { ProductImagesProps } from "../types";

export const ProductImages = ({
	form,
	isLoading,
	isNewVariantPage,
}: ProductImagesProps) => {
	return (
		<Card className="shadow-sm hover:shadow-md transition-shadow">
			<CardHeader>
				<div className="flex items-center gap-3">
					<div className="p-2 bg-primary rounded-lg">
						<ImageIcon className="h-5 w-5 text-primary-foreground" />
					</div>
					<div>
						<CardTitle className="text-xl">
							{isNewVariantPage ? "Immagini Variante" : "Galleria Immagini"}
						</CardTitle>
						<CardDescription>
							{isNewVariantPage
								? "Immagini che mostrano questa specifica variante"
								: "Immagini principali che rappresentano il prodotto"}
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<TipsDropdown
					title="📷 Consigli per le Immagini"
					tips={[
						"La prima immagine sarà quella principale mostrata nelle ricerche",
						"Usa immagini con buona illuminazione naturale o artificiale bianca",
						"Risoluzione minima consigliata: 800x800 pixel per evitare pixelature",
						"Mostra il prodotto da diverse angolazioni (fronte, retro, dettagli, in uso)",
						"Usa sfondi neutri (bianco, grigio chiaro) per evidenziare il prodotto",
						"Per abbigliamento: includi immagini indossate e dettagli dei materiali",
						"Evita filigrane o loghi che possano distrarre dall'acquisto",
					]}
				/>

				<FormField
					control={form.control}
					name="images"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm font-medium">
								{isNewVariantPage
									? "Immagini della Variante"
									: "Immagini del Prodotto"}{" "}
								<span className="text-red-500">*</span>
							</FormLabel>
							<FormDescription className="mb-4">
								{isNewVariantPage
									? "Carica da 3 a 6 immagini che mostrano chiaramente questa variante specifica del prodotto"
									: "Carica da 3 a 6 immagini di alta qualità del prodotto. La prima immagine sarà quella principale."}
							</FormDescription>
							<FormControl>
								<div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors bg-muted/20">
									<SimpleImageUpload
										value={field.value.map((image) => image.url)}
										disabled={isLoading}
										maxImages={6}
										onChange={(urls) => {
											console.log(
												"ProductImages onChange - urls ricevute:",
												urls
											);
											const imageObjects = urls.map((url) => ({ url }));
											console.log(
												"ProductImages onChange - oggetti creati:",
												imageObjects
											);
											field.onChange(imageObjects);
										}}
										onRemove={(url) => {
											console.log(
												"ProductImages onRemove - url da rimuovere:",
												url
											);
											console.log(
												"ProductImages onRemove - immagini attuali:",
												field.value
											);
											const updatedImages = field.value.filter(
												(current) => current.url !== url
											);
											console.log(
												"ProductImages onRemove - immagini dopo rimozione:",
												updatedImages
											);
											field.onChange(updatedImages);
										}}
									/>
								</div>
							</FormControl>
							<FormMessage className="mt-4" />

							{/* Progress info */}
							<Alert className="mt-4">
								<AlertDescription>
									<p className="font-medium mb-2">📈 Info Caricamento:</p>
									<p className="text-sm text-muted-foreground">
										Immagini caricate: {field.value.length}/6 • Minimo
										richiesto: 3 • Formati supportati: JPG, PNG, WebP
									</p>
								</AlertDescription>
							</Alert>
						</FormItem>
					)}
				/>
			</CardContent>
		</Card>
	);
};
