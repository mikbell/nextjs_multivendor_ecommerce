import { product_shippingFeeMethod } from "@prisma/client";
import * as z from "zod";

// Catgeory form schema
export const CategoryFormSchema = z.object({
	name: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Nome categoria obbligatorio"
					: "Immetti un nome valido",
		})
		.min(2, { message: "Nome categoria deve essere almeno 2 caratteri lungo." })
		.max(50, { message: "Nome categoria non può superare 50 caratteri." })
		.regex(/^[a-zA-Z0-9À-ÿ\s&$.%,']+$/, {
			message:
				"Solo lettere, numeri, spazi e caratteri speciali comuni sono consentiti nel nome categoria.",
		}),
	image: z
		.object({
			url: z.string(),
		})
		.array()
		.min(1, "Scegli un'immagine per la categoria.")
		.max(1, "Puoi caricare solo un'immagine per categoria."),
	url: z
		.string({
			error: (issue) =>
				issue === undefined
					? "URL categoria obbligatorio"
					: "Immetti un URL valido",
		})
		.min(2, { message: "URL categoria deve essere almeno 2 caratteri lungo." })
		.max(50, { message: "URL categoria non può superare 50 caratteri." })
		.regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
			message:
				"Solo lettere, numeri, trattini e underscore sono consentiti nell'URL categoria, senza occorrenze consecutive.",
		}),
	slug: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Slug categoria obbligatorio"
					: "Immetti uno slug valido",
		})
		.min(2, { message: "Slug categoria deve essere almeno 2 caratteri lungo." })
		.max(50, { message: "Slug categoria non può superare 50 caratteri." })
		.regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
			message:
				"Solo lettere, numeri, trattini e underscore sono consentiti nello slug della categoria, senza occorrenze consecutive.",
		}),
	description: z
		.string()
		.min(1, { message: "Descrizione categoria obbligatoria." })
		.max(500, {
			message: "Descrizione categoria non può superare 500 caratteri.",
		}),
	featured: z.boolean().default(false),
});

// SubCategory schema
export const SubCategoryFormSchema = z.object({
	name: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Nome sottocategoria obbligatorio"
					: "Immetti un nome valido",
		})
		.min(2, {
			message: "Nome sottocategoria deve essere almeno 2 caratteri lungo.",
		})
		.max(50, { message: "Nome sottocategoria non può superare 50 caratteri." })
		.regex(/^[a-zA-Z0-9À-ÿ\s&$.%,']+$/, {
			message:
				"Solo lettere, numeri, spazi e caratteri speciali comuni sono consentiti nel nome sottocategoria.",
		}),
	image: z
		.object({ url: z.string() })
		.array()
		.min(1, "Scegli un'immagine per la sottocategoria.")
		.max(1, "Puoi caricare solo un'immagine per sottocategoria."),
	url: z
		.string({
			error: (issue) =>
				issue === undefined
					? "URL sottocategoria obbligatorio"
					: "Immetti un URL valido",
		})
		.min(2, {
			message: "URL sottocategoria deve essere almeno 2 caratteri lungo.",
		})
		.max(50, { message: "URL sottocategoria non può superare 50 caratteri." })
		.regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
			message:
				"Solo lettere, numeri, trattini e underscore sono consentiti nell'URL sottocategoria, senza occorrenze consecutive.",
		}),
	categoryId: z.string(),
	slug: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Slug sottocategoria obbligatorio"
					: "Immetti uno slug valido",
		})
		.min(2, {
			message: "Slug sottocategoria deve essere almeno 2 caratteri lungo.",
		})
		.max(50, { message: "Slug sottocategoria non può superare 50 caratteri." })
		.regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
			message:
				"Solo lettere, numeri, trattini e underscore sono consentiti nello slug della sottocategoria, senza occorrenze consecutive.",
		}),
	description: z
		.string()
		.min(1, { message: "Descrizione sottocategoria obbligatoria." })
		.max(500, {
			message: "Descrizione sottocategoria non può superare 500 caratteri.",
		}),
	featured: z.boolean().default(false),
});

// Store schema
export const StoreFormSchema = z.object({
	name: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Nome store obbligatorio"
					: "Immetti un nome valido",
		})
		.min(2, { message: "Nome store deve essere almeno 2 caratteri lungo." })
		.max(50, { message: "Nome store non può superare 50 caratteri." })
		.regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_ -]+$/, {
			message:
				"Solo lettere, numeri, spazi, trattini e underscore sono consentiti nel nome store, senza occorrenze consecutive di trattini, underscore o spazi.",
		}),
	description: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Descrizione store obbligatoria"
					: "Immetti una descrizione valida",
		})
		.min(30, {
			message: "La descrizione deve essere di almeno 30 caratteri.",
		})
		.max(500, { message: "La descrizione non puo superare 500 caratteri." }),
	email: z.email({
		error: (issue) =>
			issue === undefined
				? "Email store obbligatoria"
				: "Immetti un'email valida",
	}),
	phone: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Numero di telefono store obbligatorio"
					: "Immetti un numero di telefono valido",
		})
		.regex(/^\+?\d+$/, { message: "Invalid phone number format." }),
	logo: z.string().min(1, "Scegli un logo per il tuo negozio."),
	cover: z.string().min(1, "Scegli una cover per il tuo negozio."),
	slug: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Slug store obbligatorio"
					: "Immetti uno slug valido",
		})
		.min(2, { message: "Slug store deve essere almeno 2 caratteri lungo." })
		.max(50, { message: "Slug store non può superare 50 caratteri." })
		.regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
			message:
				"Solo lettere, numeri, trattini e underscore sono consentiti nello slug del negozio, senza occorrenze consecutive di trattini o underscore.",
		}),
	featured: z.boolean().default(false).optional(),
	returnPolicy: z
		.string()
		.min(1, "La politica di reso è obbligatoria.")
		.default("Return in 30 days."),
	defaultShippingService: z.string().default("International Delivery"),
	defaultShippingFee: z.number().default(0),
	defaultDeliveryTimeMin: z.number().int().default(7),
	defaultDeliveryTimeMax: z.number().int().default(31),
});

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
	shippingFeeMethod: z.nativeEnum(product_shippingFeeMethod),
});

// OfferTag form schema
export const OfferTagFormSchema = z.object({
	name: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Nome tag offerta obbligatorio"
					: "Immetti un nome valido",
		})
		.min(2, {
			message: "Nome tag offerta deve essere almeno 2 caratteri lungo.",
		})
		.max(50, { message: "Nome tag offerta non può superare 50 caratteri." })
		.regex(/^[a-zA-Z0-9\s&$.%,']+$/, {
			message:
				"Only letters, numbers, and spaces are allowed in the category name.",
		}),
	url: z
		.string({
			error: (issue) =>
				issue === undefined
					? "URL tag offerta obbligatorio"
					: "Immetti un URL valido",
		})
		.min(2, {
			message: "URL tag offerta deve essere almeno 2 caratteri lungo.",
		})
		.max(50, { message: "URL tag offerta non può superare 50 caratteri." })
		.regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
			message:
				"Only letters, numbers, hyphen, and underscore are allowed in the category url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.",
		}),
});

// Store shipping details
export const StoreShippingFormSchema = z.object({
	defaultShippingService: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Nome servizio di spedizione obbligatorio"
					: "Immetti un nome valido",
		})
		.min(2, "Shipping service name must be at least 2 characters long.")
		.max(50, { message: "Shipping service name cannot exceed 50 characters." }),
	defaultShippingFeePerItem: z.number(),
	defaultShippingFeeForAdditionalItem: z.number(),
	defaultShippingFeePerKg: z.number(),
	defaultShippingFeeFixed: z.number(),
	defaultDeliveryTimeMin: z.number(),
	defaultDeliveryTimeMax: z.number(),
	returnPolicy: z.string(),
});

export const ShippingRateFormSchema = z.object({
	shippingService: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Nome servizio di spedizione obbligatorio"
					: "Immetti un nome valido",
		})
		.min(2, {
			message: "Shipping service name must be at least 2 characters long.",
		})
		.max(50, { message: "Shipping service name cannot exceed 50 characters." }),
	countryId: z.string().optional(),
	countryName: z.string().optional(),
	shippingFeePerItem: z.number(),
	shippingFeeForAdditionalItem: z.number(),
	shippingFeePerKg: z.number(),
	shippingFeeFixed: z.number(),
	deliveryTimeMin: z.number(),
	deliveryTimeMax: z.number(),
	returnPolicy: z.string().min(1, "Return policy is required."),
});

export const ShippingAddressSchema = z.object({
	countryId: z.string({
		error: (issue) =>
			issue === undefined ? "Paese obbligatorio" : "Immetti un paese valido",
	}),
	firstName: z
		.string({
			error: (issue) =>
				issue === undefined ? "Nome obbligatorio" : "Immetti un nome valido",
		})
		.min(2, { message: "First name should be at least 2 characters long." })
		.max(50, { message: "First name cannot exceed 50 characters." })
		.regex(/^[a-zA-Z]+$/, {
			message: "No special characters are allowed in name.",
		}),

	lastName: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Cognome obbligatorio"
					: "Immetti un cognome valido",
		})
		.min(2, { message: "Last name should be at least 2 characters long." })
		.max(50, { message: "Last name cannot exceed 50 characters." })
		.regex(/^[a-zA-Z]+$/, {
			message: "No special characters are allowed in name.",
		}),
	phone: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Numero di telefono obbligatorio"
					: "Immetti un numero di telefono valido",
		})
		.regex(/^\+?\d+$/, { message: "Invalid phone number format." }),

	address1: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Indirizzo obbligatorio"
					: "Immetti un indirizzo valido",
		})
		.min(5, { message: "Address line 1 should be at least 5 characters long." })
		.max(100, { message: "Address line 1 cannot exceed 100 characters." }),

	address2: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Indirizzo obbligatorio"
					: "Immetti un indirizzo valido",
		})
		.max(100, { message: "Address line 2 cannot exceed 100 characters." })
		.optional(),

	state: z
		.string({
			error: (issue) =>
				issue === undefined ? "Stato obbligatorio" : "Immetti un stato valido",
		})
		.min(2, { message: "State should be at least 2 characters long." })
		.max(50, { message: "State cannot exceed 50 characters." }),

	city: z
		.string({
			error: (issue) =>
				issue === undefined ? "Città obbligatorio" : "Immetti una città valida",
		})
		.min(2, { message: "City should be at least 2 characters long." })
		.max(50, { message: "City cannot exceed 50 characters." }),

	zip_code: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Codice postale obbligatorio"
					: "Immetti un codice postale valido",
		})
		.min(2, { message: "Zip code should be at least 2 characters long." })
		.max(10, { message: "Zip code cannot exceed 10 characters." }),

	default: z.boolean().default(false),
});

export const CouponFormSchema = z.object({
	code: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Codice coupon obbligatorio"
					: "Immetti un codice coupon valido",
		})
		.min(2, { message: "Coupon code must be at least 2 characters long." })
		.max(50, { message: "Coupon code cannot exceed 50 characters." })
		.regex(/^[a-zA-Z0-9]+$/, {
			message: "Only letters and numbers are allowed in the coupon code.",
		}),
	startDate: z.string({
		error: (issue) =>
			issue === undefined
				? "Data di inizio obbligatoria"
				: "Immetti una data di inizio valida",
	}),
	endDate: z.string({
		error: (issue) =>
			issue === undefined
				? "Data di fine obbligatoria"
				: "Immetti una data di fine valida",
	}),
	discount: z
		.number({
			error: (issue) =>
				issue === undefined
					? "Sconto obbligatorio"
					: "Immetti un sconto valido",
		})
		.min(1, { message: "Discount must be at least 1." })
		.max(99, { message: "Discount cannot exceed 99." }),
});

export const ApplyCouponFormSchema = z.object({
	coupon: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Coupon obbligatorio"
					: "Immetti un coupon valido",
		})
		.min(2, "Coupon must be atleast 2 characters."),
});

// Add review schema
export const AddReviewSchema = z.object({
	variantName: z.string().min(1, "Variant is required."),
	rating: z.number().min(1, "Please rate this product."),
	size: z.string().min(1, "Please select a size."), // Ensures size cannot be empty
	review: z
		.string()
		.min(
			10,
			"Your feedback matters! Please write a review of minimum 10 characters."
		), // Ensures review cannot be empty
	quantity: z.string().default("1"),
	images: z
		.object({ url: z.string() })
		.array()
		.max(3, "You can upload up to 3 images for the review."),
	color: z.string({
		error: (issue) =>
			issue === undefined ? "Colore obbligatorio" : "Immetti un colore valido",
	}),
});

export const StoreShippingSchema = z.object({
	returnPolicy: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Policy di restituzione obbligatoria"
					: "Immetti una policy di restituzione valida",
		})
		.default("Return in 30 days."),
	defaultShippingService: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Servizio di spedizione obbligatorio"
					: "Immetti un servizio di spedizione valido",
		})
		.default("International Delivery"),
	defaultShippingFeePerItem: z
		.number({
			error: (issue) =>
				issue === undefined
					? "Fee per item obbligatorio"
					: "Immetti una fee per item valida",
		})
		.default(0),
	defaultShippingFeeForAdditionalItem: z
		.number({
			error: (issue) =>
				issue === undefined
					? "Fee per additional item obbligatorio"
					: "Immetti una fee per additional item valida",
		})
		.default(0),
	defaultShippingFeePerKg: z
		.number({
			error: (issue) =>
				issue === undefined
					? "Fee per kg obbligatorio"
					: "Immetti una fee per kg valida",
		})
		.default(0),
	defaultShippingFeeFixed: z
		.number({
			error: (issue) =>
				issue === undefined
					? "Fee fissa obbligatorio"
					: "Immetti una fee fissa valida",
		})
		.default(0),
	defaultDeliveryTimeMin: z
		.number({
			error: (issue) =>
				issue === undefined
					? "Tempo minimo di consegna obbligatorio"
					: "Immetti un tempo minimo di consegna valido",
		})
		.int()
		.default(7),
	defaultDeliveryTimeMax: z
		.number({
			error: (issue) =>
				issue === undefined
					? "Tempo massimo di consegna obbligatorio"
					: "Immetti un tempo massimo di consegna valido",
		})
		.int()
		.default(31),
});
