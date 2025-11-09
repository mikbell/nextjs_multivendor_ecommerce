"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImage {
	id: string;
	url: string;
	alt: string;
}

interface ProductGalleryProps {
	images: ProductImage[];
	productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
	const [selectedImage, setSelectedImage] = useState(0);

	if (images.length === 0) {
		return (
			<div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
				<p className="text-muted-foreground">Nessuna immagine disponibile</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Main Image */}
			<div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
				<Image
					src={images[selectedImage].url}
					alt={images[selectedImage].alt || productName}
					fill
					className="object-cover"
					priority
				/>
			</div>

			{/* Thumbnails */}
			{images.length > 1 && (
				<div className="grid grid-cols-4 gap-2">
					{images.map((image, index) => (
						<button
							key={image.id}
							onClick={() => setSelectedImage(index)}
							className={cn(
								"aspect-square relative rounded-md overflow-hidden border-2 transition-all",
								selectedImage === index
									? "border-primary ring-2 ring-primary/20"
									: "border-transparent hover:border-muted-foreground/20"
							)}>
							<Image
								src={image.url}
								alt={image.alt || `${productName} ${index + 1}`}
								fill
								className="object-cover"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
