"use client";

import { FC, useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Trash, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUD_NAME || !UPLOAD_PRESET) {
	console.error("Missing Cloudinary environment variables");
	throw new Error(
		"Configurazione Cloudinary mancante. Verifica le variabili d'ambiente."
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
	const [uploadProgress, setUploadProgress] = useState(0);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const maxAllowed =
		maxImages ?? (["profile", "cover", "logo"].includes(type) ? 1 : 10);
	const isSingle = maxAllowed === 1;

	const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files || files.length === 0) return;

		const remainingSlots = maxAllowed - value.length;
		const filesToUpload = Array.from(files).slice(0, remainingSlots);
		
		if (filesToUpload.length === 0) {
			toast.error(`Limite di ${maxAllowed} immagini raggiunto`);
			return;
		}

		setIsUploading(true);
		setUploadProgress(0);

		try {
			const uploadPromises = filesToUpload.map(async (file, index) => {
				console.log(`📤 [ImageUpload] Uploading file ${index + 1}/${filesToUpload.length}:`, file.name);
				
				const formData = new FormData();
				formData.append('file', file);
				formData.append('upload_preset', UPLOAD_PRESET!);
				formData.append('tags', type); // Add type as tag
				
				const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
					method: 'POST',
					body: formData
				});
				
				if (!response.ok) {
					throw new Error(`Upload failed with status: ${response.status}`);
				}
				
				const result = await response.json();
				console.log(`✅ [ImageUpload] File ${index + 1} uploaded:`, result.secure_url);
				
				// Update progress
				setUploadProgress(((index + 1) / filesToUpload.length) * 100);
				
				return result.secure_url;
			});

			const uploadedUrls = await Promise.all(uploadPromises);
			
			if (isSingle) {
				console.log('📸 [ImageUpload] Single image mode - updating with:', uploadedUrls);
				onChange(uploadedUrls);
			} else {
				const newUrls = [...value, ...uploadedUrls];
				console.log('📸 [ImageUpload] Multiple image mode - updating with:', newUrls);
				onChange(newUrls);
			}
			
			console.log('🎉 [ImageUpload] All uploads completed:', uploadedUrls);
			toast.success(`${uploadedUrls.length} immagini caricate con successo!`);
			
		} catch (error) {
			console.error('❌ [ImageUpload] Upload error:', error);
			toast.error('Errore durante il caricamento: ' + (error as Error).message);
		} finally {
			setIsUploading(false);
			setUploadProgress(0);
			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	};

	const imagesToShow = value.filter(
		(url) => typeof url === "string" && url.trim() !== ""
	);
	const canAddMore = imagesToShow.length < maxAllowed;

	const addLabel =
		uploadText ?? (isSingle ? "Carica immagine" : "Aggiungi immagine");
	const removeLabel = removeText ?? "Rimuovi";
	const getUploadBtnLabel = () => {
		if (isUploading) return "Caricamento...";
		if (!canAddMore) return "Limite raggiunto";
		return addLabel;
	};
	const getUploadBtnDisabled = () => {
		return disabled || isUploading || !canAddMore;
	};

	const remainingSlots = maxAllowed - imagesToShow.length;

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

			{/* Upload Controls */}
			<div className="flex items-center gap-2">
				<Input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					multiple={!isSingle}
					onChange={handleFileSelect}
					disabled={getUploadBtnDisabled()}
					className="hidden"
				/>
				
				<Button
					type="button"
					variant={imagesToShow.length === 0 ? "default" : "outline"}
					onClick={() => fileInputRef.current?.click()}
					disabled={getUploadBtnDisabled()}
					className="flex items-center gap-2"
				>
					{isUploading ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Upload className="h-4 w-4" />
					)}
					{getUploadBtnLabel()}
					{!isSingle && canAddMore && (
						<span className="text-xs text-muted-foreground">
							({imagesToShow.length}/{maxAllowed})
						</span>
					)}
				</Button>

				{canAddMore && (
					<span className="text-sm text-muted-foreground">
						{remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} disponibili
					</span>
				)}
			</div>

			{/* Progress Bar */}
			{isUploading && (
				<div className="space-y-1">
					<div className="flex justify-between text-sm">
						<span>Caricamento in corso...</span>
						<span>{Math.round(uploadProgress)}%</span>
					</div>
					<div className="w-full bg-secondary rounded-full h-2">
						<div 
							className="bg-primary h-2 rounded-full transition-all duration-300"
							style={{ width: `${uploadProgress}%` }}
						/>
					</div>
				</div>
			)}

			{/* Stats */}
			<div className="flex justify-between text-xs text-muted-foreground">
				<span>{imagesToShow.length} / {maxAllowed} immagini</span>
				<span>Formati supportati: JPG, PNG, GIF, WebP</span>
			</div>
		</div>
	);
};

export default ImageUpload;
