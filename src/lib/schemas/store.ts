import * as z from "zod";

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
		.min(1, { message: "Address is required." }),

	address2: z.string().optional(),

	city: z.string({
		error: (issue) =>
			issue === undefined ? "Città obbligatoria" : "Immetti una città valida",
	}),

	state: z
		.string({
			error: (issue) =>
				issue === undefined
					? "Stato obbligatorio"
					: "Immetti uno stato valido",
		})
		.length(2, { message: "State code should be 2 characters long." }),

	zipCode: z
		.string({
			error: (issue) =>
				issue === undefined
					? "CAP obbligatorio"
					: "Immetti un CAP valido",
		})
		.min(5, { message: "ZIP code should be at least 5 characters." }),

	default: z.boolean().default(false),
});