"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "../types";

interface ValidationErrorsProps {
	form: UseFormReturn<ProductFormData>;
}

export const ValidationErrors = ({ form }: ValidationErrorsProps) => {
	const errors = form.formState.errors;
	const errorCount = Object.keys(errors).length;

	if (errorCount === 0) return null;

	const getErrorMessage = (error: any): string => {
		if (typeof error === "string") return error;
		if (error?.message) return error.message;
		if (Array.isArray(error)) {
			return error
				.map((e, i) => `Elemento ${i + 1}: ${getErrorMessage(e)}`)
				.join(", ");
		}
		if (typeof error === "object") {
			return Object.entries(error)
				.map(([key, value]) => `${key}: ${getErrorMessage(value)}`)
				.join(", ");
		}
		return "Errore di validazione";
	};

	const errorList = Object.entries(errors).map(([field, error]) => ({
		field,
		message: getErrorMessage(error),
	}));

	return (
		<Alert variant="destructive" className="mb-6">
			<AlertCircle className="h-4 w-4" />
			<AlertTitle className="font-semibold">
				{errorCount === 1
					? "1 campo richiede attenzione"
					: `${errorCount} campi richiedono attenzione`}
			</AlertTitle>
			<AlertDescription className="mt-2">
				<ul className="list-disc list-inside space-y-1 text-sm">
					{errorList.map(({ field, message }) => (
						<li key={field}>
							<span className="font-medium capitalize">
								{getFieldLabel(field)}:
							</span>{" "}
							{message}
						</li>
					))}
				</ul>
			</AlertDescription>
		</Alert>
	);
};

function getFieldLabel(field: string): string {
	const labels: Record<string, string> = {
		name: "Nome prodotto",
		description: "Descrizione",
		variantName: "Nome variante",
		variantDescription: "Descrizione variante",
		images: "Immagini prodotto",
		variantImage: "Immagine variante",
		categoryId: "Categoria",
		subCategoryId: "Sottocategoria",
		offerTagId: "Tag offerta",
		brand: "Marca",
		sku: "SKU",
		weight: "Peso",
		keywords: "Parole chiave",
		colors: "Colori",
		sizes: "Taglie",
		product_specs: "Specifiche prodotto",
		variant_specs: "Specifiche variante",
		questions: "Domande e risposte",
		isSale: "In saldo",
		saleEndDate: "Data fine saldo",
		freeShippingForAllCountries: "Spedizione gratuita",
		freeShippingCountriesIds: "Paesi spedizione gratuita",
		shippingFeeMethod: "Metodo calcolo spedizione",
	};

	return labels[field] || field;
}
