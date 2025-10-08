import * as z from "zod";

// Common validation patterns
export const slugPattern = /^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/;
export const phonePattern = /^\+?\d+$/;
export const namePattern = /^[a-zA-Z0-9À-ÿ\s&$.%,']+$/;
export const urlSafePattern = /^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/;

// Common field schemas
export const requiredString = (fieldName: string, min = 1, max = 255) =>
  z
    .string({
      message: `${fieldName} è obbligatorio`,
    })
    .min(min, `${fieldName} deve essere almeno ${min} caratteri`)
    .max(max, `${fieldName} non può superare ${max} caratteri`);

export const optionalString = (max = 255) =>
  z.string().max(max).optional();

export const email = z
  .string({
    message: "Email è obbligatoria",
  })
  .email("Formato email non valido");

export const phone = z
  .string({
    message: "Numero di telefono è obbligatorio",
  })
  .regex(phonePattern, "Formato numero di telefono non valido");

export const slug = (fieldName: string, min = 2, max = 50) =>
  z
    .string({
      message: `${fieldName} slug è obbligatorio`,
    })
    .min(min, `${fieldName} slug deve essere almeno ${min} caratteri`)
    .max(max, `${fieldName} slug non può superare ${max} caratteri`)
    .regex(
      slugPattern,
      `${fieldName} slug può contenere solo lettere, numeri, trattini e underscore, senza caratteri consecutivi`
    );

export const description = (fieldName: string, min = 10, max = 500) =>
  z
    .string({
      message: `${fieldName} descrizione è obbligatoria`,
    })
    .min(min, `${fieldName} descrizione deve essere almeno ${min} caratteri`)
    .max(max, `${fieldName} descrizione non può superare ${max} caratteri`);

export const imageArray = (min = 1, max = 1, fieldName = "Immagine") =>
  z
    .object({ url: z.string().url("URL immagine non valido") })
    .array()
    .min(min, `Seleziona almeno ${min} ${fieldName.toLowerCase()}`)
    .max(max, `Puoi caricare massimo ${max} ${fieldName.toLowerCase()}`);

export const positiveNumber = (fieldName: string, min = 0.01) =>
  z
    .number({
      message: `${fieldName} è obbligatorio`,
    })
    .min(min, `${fieldName} deve essere almeno ${min}`);

export const positiveInteger = (fieldName: string, min = 1) =>
  z
    .number({
      message: `${fieldName} è obbligatorio`,
    })
    .int(`${fieldName} deve essere un numero intero`)
    .min(min, `${fieldName} deve essere almeno ${min}`);

export const uuid = (fieldName: string) =>
  z
    .string({
      message: `${fieldName} ID è obbligatorio`,
    })
    .uuid(`${fieldName} ID non valido`);

export const optionalUuid = (fieldName: string) =>
  z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || z.string().uuid().safeParse(val).success,
      {
        message: `${fieldName} ID non valido o lascia vuoto`,
      }
    );

// Date validation
export const dateString = (fieldName: string) =>
  z
    .string({
      message: `${fieldName} è obbligatoria`,
    })
    .datetime(`${fieldName} deve essere in formato data valido`);

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Search schema
export const searchSchema = z.object({
  query: z.string().min(1, "Query di ricerca è obbligatoria"),
  filters: z.record(z.string(), z.any()).optional(),
});

// Common response schemas
export const successResponseSchema = z.object({
  success: z.literal(true),
  data: z.any(),
  message: z.string().optional(),
});

export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    message: z.string(),
    statusCode: z.number(),
    errors: z.record(z.string(), z.array(z.string())).optional(),
  }),
});