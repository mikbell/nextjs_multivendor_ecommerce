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

	image: z
		.object({
			url: z.string(),
		})
		.array()
		.min(1, "Carica almeno un'immagine.")
		.max(1, "Carica al massimo un'immagine."),

	url: z
		.url({
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

export type CategoryFormSchemaType = z.infer<typeof CategoryFormSchema>;
