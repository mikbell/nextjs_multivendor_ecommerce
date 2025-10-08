import * as z from "zod";

// Define the enum values directly to avoid client-side Prisma import issues
const ProductShippingFeeMethod = {
	ITEM: 'ITEM',
	WEIGHT: 'WEIGHT',
	FIXED: 'FIXED'
} as const;

type ProductShippingFeeMethodType = typeof ProductShippingFeeMethod[keyof typeof ProductShippingFeeMethod];

// Product schema
export const ProductFormSchema = z.object({
	name: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Nome prodotto obbligatorio"
					: "Immetti un nome valido",
		})
	.min(2, { message: "Nome prodotto deve essere almeno 2 caratteri lungo." })
	.max(200, { message: "Nome prodotto non può superare 200 caratteri." })
	.regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9À-ÿ\s&$.%,'-]+$/, {
		message:
			"Il nome prodotto può contenere solo lettere, numeri, spazi e caratteri speciali comuni, senza caratteri consecutivi.",
	}),
	description: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Descrizione prodotto obbligatoria"
					: "Immetti una descrizione valida",
		})
		.min(20, {
			message: "Descrizione prodotto deve essere almeno 20 caratteri.",
		})
		.max(200, {
			message: "Descrizione prodotto deve essere di massimo 200 caratteri.",
		}),
	variantName: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Nome variant prodotto obbligatorio"
					: "Immetti un nome valido",
		})
		.min(2, {
			message: "Nome variante prodotto deve essere almeno 2 caratteri lungo.",
		})
	.max(100, { message: "Nome variante prodotto non può superare 100 caratteri." })
	.regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9À-ÿ\s&$.%,'-]+$/, {
		message:
			"Nome variante può contenere solo lettere, numeri, spazi e caratteri speciali comuni, senza caratteri consecutivi.",
	}),
	variantDescription: z.string().optional(),
	images: z
		.object({ url: z.string() })
		.array()
	.min(3, "Carica almeno 3 immagini per il prodotto.")
	.max(6, "Puoi caricare massimo 6 immagini per il prodotto."),
	variantImage: z
		.object({ url: z.string() })
		.array()
	.length(1, "Scegli un'immagine per la variante del prodotto."),
	categoryId: z.uuid({
		error: (issue) =>
			issue === undefined
				? "ID categoria obbligatorio"
				: "Immetti un ID valido",
	}),
	subCategoryId: z.uuid({
		error: (issue) =>
			issue === undefined
				? "ID sottocategoria obbligatorio"
				: "Immetti un ID valido",
	}),
	offerTagId: z
		.string()
		.optional()
		.refine((val) => !val || val === "" || z.string().uuid().safeParse(val).success, {
			message: "Immetti un ID valido o lascia vuoto",
		}),
	brand: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Marca prodotto obbligatoria"
					: "Immetti una marca valida",
		})
		.min(2, {
			message: "Marca prodotto deve essere almeno 2 caratteri lungo.",
		})
	.max(50, {
		message: "Marca prodotto non può superare 50 caratteri.",
	}),
	sku: z
		.string({
			error: (issue) =>
				issue === undefined
					? "SKU prodotto obbligatorio"
					: "Immetti un SKU valido",
		})
		.min(6, {
			message: "SKU prodotto deve essere almeno 6 caratteri lungo.",
		})
		.max(50, {
			message: "SKU prodotto non può superare 50 caratteri.",
		}),
	weight: z.number().min(0.01, {
		message: "Inserisci un peso prodotto valido (minimo 0.01 kg).",
	}),
	keywords: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Parole chiave prodotto obbligatorie"
					: "Immetti parole chiave valide",
		})
		.min(1, { message: "Ogni parola chiave deve contenere almeno un carattere." })
		.array()
		.min(5, {
			message: "Inserisci almeno 5 parole chiave.",
		})
		.max(10, {
			message: "Puoi inserire massimo 10 parole chiave.",
		}),
	colors: z
		.object({ color: z.string() })
		.array()
	.min(1, "Inserisci almeno un colore.")
	.refine((colors) => colors.every((c) => c.color.length > 0), {
		message: "Tutti i campi colore devono essere compilati.",
	}),
	sizes: z
	.object({
		size: z.string().min(1, { message: "Specifica una taglia valida." }),
		quantity: z
			.number()
			.min(1, { message: "La quantità deve essere maggiore di 0." }),
		price: z.number().min(0.01, { message: "Il prezzo deve essere maggiore di 0." }),
		discount: z.number().min(0, { message: "Lo sconto deve essere positivo." }),
	})
		.array()
	.min(1, "Inserisci almeno una taglia.")
	.refine(
		(sizes) =>
			sizes.every((s) => s.size.length > 0 && s.price > 0 && s.quantity > 0),
		{
			message: "Tutti i campi delle taglie devono essere compilati correttamente (taglia, prezzo > 0, quantità > 0).",
		}
	),
	product_specs: z
		.object({
			name: z.string(),
			value: z.string(),
		})
		.array()
	.min(1, "Inserisci almeno una specifica del prodotto.")
	.refine(
		(product_specs) =>
			product_specs.every((s) => s.name.length > 0 && s.value.length > 0),
		{
			message: "Tutte le specifiche del prodotto devono essere compilate correttamente.",
		}
	),
	variant_specs: z
		.object({
			name: z.string(),
			value: z.string(),
		})
		.array()
	.min(1, "Inserisci almeno una specifica della variante.")
	.refine(
		(product_specs) =>
			product_specs.every((s) => s.name.length > 0 && s.value.length > 0),
		{
			message: "Tutte le specifiche della variante devono essere compilate correttamente.",
		}
	),
	questions: z
		.object({
			question: z.string(),
			answer: z.string(),
		})
		.array()
	.min(1, "Inserisci almeno una domanda sul prodotto.")
	.refine(
		(questions) =>
			questions.every((q) => q.question.length > 0 && q.answer.length > 0),
		{
			message: "Tutte le domande e risposte devono essere compilate correttamente.",
		}
	),
	isSale: z.boolean().default(false),
	saleEndDate: z.string().optional(),
	freeShippingForAllCountries: z.boolean().default(false),
	freeShippingCountriesIds: z
		.object({
			label: z.string(),
			value: z.string(),
		})
		.array()
		.default([])
		.refine(
			(ids) => ids.every((item) => item.label && item.value),
			"Each country must have a valid name and ID."
		),
	shippingFeeMethod: z.nativeEnum(ProductShippingFeeMethod),
});

// Export the enum for use in other files
export { ProductShippingFeeMethod };
export type { ProductShippingFeeMethodType };