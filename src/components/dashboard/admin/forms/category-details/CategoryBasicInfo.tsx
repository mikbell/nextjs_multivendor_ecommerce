import { FC } from "react";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Type, Link, Hash, CheckCircle, AlertCircle } from "lucide-react";
import { CategoryBasicInfoProps } from "./types";
import { STYLES, VALIDATION_LIMITS } from "./constants";
import { getCharacterCountDisplay } from "./utils";

const CategoryBasicInfo: FC<CategoryBasicInfoProps> = ({ form, isLoading }) => {
	const name = form.watch("name") || "";
	const slug = form.watch("slug") || "";
	const url = form.watch("url") || "";

	// Validation states
	const isNameValid = name.length >= VALIDATION_LIMITS.NAME_MIN_LENGTH && name.length <= VALIDATION_LIMITS.NAME_MAX_LENGTH;
	const isSlugValid = slug.length >= VALIDATION_LIMITS.SLUG_MIN_LENGTH && slug.length <= VALIDATION_LIMITS.SLUG_MAX_LENGTH;
	const isUrlValid = url.length >= VALIDATION_LIMITS.URL_MIN_LENGTH;

	return (
		<div className={STYLES.CARD_BASE}>
			<div className="flex items-center gap-3 mb-6">
				<div className={`p-2 ${STYLES.GRADIENT_BLUE} rounded-xl`}>
					<Type className="h-5 w-5 text-white" />
				</div>
				<div>
					<h3 className="text-xl font-bold text-foreground">Informazioni Base</h3>
					<p className="text-muted-foreground text-sm">
						Nome, slug e URL della categoria
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<FormField
					disabled={isLoading}
					control={form.control}
					name="name"
					render={({ field, fieldState }) => {
						const charCount = getCharacterCountDisplay(
							field.value?.length || 0,
							VALIDATION_LIMITS.NAME_MAX_LENGTH,
							VALIDATION_LIMITS.NAME_MIN_LENGTH
						);
						return (
							<FormItem>
								<FormLabel className="text-base font-semibold flex items-center gap-2">
									<Type className="h-4 w-4" />
									Nome categoria
									<Badge variant="destructive" className="text-xs">
										Richiesto
									</Badge>
									{isNameValid && !fieldState.error && (
										<CheckCircle className="h-4 w-4 text-green-600" />
									)}
									{!isNameValid && field.value && (
										<AlertCircle className="h-4 w-4 text-red-600" />
									)}
								</FormLabel>
								<FormDescription className="text-sm text-muted-foreground">
									Nome visualizzato pubblicamente per la categoria
								</FormDescription>
								<FormControl>
									<Input 
										placeholder="es. Abbigliamento, Elettronica..." 
										maxLength={VALIDATION_LIMITS.NAME_MAX_LENGTH}
										{...field} 
									/>
								</FormControl>
								<div className="flex justify-between items-center">
									<FormMessage />
									<span className={`text-xs ${charCount.color}`}>
										{charCount.text}
									</span>
								</div>
							</FormItem>
						);
					}}
				/>

				<FormField
					disabled={isLoading}
					control={form.control}
					name="slug"
					render={({ field, fieldState }) => {
						const charCount = getCharacterCountDisplay(
							field.value?.length || 0,
							VALIDATION_LIMITS.SLUG_MAX_LENGTH,
							VALIDATION_LIMITS.SLUG_MIN_LENGTH
						);
						return (
							<FormItem>
								<FormLabel className="text-base font-semibold flex items-center gap-2">
									<Hash className="h-4 w-4" />
									Slug categoria
									<Badge variant="destructive" className="text-xs">
										Richiesto
									</Badge>
									{isSlugValid && !fieldState.error && (
										<CheckCircle className="h-4 w-4 text-green-600" />
									)}
									{!isSlugValid && field.value && (
										<AlertCircle className="h-4 w-4 text-red-600" />
									)}
								</FormLabel>
								<FormDescription className="text-sm text-muted-foreground">
									Versione URL-friendly del nome (auto-generato)
								</FormDescription>
								<FormControl>
									<Input 
										placeholder="abbigliamento" 
										maxLength={VALIDATION_LIMITS.SLUG_MAX_LENGTH}
										{...field} 
									/>
								</FormControl>
								<div className="flex justify-between items-center">
									<FormMessage />
									<span className={`text-xs ${charCount.color}`}>
										{charCount.text}
									</span>
								</div>
							</FormItem>
						);
					}}
				/>

				<FormField
					disabled={isLoading}
					control={form.control}
					name="url"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel className="text-base font-semibold flex items-center gap-2">
								<Link className="h-4 w-4" />
								URL categoria
								<Badge variant="destructive" className="text-xs">
									Richiesto
								</Badge>
								{isUrlValid && !fieldState.error && (
									<CheckCircle className="h-4 w-4 text-green-600" />
								)}
								{!isUrlValid && field.value && (
									<AlertCircle className="h-4 w-4 text-red-600" />
								)}
							</FormLabel>
							<FormDescription className="text-sm text-muted-foreground">
								Percorso completo della categoria nel sito
							</FormDescription>
							<FormControl>
								<Input 
									placeholder="/categoria/abbigliamento" 
									{...field} 
								/>
							</FormControl>
							<FormMessage />
							{field.value && (
								<div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
									<p className="text-xs text-blue-800">
										<strong>Anteprima:</strong> {window.location.origin}{field.value}
									</p>
								</div>
							)}
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
};

export default CategoryBasicInfo;
