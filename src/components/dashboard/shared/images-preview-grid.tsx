// React, Next.js
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";

// Utils
import { cn, getDominantColors, getGridClassName } from "@/lib/utils";

//Icons
import { Trash } from "lucide-react";
import ColorPalette from "./color-palette";

//Components
import { Button } from "@/components/ui/button";

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
	useEffect(() => {
		const fecthColors = async () => {
			const palettes = await Promise.all(
				images.map(async (img) => {
					try {
						const colors = await getDominantColors(img.url);
						return colors;
					} catch (error) {
						return [];
					}
				})
			);
			setColorPalettes(palettes);
		};

		if (imagesLength > 0) {
			fecthColors();
		}
	}, [images, imagesLength]);

	console.log("colorPalettes--->", colorPalettes);

	// If there are no images, display a placeholder image
	if (imagesLength === 0) {
		return (
			<div className="max-w-4xl">
				<div className="w-full h-[800px] bg-white rounded-md"></div>
			</div>
		);
	} else {
		// If there are images, display the images in a grid
		return (
			<div className="max-w-4xl">
				<div
					className={cn(
						"grid h-[800px] overflow-hidden bg-white rounded-md",
						GridClassName
					)}>
					{images.map((img, i) => (
						<div
							key={i}
							className={cn(
								"relative group h-full w-full border border-gray-300",
								`grid_${imagesLength}_image_${i + 1}`,
								{
									"h-[266.66px]": images.length === 6,
								}
							)}>
							{/* Image */}
							<Image
								src={img.url}
								alt=""
								width={800}
								height={800}
								className="w-full h-full object-cover object-top"
							/>
							{/* Actions */}
							<div
								className={cn(
									"absolute top-0 left-0 right-0 bottom-0 hidden group-hover:flex bg-white/55 cursor-pointer  items-center justify-center flex-col gap-y-3 transition-all duration-500",
									{
										"!pb-[40%]": imagesLength === 1,
									}
								)}>
								{/* Color palette (Extract colors) */}
								<ColorPalette
									colors={colors}
									setColors={setColors}
									extractedColors={colorPalettes[i]}
								/>
								{/* Delete Button */}
								<Button
									type="button"
									variant="ghost"
									onClick={() => onRemove(img.url)}>
									<div className="sign">
										<Trash size={18} />
									</div>
									<div className="text">Delete</div>
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}
};

export default ImagesPreviewGrid;
