import { ShippingFeeMethod } from "@prisma/client";
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
		.regex(/^[a-zA-Z0-9\s]+$/, {
			message:
				"Only letters, numbers, and spaces are allowed in the category name.",
		}),
	image: z
		.object({
			url: z.string(),
		})
		.array()
		.length(1, "Choose a category image."),
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
				"Only letters, numbers, hyphen, and underscore are allowed in the category url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.",
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
		.regex(/^[a-zA-Z0-9\s]+$/, {
			message:
				"Only letters, numbers, and spaces are allowed in the subCategory name.",
		}),
	image: z
		.object({ url: z.string() })
		.array()
		.length(1, "Choose only one subCategory image"),
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
				"Only letters, numbers, hyphen, and underscore are allowed in the subCategory url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.",
		}),
	categoryId: z.string(),
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
	email: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Email store obbligatoria"
					: "Immetti un'email valida",
		})
		.email({ message: "Invalid email format." }),
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
	returnPolicy: z.string().min(1, "La politica di reso è obbligatoria.").default("Return in 30 days."),
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
		.regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_ -]+$/, {
			message:
				"Product name may only contain letters, numbers, spaces, hyphens, and underscores, without consecutive special characters.",
		}),
	description: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Descrizione prodotto obbligatoria"
					: "Immetti una descrizione valida",
		})
		.min(200, {
			message: "Descrizione prodotto deve essere almeno 200 caratteri lungo.",
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
		.max(100, { message: "Product variant name cannot exceed 100 characters." })
		.regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_ -]+$/, {
			message:
				"Product variant name may only contain letters, numbers, spaces, hyphens, and underscores, without consecutive special characters.",
		}),
	variantDescription: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Descrizione variant prodotto obbligatoria"
					: "Immetti una descrizione valida",
		})
		.optional(),
	images: z
		.object({ url: z.string() })
		.array()
		.min(3, "Please upload at least 3 images for the product.")
		.max(6, "You can upload up to 6 images for the product."),
	variantImage: z
		.object({ url: z.string() })
		.array()
		.length(1, "Choose a product variant image."),
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
		.uuid({
			error: (issue) =>
				issue === undefined
					? "ID tag offerta obbligatorio"
					: "Immetti un ID valido",
		})

		.optional(),
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
			message: "Product brand cannot exceed 50 characters.",
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
		message: "Please provide a valid product weight.",
	}),
	keywords: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Parole chiave prodotto obbligatorie"
					: "Immetti parole chiave valide",
		})
		.array()
		.min(5, {
			message: "Please provide at least 5 keywords.",
		})
		.max(10, {
			message: "You can provide up to 10 keywords.",
		}),
	colors: z
		.object({ color: z.string() })
		.array()
		.min(1, "Please provide at least one color.")
		.refine((colors) => colors.every((c) => c.color.length > 0), {
			message: "All color inputs must be filled.",
		}),
	sizes: z
		.object({
			size: z.string(),
			quantity: z
				.number()
				.min(1, { message: "Quantity must be greater than 0." }),
			price: z.number().min(0.01, { message: "Price must be greater than 0." }),
			discount: z.number().min(0).default(0),
		})
		.array()
		.min(1, "Please provide at least one size.")
		.refine(
			(sizes) =>
				sizes.every((s) => s.size.length > 0 && s.price > 0 && s.quantity > 0),
			{
				message: "All size inputs must be filled correctly.",
			}
		),
	product_specs: z
		.object({
			name: z.string(),
			value: z.string(),
		})
		.array()
		.min(1, "Please provide at least one product spec.")
		.refine(
			(product_specs) =>
				product_specs.every((s) => s.name.length > 0 && s.value.length > 0),
			{
				message: "All product specs inputs must be filled correctly.",
			}
		),
	variant_specs: z
		.object({
			name: z.string(),
			value: z.string(),
		})
		.array()
		.min(1, "Please provide at least one product variant spec.")
		.refine(
			(product_specs) =>
				product_specs.every((s) => s.name.length > 0 && s.value.length > 0),
			{
				message: "All product variant specs inputs must be filled correctly.",
			}
		),
	questions: z
		.object({
			question: z.string(),
			answer: z.string(),
		})
		.array()
		.min(1, "Please provide at least one product question.")
		.refine(
			(questions) =>
				questions.every((q) => q.question.length > 0 && q.answer.length > 0),
			{
				message: "All product question inputs must be filled correctly.",
			}
		),
	isSale: z.boolean().default(false),
	saleEndDate: z.string().optional(),
	freeShippingForAllCountries: z.boolean().default(false),
	freeShippingCountriesIds: z
		.object({
			id: z.string().optional(),
			label: z.string(),
			value: z.string(),
		})
		.array()
		.optional()
		.refine(
			(ids) => ids?.every((item) => item.label && item.value),
			"Each country must have a valid name and ID."
		)
		.default([]),
	shippingFeeMethod: z.nativeEnum(ShippingFeeMethod),
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
