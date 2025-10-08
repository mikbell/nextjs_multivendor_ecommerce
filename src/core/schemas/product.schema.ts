import * as z from "zod";
import { $Enums } from "@prisma/client";
import { 
  requiredString, 
  description, 
  imageArray, 
  uuid, 
  optionalUuid,
  positiveNumber,
  positiveInteger,
  namePattern 
} from "./common.schema";

// Product form schema
export const ProductFormSchema = z.object({
  name: requiredString("Nome prodotto", 2, 200)
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9À-ÿ\s&$.%,'-]+$/, {
      message: "Il nome prodotto può contenere solo lettere, numeri, spazi e caratteri speciali comuni, senza caratteri consecutivi.",
    }),
  
  description: description("Prodotto", 20, 200),
  
  variantName: requiredString("Nome variante prodotto", 2, 100)
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9À-ÿ\s&$.%,'-]+$/, {
      message: "Nome variante può contenere solo lettere, numeri, spazi e caratteri speciali comuni, senza caratteri consecutivi.",
    }),
  
  variantDescription: z.string().optional(),
  
  images: imageArray(3, 6, "immagini prodotto"),
  
  variantImage: imageArray(1, 1, "immagine variante"),
  
  categoryId: uuid("Categoria"),
  
  subCategoryId: uuid("Sottocategoria"),
  
  offerTagId: optionalUuid("Tag offerta"),
  
  brand: requiredString("Marca prodotto", 2, 50),
  
  sku: requiredString("SKU prodotto", 6, 50),
  
  weight: positiveNumber("Peso prodotto", 0.01),
  
  keywords: z
    .string()
    .min(1, "Ogni parola chiave deve contenere almeno un carattere")
    .array()
    .min(5, "Inserisci almeno 5 parole chiave")
    .max(10, "Puoi inserire massimo 10 parole chiave"),
  
  colors: z
    .object({ color: z.string().min(1, "Colore obbligatorio") })
    .array()
    .min(1, "Inserisci almeno un colore")
    .refine((colors) => colors.every((c) => c.color.length > 0), {
      message: "Tutti i campi colore devono essere compilati.",
    }),
  
  sizes: z
    .object({
      size: z.string().min(1, "Specifica una taglia valida"),
      quantity: positiveInteger("Quantità", 1),
      price: positiveNumber("Prezzo", 0.01),
      discount: z.number().min(0, "Lo sconto deve essere positivo"),
    })
    .array()
    .min(1, "Inserisci almeno una taglia")
    .refine(
      (sizes) => sizes.every((s) => s.size.length > 0 && s.price > 0 && s.quantity > 0),
      {
        message: "Tutti i campi delle taglie devono essere compilati correttamente (taglia, prezzo > 0, quantità > 0).",
      }
    ),
  
  product_specs: z
    .object({
      name: z.string().min(1, "Nome specifica obbligatorio"),
      value: z.string().min(1, "Valore specifica obbligatorio"),
    })
    .array()
    .min(1, "Inserisci almeno una specifica del prodotto")
    .refine(
      (specs) => specs.every((s) => s.name.length > 0 && s.value.length > 0),
      {
        message: "Tutte le specifiche del prodotto devono essere compilate correttamente.",
      }
    ),
  
  variant_specs: z
    .object({
      name: z.string().min(1, "Nome specifica obbligatorio"),
      value: z.string().min(1, "Valore specifica obbligatorio"),
    })
    .array()
    .min(1, "Inserisci almeno una specifica della variante")
    .refine(
      (specs) => specs.every((s) => s.name.length > 0 && s.value.length > 0),
      {
        message: "Tutte le specifiche della variante devono essere compilate correttamente.",
      }
    ),
  
  questions: z
    .object({
      question: z.string().min(1, "Domanda obbligatoria"),
      answer: z.string().min(1, "Risposta obbligatoria"),
    })
    .array()
    .min(1, "Inserisci almeno una domanda sul prodotto")
    .refine(
      (questions) => questions.every((q) => q.question.length > 0 && q.answer.length > 0),
      {
        message: "Tutte le domande e risposte devono essere compilate correttamente.",
      }
    ),
  
  isSale: z.boolean().default(false),
  
  saleEndDate: z.string().optional(),
  
  freeShippingForAllCountries: z.boolean().default(false),
  
  freeShippingCountriesIds: z
    .object({
      label: z.string().min(1, "Nome paese obbligatorio"),
      value: z.string().min(1, "ID paese obbligatorio"),
    })
    .array()
    .default([])
    .refine(
      (ids) => ids.every((item) => item.label && item.value),
      "Ogni paese deve avere un nome e ID validi"
    ),
  
  shippingFeeMethod: z.nativeEnum($Enums.ProductShippingFeeMethod),
});

// Add review schema
export const AddReviewSchema = z.object({
  variantName: z.string().min(1, "Variante è obbligatoria"),
  rating: positiveInteger("Rating", 1).max(5, "Il rating non può superare 5"),
  size: z.string().min(1, "Seleziona una taglia"),
  review: z
    .string()
    .min(10, "La recensione deve essere di almeno 10 caratteri"),
  quantity: z.string().default("1"),
  images: imageArray(0, 3, "immagini recensione"),
  color: z.string().min(1, "Colore obbligatorio"),
});

// Inferred types
export type ProductFormData = z.infer<typeof ProductFormSchema>;
export type ReviewFormData = z.infer<typeof AddReviewSchema>;