import * as z from "zod";

// Schemi riutilizzabili per campi comuni
const CommonFormSchema = z.object({
	name: z
		.string()
		.min(3, "Il nome deve essere di almeno 3 caratteri.")
		.max(100, "Il nome deve essere di massimo 100 caratteri.")
		.regex(
			/^[a-zA-Z0-9\s.,'"+&()-]+$/,
			"Il nome può contenere solo lettere, numeri, spazi e caratteri speciali comuni (.,'\"+&()-)."
		),

	description: z
		.string()
		.min(10, "La descrizione deve essere di almeno 10 caratteri.")
		.max(5000, "La descrizione deve essere di massimo 5000 caratteri."),

	featured: z.boolean().default(false),
});

const SlugSchema = z
	.string()
	.min(3, "Lo slug deve essere di almeno 3 caratteri.")
	.max(120, "Lo slug deve essere di massimo 120 caratteri.")
	.regex(
		/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
		"Lo slug deve contenere solo lettere minuscole, numeri e trattini, senza spazi."
	);

const UrlSchema = z.url("Inserisci un URL valido.");

// Schemi specifici che usano i componenti riutilizzabili
export const CategoryFormSchema = CommonFormSchema.extend({
	image: UrlSchema.min(1, "L'immagine è obbligatoria."),
	slug: SlugSchema,
});

export const SubCategoryFormSchema = CommonFormSchema.extend({
	image: UrlSchema.min(1, "L'immagine è obbligatoria."),
	slug: SlugSchema,
	categoryId: z.string().min(1, "Seleziona una categoria."),
});

export const StoreFormSchema = z.object({
	name: z.string().min(1, "Inserisci un nome."),
	slug: SlugSchema,
	description: z.string().min(10, "Inserisci una descrizione più dettagliata."),
	email: z.email("Inserisci un'email valida."),
	phone: z
		.string()
		.regex(/^\+?[\d\s()-]{7,20}$/, "Inserisci un numero di telefono valido."),
	logo: UrlSchema.min(1, "Il logo è obbligatorio."),
	cover: UrlSchema.min(1, "La copertina è obbligatoria."),
	featured: z.boolean().default(false),
	averageRating: z.number().min(0).max(5).default(0),
	returnPolicy: z
		.string()
		.min(20, "Inserisci una politica di restituzione dettagliata."),
	defaultShippingService: z
		.string()
		.min(3, "Il servizio di spedizione è obbligatorio."),
	defaultShippingFee: z
		.number()
		.min(0, "La tariffa di spedizione non può essere negativa.")
		.default(0),
	defaultDeliveryTimeMin: z
		.number()
		.int()
		.min(0, "Il tempo minimo di consegna non può essere negativo.")
		.default(0),
	defaultDeliveryTimeMax: z
		.number()
		.int()
		.min(0, "Il tempo massimo di consegna non può essere negativo.")
		.default(0),
});

// Schemi per i componenti del prodotto
const ProductVariantSizeSchema = z.object({
	size: z
		.string()
		.min(1, "Inserisci una taglia.")
		.max(20, "La taglia è troppo lunga."),
	quantity: z.number().int().min(0, "La quantità non può essere negativa."),
});

const ProductVariantImageSchema = z.object({
	url: UrlSchema.min(1, "L'URL dell'immagine è obbligatorio."),
	alt: z.string().max(100, "Il testo alternativo è troppo lungo.").optional(),
});

const ProductVariantColorSchema = z.object({
	name: z
		.string()
		.min(1, "Inserisci un nome per il colore.")
		.max(50, "Il nome del colore è troppo lungo."),
	code: z
		.string()
		.regex(
			/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
			"Inserisci un codice esadecimale valido."
		)
		.max(7, "Il codice del colore non è valido."),
});

export const ProductVariantFormSchema = z.object({
	name: z
		.string()
		.min(1, "Il nome della variante è obbligatorio.")
		.max(100, "Il nome della variante è troppo lungo."),
	description: z
		.string()
		.min(10, "La descrizione della variante è obbligatoria.")
		.max(2000, "La descrizione della variante è troppo lunga."),
	slug: SlugSchema,
	isOnSale: z.boolean().default(false),
	keywords: z
		.string()
		.min(3, "Le parole chiave sono obbligatorie.")
		.max(255, "Le parole chiave sono troppo lunghe."),
	sku: z
		.string()
		.min(5, "Lo SKU deve essere di almeno 5 caratteri.")
		.max(50, "Lo SKU è troppo lungo."),
	mainImage: UrlSchema.min(1, "L'immagine principale è obbligatoria."),
	price: z.number().min(0.01, "Il prezzo deve essere maggiore di zero."),
	sizes: z.array(ProductVariantSizeSchema).optional(),
	images: z.array(ProductVariantImageSchema).optional(),
	colors: z.array(ProductVariantColorSchema).optional(),
	productId: z.string().optional(),
});

// Schema principale per la creazione o l'aggiornamento di un prodotto
export const ProductFormSchema = z.object({
	name: z
		.string()
		.min(1, "Il nome del prodotto è obbligatorio.")
		.max(255, "Il nome del prodotto è troppo lungo."),
	description: z
		.string()
		.min(10, "La descrizione del prodotto è obbligatoria.")
		.max(5000, "La descrizione del prodotto è troppo lunga."),
	slug: SlugSchema,
	brand: z
		.string()
		.min(1, "Il brand è obbligatorio.")
		.max(100, "Il brand è troppo lungo."),
	storeId: z.string().min(1, "L'ID del negozio è obbligatorio."),
	categoryId: z.string().min(1, "L'ID della categoria è obbligatorio."),
	subCategoryId: z
		.string()
		.min(1, "L'ID della sotto-categoria è obbligatorio."),
	rating: z.number().min(0).max(5).optional().default(0),
	variants: z
		.array(ProductVariantFormSchema)
		.min(1, "Devi aggiungere almeno una variante.")
		.max(20, "Puoi aggiungere un massimo di 20 varianti."),
});

// Inferenza dei tipi per i nuovi schemi
export type ProductVariantFormSchemaType = z.infer<
	typeof ProductVariantFormSchema
>;
export type ProductFormSchemaType = z.infer<typeof ProductFormSchema>;
// Tipi aggiuntivi utili per l'integrazione con React Hook Form e zodResolver
// input: tipo accettato in input dal resolver (può includere undefined per i campi con default)
export type ProductFormSchemaInputType = z.input<typeof ProductFormSchema>;
// output: tipo dopo la validazione/parse (i default vengono applicati)
export type ProductFormSchemaOutputType = z.output<typeof ProductFormSchema>;
