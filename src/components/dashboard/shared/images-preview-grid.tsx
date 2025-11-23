// React, Next.js
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";

// Utils
import { cn, getDominantColors, getGridClassName } from "@/lib/utils";

//Icons
import { Trash2, Eye, Palette, ImageIcon, Loader2 } from "lucide-react";
import ColorPalette from "./color-palette";

//Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ImagesPreviewGridProps {
	images: { url: string }[]; // Array of image URLs
	onRemove: (value: string) => void; // Callback function when an image is removed
	colors?: { color: string }[]; // List of colors from form
	setColors: Dispatch<SetStateAction<{ color: string }[]>>; // Setter function for colors
}

const ImagesPreviewGrid: FC<ImagesPreviewGridProps> = ({
	images,
	onRemove,
	colors,
	setColors,
}) => {
	// Calculate the number of images
	const imagesLength = images.length;

	// Get the grid class name based on the number of images
	const GridClassName = getGridClassName(imagesLength);

	// Extract images colors
	const [colorPalettes, setColorPalettes] = useState<string[][]>([]);
	const [loadingColors, setLoadingColors] = useState<boolean>(false);
	const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

	useEffect(() => {
		const fetchColors = async () => {
			if (imagesLength === 0) return;

			setLoadingColors(true);
			try {
				const palettes = await Promise.all(
					images.map(async (img, index) => {
						try {
							const colors = await getDominantColors(img.url);
							return colors;
						} catch (error) {
							console.warn(
								`Failed to extract colors from image ${index}:`,
								error
							);
							return [];
						}
					})
				);
				setColorPalettes(palettes);
			} catch (error) {
				console.error("Error extracting color palettes:", error);
			} finally {
				setLoadingColors(false);
			}
		};

		fetchColors();
	}, [images, imagesLength]);

	const handleImageError = (index: number) => {
		setImageErrors((prev) => new Set([...prev, index]));
	};

	// If there are no images, display a modern placeholder
	if (imagesLength === 0) {
		return (
			<div className="max-w-4xl">
				<div className="w-full h-[400px] bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center transition-colors duration-200 hover:border-gray-400 hover:bg-linear-to-br hover:from-gray-100 hover:to-gray-150">
					<div className="p-4 bg-white rounded-full shadow-lg mb-4">
						<ImageIcon className="h-12 w-12 text-muted" />
					</div>
					<h3 className="text-xl font-semibold text-muted mb-2">
						Nessuna immagine caricata
					</h3>
					<p className="text-sm text-muted text-center max-w-sm">
						Carica almeno 3 immagini di alta qualità per mostrare il tuo
						prodotto nel modo migliore
					</p>
					<Badge variant="outline" className="mt-3">
						0 / 10 immagini
					</Badge>
				</div>
			</div>
		);
	} else {
		// If there are images, display them in a modern grid
		return (
			<div className="max-w-4xl">
				{/* Header with image count and actions */}
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-blue-100 rounded-lg">
							<ImageIcon className="h-5 w-5 text-blue-600" />
						</div>
						<div>
							<h3 className="font-semibold">Anteprima Immagini</h3>
							<p className="text-sm text-muted">
								Passa sopra un&apos;immagine per vedere le opzioni
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Badge variant="outline" className="font-medium">
							{imagesLength} / 10 immagini
						</Badge>
						{loadingColors && (
							<Badge variant="secondary" className="flex items-center gap-1">
								<Loader2 className="h-3 w-3 animate-spin" />
								Estraendo colori...
							</Badge>
						)}
					</div>
				</div>

				{/* Images Grid */}
				<div
					className={cn(
						"grid h-[500px] overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm",
						GridClassName
					)}>
					{images.map((img, i) => (
						<div
							key={i}
							className={cn(
								"relative group h-full w-full border border-gray-200 bg-gray-50 transition-all duration-300 hover:border-blue-300 hover:shadow-md",
								`grid_${imagesLength}_image_${i + 1}`,
								{
									"h-[266.66px]": images.length === 6,
									"border-red-300 bg-red-50": imageErrors.has(i),
								}
							)}>
							{/* Image or Error State */}
							{imageErrors.has(i) ? (
								<div className="w-full h-full flex flex-col items-center justify-center text-red-500">
									<ImageIcon className="h-8 w-8 mb-2" />
									<span className="text-xs font-medium">
										Errore caricamento
									</span>
								</div>
							) : (
								<Image
									src={img.url}
									alt={`Immagine prodotto ${i + 1}`}
									width={800}
									height={800}
									className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
									onError={() => handleImageError(i)}
								/>
							)}

							{/* Image Index Badge */}
							<div className="absolute top-2 left-2 z-10">
								<Badge
									variant={i === 0 ? "default" : "secondary"}
									className="text-xs font-bold shadow-sm">
									{i === 0 ? "PRINCIPALE" : `${i + 1}`}
								</Badge>
							</div>
							{/* Actions Overlay */}
							<div
								className={cn(
									"absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4",
									{
										hidden: imageErrors.has(i),
									}
								)}>
								{/* Color Palette Section */}
								{colorPalettes[i] && colorPalettes[i].length > 0 && (
									<div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
										<div className="flex items-center gap-2 mb-2">
											<Palette className="h-4 w-4 text-muted" />
											<span className="text-xs font-medium">
												Colori estratti
											</span>
										</div>
										<ColorPalette
											colors={colors}
											setColors={setColors}
											extractedColors={colorPalettes[i]}
										/>
									</div>
								)}

								{/* Action Buttons */}
								<div className="flex items-center gap-2">
									<Button
										size="sm"
										variant="secondary"
										onClick={(e) => {
											e.preventDefault();
											window.open(img.url, "_blank");
										}}>
										<Eye className="h-4 w-4" />
										<span className="text-xs font-medium">Visualizza</span>
									</Button>

									<Button
										size="sm"
										variant="destructive"
										className="shadow-md flex items-center gap-1"
										onClick={(e) => {
											e.preventDefault();
											onRemove(img.url);
										}}>
										<Trash2 className="h-4 w-4" />
										<span className="text-xs font-medium">Rimuovi</span>
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}
};

export default ImagesPreviewGrid;
