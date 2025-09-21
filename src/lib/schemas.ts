import * as z from "zod";

export const CategoryFormSchema = z.object({
	name: z
		.string({
			error: (issue) =>
				issue.input === undefined
					? "Inserisci un nome."
					: "Inserisci un nome valido.",
		})
		.min(3, "Il nome deve essere di almeno 3 caratteri.")
		.max(50, "Il nome deve essere di massimo 50 caratteri.")
		.regex(/^[a-zA-Z0-9 ]+$/, {
			message: "Il nome deve contenere solo lettere, numeri e spazi.",
		}),

	description: z
		.string({
			error: (issue) =>
				issue.input === undefined
					? "Inserisci una descrizione."
					: "Inserisci una descrizione valida.",
		})
		.min(3, "La descrizione deve essere di almeno 3 caratteri.")
		.max(500, "La descrizione deve essere di massimo 500 caratteri."),

	image: z
		.object({
			url: z.string(),
		})
		.array()
		.length(1, "Carica un'immagine per la categoria."),

	slug: z
		.string({
			error: (issue) =>
				issue.input === undefined
					? "Inserisci un URL."
					: "Inserisci un URL valido.",
		})
		.min(3, "L'URL della categoria deve essere di almeno 3 caratteri")
		.max(50, "L'URL della categoria deve essere di massimo 50 caratteri")
		.regex(/^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9]+)*$/, {
			message:
				"L'URL della categoria deve contenere solo lettere, numeri, spazi e trattini.",
		}),
	featured: z.boolean().default(false),
});

export const SubCategoryFormSchema = z.object({
	name: z
		.string({
			error: (issue) =>
				issue.input === undefined
					? "Inserisci un nome."
					: "Inserisci un nome valido.",
		})
		.min(3, "Il nome deve essere di almeno 3 caratteri.")
		.max(50, "Il nome deve essere di massimo 50 caratteri.")
		.regex(/^[a-zA-Z0-9 ]+$/, {
			message: "Il nome deve contenere solo lettere, numeri e spazi.",
		}),

	description: z
		.string({
			error: (issue) =>
				issue.input === undefined
					? "Inserisci una descrizione."
					: "Inserisci una descrizione valida.",
		})
		.min(3, "La descrizione deve essere di almeno 3 caratteri.")
		.max(500, "La descrizione deve essere di massimo 500 caratteri."),

	image: z
		.object({
			url: z.string(),
		})
		.array()
		.length(1, "Carica un'immagine per la sotto-categoria."),

	slug: z
		.string({
			error: (issue) =>
				issue.input === undefined
					? "Inserisci un URL."
					: "Inserisci un URL valido.",
		})
		.min(3, "L'URL della sotto-categoria deve essere di almeno 3 caratteri")
		.max(50, "L'URL della sotto-categoria deve essere di massimo 50 caratteri")
		.regex(/^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9]+)*$/, {
			message:
				"L'URL della sotto-categoria deve contenere solo lettere, numeri, spazi e trattini.",
		}),
	featured: z.boolean().default(false),
	categoryId: z.string().min(1, "Seleziona una categoria."),
});

export type CategoryFormSchemaType = z.infer<typeof CategoryFormSchema>;
export type SubCategoryFormSchemaType = z.infer<typeof SubCategoryFormSchema>;
