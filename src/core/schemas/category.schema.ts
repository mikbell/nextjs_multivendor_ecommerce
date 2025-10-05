import * as z from "zod";
import { 
  requiredString, 
  slug, 
  description, 
  imageArray, 
  uuid,
  namePattern 
} from "./common.schema";

// Category form schema
export const CategoryFormSchema = z.object({
  name: requiredString("Nome categoria", 2, 50)
    .regex(namePattern, {
      message: "Solo lettere, numeri, spazi e caratteri speciali comuni sono consentiti nel nome categoria.",
    }),
  image: imageArray(1, 1, "immagine categoria"),
  url: slug("Categoria URL", 2, 50),
  slug: slug("Categoria", 2, 50),
  description: description("Categoria", 1, 500),
  featured: z.boolean().default(false),
});

// SubCategory form schema
export const SubCategoryFormSchema = z.object({
  name: requiredString("Nome sottocategoria", 2, 50)
    .regex(namePattern, {
      message: "Solo lettere, numeri, spazi e caratteri speciali comuni sono consentiti nel nome sottocategoria.",
    }),
  image: imageArray(1, 1, "immagine sottocategoria"),
  url: slug("Sottocategoria URL", 2, 50),
  slug: slug("Sottocategoria", 2, 50),
  categoryId: uuid("Categoria"),
  description: description("Sottocategoria", 1, 500),
  featured: z.boolean().default(false),
});

// OfferTag form schema
export const OfferTagFormSchema = z.object({
  name: requiredString("Nome tag offerta", 2, 50)
    .regex(namePattern, {
      message: "Solo lettere, numeri e spazi sono consentiti nel nome tag offerta.",
    }),
  url: slug("Tag offerta URL", 2, 50),
});

// Inferred types
export type CategoryFormData = z.infer<typeof CategoryFormSchema>;
export type SubCategoryFormData = z.infer<typeof SubCategoryFormSchema>;
export type OfferTagFormData = z.infer<typeof OfferTagFormSchema>;