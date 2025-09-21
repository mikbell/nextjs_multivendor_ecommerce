"use client";

import { FC, useEffect, useState } from "react";
import {
	CldUploadWidget,
	type CldUploadWidgetProps,
	type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Upload, Trash, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
	disabled?: boolean;
	onChange: (value: string | string[]) => void;
	onRemove: (value: string) => void;
	value: string[];
	type: "standard" | "profile" | "cover";
	dontShowPreview?: boolean;
	maxImages?: number;
	uploadText?: string;
	removeText?: string;
}

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

if (!cloudName || !uploadPreset) {
	throw new Error(
		"Manca una o più variabili d'ambiente di Cloudinary. Assicurati che NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME e NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET siano definiti nel tuo file .env.local."
	);
}

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

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const handleUpload = (result: CloudinaryUploadWidgetResults) => {
		console.log("Upload result:", result);
		if (
			result.event === "success" &&
			typeof result.info === "object" &&
			result.info !== null &&
			"secure_url" in result.info &&
			typeof result.info.secure_url === "string"
		) {
			// Type assertion after proper type guards
			const uploadInfo = result.info as { secure_url: string };
			const secureUrl = uploadInfo.secure_url;
			console.log("Secure URL:", secureUrl);
			setIsUploading(false);
			// Se è consentita una sola immagine (profili, cover o maxImages=1),
			// notifichiamo il parent con una singola stringa per coerenza
			if (type === "profile" || type === "cover" || maxImages === 1) {
				console.log("Calling onChange with single value:", secureUrl);
				onChange(secureUrl);
			} else {
				// Assicuriamoci che value sia sempre un array valido
				const currentValues = Array.isArray(value) ? value : [];
				const newValues = [...currentValues, secureUrl];
				console.log("New values:", newValues);
				console.log("Calling onChange with array:", newValues);
				onChange(newValues);
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

	const maxAllowed =
		maxImages ?? (type === "profile" || type === "cover" ? 1 : 10);
	const isSingle = maxAllowed === 1;
	const imagesToShow = Array.isArray(value)
		? value.filter((url) => typeof url === "string" && url.trim() !== "")
		: [];
	const canAddMore = imagesToShow.length < maxAllowed;

	// Debug: log dei valori calcolati
	console.log("ImageUpload Debug:", {
		value,
		imagesToShow,
		canAddMore,
		maxAllowed,
		type
	});

	const commonWidgetOptions: CldUploadWidgetProps["options"] = {
		cloudName,
		uploadPreset,
		multiple: !isSingle,
		maxFiles: maxAllowed,
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

	// Struttura del componente per il tipo "profile"
	if (type === "profile") {
		const imageUrl = imagesToShow[0];
		return (
			<div className="relative w-52 h-52 mx-auto rounded-full bg-neutral-200 border-2 border-white shadow-2xl overflow-hidden">
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt="Profile"
						fill
						className="object-cover rounded-full"
						sizes="208px"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center rounded-full bg-neutral-200">
						<Upload className="h-10 w-10 text-muted-foreground" aria-hidden />
					</div>
				)}
				<div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/50">
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
								className="h-full rounded-full bg-transparent text-white hover:bg-transparent">
								{isUploading && (
									<Loader2 className="h-4 w-4 animate-spin mr-2" />
								)}
								{uploadBtnLabel}
							</Button>
						)}
					</CldUploadWidget>
				</div>
			</div>
		);
	}

	// Struttura unificata per i tipi "standard" e "cover"
	return (
		<div className="flex flex-col gap-3">
			{!dontShowPreview && (
				<>
					{imagesToShow.length === 0 ? (
						<div
							className={`relative w-full rounded-md border border-dashed text-muted-foreground flex items-center justify-center ${
								type === "cover" ? "h-60" : "h-40"
							}`}>
							<div className="flex flex-col items-center gap-2 text-sm">
								<Upload className="h-5 w-5" aria-hidden />
								<span>Nessuna immagine</span>
							</div>
						</div>
					) : (
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
							{imagesToShow.map((url) => (
								<div
									key={url}
									className={`relative w-full rounded-md overflow-hidden border ${
										isSingle ? "h-60" : "h-24"
									}`}>
									<Image
										src={url}
										alt="Upload"
										fill
										className="object-cover"
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
							{isUploading && (
								<Loader2 className="h-4 w-4 animate-spin mr-2" />
							)}
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
