"use client";

import { FC, useEffect, useState, useRef } from "react";
import {
	CldUploadWidget,
	type CldUploadWidgetProps,
	type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Upload, Trash, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Tipizzazione migliorata: value e onChange usano SEMPRE string[]
interface ImageUploadProps {
	disabled?: boolean;
	onChange: (value: string[]) => void; // <-- Modificato a string[]
	onRemove: (value: string) => void;
	value: string[]; // <-- Mantenuto string[]
	type: "standard" | "profile" | "cover" | "logo" | "productImage" | "productImages";
	dontShowPreview?: boolean;
	maxImages?: number;
	multiple?: boolean;
	uploadText?: string;
	removeText?: string;
	endpoint?: string;
}

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

if (!cloudName || !uploadPreset) {
	console.error("Missing Cloudinary environment variables");
	throw new Error(
		"Configurazione Cloudinary mancante. Verifica le variabili d'ambiente."
	);
}

type CloudinaryInfo = { secure_url: string };

const ImageUpload: FC<ImageUploadProps> = ({
	disabled,
	onChange,
	onRemove,
	value,
	type,
	dontShowPreview,
	maxImages,
	uploadText,
	removeText,
}) => {
	const [isMounted, setIsMounted] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const valuesRef = useRef<string[]>([]);

	useEffect(() => {
		valuesRef.current = Array.isArray(value) ? value : [];
	}, [value]);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const maxAllowed =
		maxImages ?? (["profile", "cover", "logo"].includes(type) ? 1 : 10);
	const isSingle = maxAllowed === 1;

	const handleUpload = (result: CloudinaryUploadWidgetResults) => {
		if (
			result.event === "success" &&
			typeof result.info === "object" &&
			result.info !== null &&
			"secure_url" in (result.info as Record<string, unknown>) &&
			typeof (result.info as Record<string, unknown>)["secure_url"] === "string"
		) {
			const secureUrl = (result.info as CloudinaryInfo).secure_url;
			setIsUploading(false);

			if (isSingle) {
				onChange([secureUrl]);
			} else {
				const base = valuesRef.current || [];
				const next = Array.from(new Set([...base, secureUrl])).slice(0, maxAllowed);
				valuesRef.current = next;
				onChange(next);
			}
		} else {
			setIsUploading(false);
			console.error("Upload failed or invalid result:", result);
		}
	};

	const handleError = (error: unknown) => {
		setIsUploading(false);
		console.error("Cloudinary upload error:", error);
	};

	const imagesToShow = value.filter(
		(url) => typeof url === "string" && url.trim() !== ""
	);
	const canAddMore = imagesToShow.length < maxAllowed;

	const commonWidgetOptions: CldUploadWidgetProps["options"] = {
		cloudName,
		uploadPreset,
		multiple: !isSingle,
		maxFiles: maxAllowed,
		tags: [type],
		clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
		maxFileSize: 5000000, // 5MB
	};

	const addLabel =
		uploadText ?? (isSingle ? "Carica immagine" : "Aggiungi immagine");
	const removeLabel = removeText ?? "Rimuovi";
	const uploadBtnLabel = isUploading
		? "Caricamento..."
		: canAddMore
		? addLabel
		: "Limite raggiunto";
	const uploadBtnDisabled = disabled || isUploading || !canAddMore;

	if (!isMounted) {
		return null;
	}

	const baseImageClasses = "relative rounded-md overflow-hidden border";

	return (
		<div className="flex flex-col gap-4">
			{!dontShowPreview && (
				<>
					{imagesToShow.length === 0 ? (
						<div
							className={cn(
								baseImageClasses,
								"flex items-center justify-center text-muted-foreground border-dashed",
								{
									"h-60": type === "cover" || type === "standard",
									"h-40 w-40 rounded-full mx-auto": type === "profile",
									"h-24 w-40": type === "logo",
								}
							)}>
							<div className="flex flex-col items-center gap-2 text-sm">
								<Upload className="h-5 w-5" aria-hidden />
								<span>Nessuna immagine</span>
							</div>
						</div>
					) : (
						<div
							className={cn({
								"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3":
									!isSingle,
								"w-full": isSingle,
							})}>
							{imagesToShow.map((url) => (
								<div
									key={url}
									className={cn(baseImageClasses, {
										"h-60": isSingle && type !== "logo" && type !== "profile",
										"h-24": !isSingle,
										"h-24 w-40": isSingle && type === "logo",
										"h-40 w-40 mx-auto rounded-full":
											isSingle && type === "profile",
									})}>
									<Image
										src={url}
										alt="Anteprima immagine"
										fill
										className={cn("object-cover", {
											"rounded-full": type === "profile",
										})}
										sizes={isSingle ? "100vw" : "96px"}
									/>
									<div className="absolute top-1 right-1">
										<Button
											type="button"
											size="icon"
											variant="destructive"
											onClick={() => onRemove(url)}
											className="h-6 w-6">
											<Trash className="h-3 w-3" aria-hidden />
											<span className="sr-only">{removeLabel}</span>
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</>
			)}

			<div>
				<CldUploadWidget
					onSuccess={handleUpload}
					onError={handleError}
					options={commonWidgetOptions}>
					{({ open }) => (
						<Button
							type="button"
							disabled={uploadBtnDisabled}
							onClick={() => {
								setIsUploading(true);
								open();
							}}
							className="flex items-center gap-2">
							{isUploading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
							<Upload className="h-4 w-4" aria-hidden />
							<span>{uploadBtnLabel}</span>
							{!isSingle && (
								<span className="text-xs text-muted-foreground">
									({imagesToShow.length}/{maxAllowed})
								</span>
							)}
						</Button>
					)}
				</CldUploadWidget>
			</div>
		</div>
	);
};

export default ImageUpload;
