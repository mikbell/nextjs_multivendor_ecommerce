import * as z from "zod";

// Category form schema
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
		.max(1, "Puoi caricare solo un'immagine per categoria.")
		.optional()
		.default([]),
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
	featured: z.boolean(),
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
	featured: z.boolean(),
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