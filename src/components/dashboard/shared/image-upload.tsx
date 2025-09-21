"use client";

import { FC, useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Upload, Trash } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
	disabled?: boolean;
	onChange: (value: string) => void;
	onRemove: (value: string) => void;
	value: string[];
	type: "standard" | "profile" | "cover";
	dontShowPreview?: boolean;
	cloudinary_key: string;
	maxImages?: number;
	uploadText?: string;
	removeText?: string;
}

const ImageUpload: FC<ImageUploadProps> = ({
	disabled,
	onChange,
	onRemove,
	value,
	type,
	dontShowPreview,
	cloudinary_key,
	maxImages,
	uploadText,
	removeText,
}) => {
	const [isMounted, setIsMounted] = useState(false);
	const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const isRecord = (v: unknown): v is Record<string, unknown> =>
		typeof v === "object" && v !== null;

	const extractSecureUrl = (result: unknown): string | null => {
		if (Array.isArray(result)) {
			for (const item of result) {
				const u = extractSecureUrl(item);
				if (u) return u;
			}
			return null;
		}
		if (!isRecord(result)) return null;
		const rootSecure = result.secure_url;
		if (typeof rootSecure === "string") return rootSecure;
		const info = isRecord(result.info) ? result.info : undefined;
		const infoUrl = info?.secure_url;
		if (typeof infoUrl === "string") return infoUrl;
		const evt = result.event;
		if (evt === "success" && typeof infoUrl === "string") return infoUrl;
		return null;
	};

	const handleUpload = (result: unknown) => {
		if (process.env.NODE_ENV !== "production") {
			console.log("[CldUploadWidget:onUpload] result:", result);
		}
		const url = extractSecureUrl(result);
		if (url) {
			onChange(url);
		} else if (process.env.NODE_ENV !== "production") {
			console.warn("[CldUploadWidget:onUpload] secure_url not found in result");
		}
	};

	if (!isMounted) {
		return null;
	}

	const maxAllowed =
		typeof maxImages === "number" ? maxImages : type === "profile" ? 1 : 10;

	// Use the `value` prop as the source of truth for displayed images.
	const imagesToShow = value.filter(
		(url) => typeof url === "string" && url.trim() !== ""
	);

	const canAddMore = imagesToShow.length < maxAllowed;
	const isSingle = maxAllowed === 1;
	const widgetMultiple = !isSingle;
	const addLabel =
		uploadText ??
		(type === "profile" ? "Carica immagine" : "Aggiungi immagine");
	const removeLabel = removeText ?? "Rimuovi";

	if (type === "profile") {
		const imageUrl = imagesToShow[0];
		return (
			<div className="relative rounded-full w-52 h-52 inset-x-96 bg-neutral-200 border-2 border-white shadow-2xl">
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt="Profile"
						fill
						className="object-cover rounded-full absolute inset-0"
						sizes="208px"
					/>
				) : (
					<div className="w-52 h-52 flex items-center justify-center rounded-full bg-neutral-200">
						<Upload className="h-10 w-10 text-muted-foreground" aria-hidden />
					</div>
				)}
				<div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
					<CldUploadWidget
						uploadPreset={cloudinary_key}
						onSuccess={handleUpload}
						options={{
							multiple: widgetMultiple,
							maxFiles: maxAllowed,
							...(cloudName ? { cloudName } : {}),
						}}>
						{({ open }) => (
							<Button
								type="button"
								disabled={disabled || !canAddMore}
								onClick={() => open()}
								className="h-full rounded-full bg-black/50 text-white hover:bg-black/70">
								{addLabel}
							</Button>
						)}
					</CldUploadWidget>
				</div>
			</div>
		);
	} else if (type === "standard" || type === "cover") {
		return (
			<div className="flex flex-col gap-3">
				{!dontShowPreview && (
					<>
						{imagesToShow.length === 0 ? (
							<div className="relative h-40 w-40 rounded-md border border-dashed text-muted-foreground flex items-center justify-center md:h-60 md:w-96">
								<div className="flex flex-col items-center gap-2 text-sm">
									<Upload className="h-5 w-5" aria-hidden />
									<span>Nessuna immagine</span>
								</div>
							</div>
						) : isSingle ? (
							<div className="relative h-40 w-40 rounded-md overflow-hidden border md:h-60 md:w-96">
								<Image
									src={imagesToShow[0]}
									alt="Upload"
									fill
									className="object-cover"
									sizes="100vw"
								/>
								<div className="absolute top-2 right-2">
									<Button
										type="button"
										size="sm"
										variant="destructive"
										onClick={() => onRemove(imagesToShow[0])}>
										<Trash className="h-4 w-4" aria-hidden />
										<span className="sr-only">{removeLabel}</span>
									</Button>
								</div>
							</div>
						) : (
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
								{imagesToShow.map((url) => (
									<div
										key={url}
										className="relative w-24 h-24 rounded-md overflow-hidden border">
										<Image
											src={url}
											alt="Upload"
											fill
											className="object-cover"
											sizes="96px"
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
						uploadPreset={cloudinary_key}
						onSuccess={handleUpload}
						options={{
							multiple: widgetMultiple,
							maxFiles: maxAllowed,
							...(cloudName ? { cloudName } : {}),
						}}>
						{({ open }) => (
							<Button
								type="button"
								disabled={disabled || !canAddMore}
								onClick={() => open()}
								className="flex items-center gap-2">
								<Upload className="h-4 w-4" aria-hidden />
								<span>{addLabel}</span>
								{maxAllowed !== Infinity && (
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
	} else {
		return null;
	}
};

export default ImageUpload;
