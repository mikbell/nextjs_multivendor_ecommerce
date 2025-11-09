import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { v4 } from "uuid";

// Schema and types
import { ProductFormSchema } from "@/lib/schemas";
import { ProductWithVariantType } from "@/lib/types";
import { CountryOption, ProductFormData } from "../types";

// Using the shared ProductFormData type instead of local definition

// Queries
import { upsertProduct } from "@/queries/product";
import { getAllCategoriesForCategory } from "@/queries/category";

// Types
import { Category, Country, OfferTag, SubCategory } from "@prisma/client";

interface UseProductFormProps {
  data?: Partial<ProductWithVariantType>;
  categories: Category[];
  offerTags: OfferTag[];
  storeUrl: string;
  countries: Country[];
}

export const useProductForm = ({
  data,
  storeUrl,
  countries,
}: UseProductFormProps) => {
  const router = useRouter();

  // Is new variant page - only if we have BOTH productId and name (existing product) but no variantId
  const isNewVariantPage = Boolean(data?.productId && data?.name && !data?.variantId);

  // Debug flag to show all fields (for development purposes)
  const debugForceShowAllFields = process.env.NODE_ENV === "development" && false;

  // State for subCategories
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  // State for colors
  const [colors, setColors] = useState<{ color: string }[]>(
    data?.colors || [{ color: "" }]
  );

  // State for sizes
  const [sizes, setSizes] = useState<
    { size: string; price: number; quantity: number; discount: number }[]
  >(data?.sizes || [{ size: "", quantity: 1, price: 0.01, discount: 0 }]);

  // State for product specs
  const [productSpecs, setProductSpecs] = useState<
    { name: string; value: string }[]
  >(data?.product_specs && data.product_specs.length > 0 
    ? data.product_specs 
    : [{ name: "Materiale", value: "" }]);

  // State for product variant specs
  const [variantSpecs, setVariantSpecs] = useState<
    { name: string; value: string }[]
  >(data?.variant_specs && data.variant_specs.length > 0 
    ? data.variant_specs 
    : [{ name: "Colore", value: "" }]);

  // State for questions
  const [questions, setQuestions] = useState<
    { question: string; answer: string }[]
  >(data?.questions && data.questions.length > 0 
    ? data.questions 
    : [{ question: "Quali sono le dimensioni del prodotto?", answer: "" }]);

  // Handle keywords input
  const [keywords, setKeywords] = useState<string[]>(
    data?.keywords && data.keywords.length >= 5 
      ? data.keywords 
      : ["prodotto", "vendita", "qualità", "conveniente", "nuovo"]
  );

  // Now using the shared ProductFormSchema for validation

  // Create base default values using current React states
  const getInitialValues = (): ProductFormData => {
    const baseDefaults: ProductFormData = {
      name: data?.name ?? "",
      description: data?.description ?? "",
      variantName: data?.variantName ?? "",
      variantDescription: data?.variantDescription ?? "",
      images: data?.images ?? [],
      variantImage: data?.variantImage ? [{ url: data.variantImage }] : [],
      categoryId: data?.categoryId ?? "",
      offerTagId: data?.offerTagId ?? "",
      subCategoryId: data?.subCategoryId ?? "",
      brand: data?.brand ?? "",
      sku: data?.sku ?? "",
      colors: colors, // Use React state
      sizes: sizes, // Use React state
      product_specs: productSpecs, // Use React state
      variant_specs: variantSpecs, // Use React state
      keywords: keywords, // Use React state
      questions: questions, // Use React state
      isSale: data?.isSale ?? false,
      weight: data?.weight ?? 0.01,
      saleEndDate: data?.saleEndDate ?? format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      freeShippingForAllCountries: data?.freeShippingForAllCountries ?? false,
      freeShippingCountriesIds: data?.freeShippingCountriesIds ?? [],
      shippingFeeMethod: (data?.shippingFeeMethod as "ITEM" | "WEIGHT" | "FIXED") ?? "ITEM",
    };
    
    return baseDefaults;
  };
  
  // Form hook for managing form state and validation
  const form = useForm<ProductFormData>({
    mode: "onChange", // Form validation mode
    resolver: zodResolver(ProductFormSchema),
    defaultValues: getInitialValues(), // Get initial values with data if available
  });

  // Provide simple static values for form progress and quality checks
  // These were causing infinite loops when calculated dynamically
  const formProgress = 0; // Simplified to avoid loops
  const qualityChecks = {
    checks: {
      hasGoodTitle: false,
      hasDetailedDescription: false,
      hasEnoughImages: false,
      hasCompetitivePrice: false,
      hasStock: false,
      hasGoodKeywords: false,
      hasBrand: false,
      hasValidWeight: false,
    },
    passedChecks: 0,
    totalChecks: 8,
    score: 0,
  };

  // UseEffect to get subCategories when user pick/change a category
  const watchedCategoryId = form.watch("categoryId");
  useEffect(() => {
    const getSubCategories = async () => {
      if (watchedCategoryId && watchedCategoryId.trim() !== "") {
        const res = await getAllCategoriesForCategory(watchedCategoryId);
        setSubCategories(res);
        // Reset subcategory when category changes
        form.setValue("subCategoryId", "");
      } else {
        setSubCategories([]);
        form.setValue("subCategoryId", "");
      }
    };
    getSubCategories();
  }, [watchedCategoryId, form]);

  // Extract errors state from form
  const errors = form.formState.errors;

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;


  // Keywords handling
  const handleAddition = useCallback((keyword: { id: string; className: string; [key: string]: string }) => {
    if (keywords.length === 10) return;
    // Cerca il testo nel campo 'text' o 'label' o usa l'id come fallback
    const text = keyword.text || keyword.label || keyword.id;
    if (!text) return;
    const newKeywords = [...keywords, text];
    setKeywords(newKeywords);
    form.setValue("keywords", newKeywords as never);
  }, [keywords, form]);

  const handleDeleteKeyword = useCallback((i: number) => {
    const newKeywords = keywords.filter((_, index) => index !== i);
    setKeywords(newKeywords);
    form.setValue("keywords", newKeywords as never);
  }, [keywords, form]);
  
  // Enhanced handlers that sync both React state and form state
  const setColorsAndForm = useCallback((newColors: { color: string }[]) => {
    setColors(newColors);
    form.setValue("colors", newColors as never);
  }, [form]);
  
  const setSizesAndForm = useCallback((newSizes: { size: string; price: number; quantity: number; discount: number }[]) => {
    setSizes(newSizes);
    form.setValue("sizes", newSizes as never);
  }, [form]);
  
  const setProductSpecsAndForm = useCallback((newSpecs: { name: string; value: string }[]) => {
    setProductSpecs(newSpecs);
    form.setValue("product_specs", newSpecs as never);
  }, [form]);
  
  const setVariantSpecsAndForm = useCallback((newSpecs: { name: string; value: string }[]) => {
    setVariantSpecs(newSpecs);
    form.setValue("variant_specs", newSpecs as never);
  }, [form]);
  
  const setQuestionsAndForm = useCallback((newQuestions: { question: string; answer: string }[]) => {
    setQuestions(newQuestions);
    form.setValue("questions", newQuestions as never);
  }, [form]);
  
  const setKeywordsAndForm = useCallback((newKeywords: string[]) => {
    setKeywords(newKeywords);
    form.setValue("keywords", newKeywords as never);
  }, [form]);

  // SOLUTION: Instead of syncing React state with form state, we'll let the form components
  // manage their own state directly through React Hook Form's setValue and watch methods.
  // This eliminates the need for separate React state and prevents infinite loops.

  //Countries options
  const countryOptions: CountryOption[] = countries.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const handleDeleteCountryFreeShipping = useCallback((index: number) => {
    const currentValues = form.getValues().freeShippingCountriesIds || [];
    const updatedValues = currentValues.filter((_, i) => i !== index);
    form.setValue("freeShippingCountriesIds", updatedValues);
  }, [form]);

  // Form submit handler
  const onSubmit = form.handleSubmit(
    async (values) => {
      console.log("Debug - Form submission started");
      console.log("Debug - Raw form values:", values);
      
      // Direct check of form values before processing
      const directValues = form.getValues();
      console.log("Debug - Direct form.getValues():", {
        name: `'${directValues.name}' (type: ${typeof directValues.name})`,
        variantName: `'${directValues.variantName}' (type: ${typeof directValues.variantName})`,
        brand: `'${directValues.brand}' (type: ${typeof directValues.brand})`,
        description: `'${directValues.description}' (type: ${typeof directValues.description})`,
        categoryId: `'${directValues.categoryId}' (type: ${typeof directValues.categoryId})`,
      });
      console.log("Debug - Complete form values:", {
        name: `'${values.name}' (type: ${typeof values.name}, length: ${values.name?.length})`,
        variantName: `'${values.variantName}' (type: ${typeof values.variantName}, length: ${values.variantName?.length})`,
        brand: `'${values.brand}' (type: ${typeof values.brand}, length: ${values.brand?.length})`,
        description: `'${values.description}' (type: ${typeof values.description}, length: ${values.description?.length})`,
        categoryId: `'${values.categoryId}' (type: ${typeof values.categoryId}, length: ${values.categoryId?.length})`,
        subCategoryId: `'${values.subCategoryId}' (type: ${typeof values.subCategoryId}, length: ${values.subCategoryId?.length})`,
        sku: values.sku,
        weight: values.weight,
        isNewVariantPage: isNewVariantPage,
        images: values.images?.length,
        variantImage: values.variantImage?.length,
      });
      
      // Debug form state
      console.log("Debug - Form errors:", form.formState.errors);
      console.log("Debug - Form isDirty:", form.formState.isDirty);
      console.log("Debug - Form isValid:", form.formState.isValid);

      // Create final values with defaults
      const finalValues = {
        ...values,
        sku: values.sku || `SKU-${Date.now()}`,
        weight:
          values.weight && values.weight > 0
            ? values.weight
            : 0.1,
      };

      // Basic validation
      if (isNewVariantPage) {
        if (!finalValues.variantName) {
          toast.error("Nome variante è obbligatorio");
          return;
        }
      } else {
        // For full product creation (not new variant page)
        console.log("Debug - Validation check values:", {
          name: finalValues.name,
          nameType: typeof finalValues.name,
          nameLength: finalValues.name?.length,
          variantName: finalValues.variantName,
          variantNameType: typeof finalValues.variantName,
          variantNameLength: finalValues.variantName?.length,
          brand: finalValues.brand,
          brandType: typeof finalValues.brand,
          brandLength: finalValues.brand?.length,
          description: finalValues.description,
          descriptionType: typeof finalValues.description,
          descriptionLength: finalValues.description?.length,
          isNewVariantPage: isNewVariantPage,
          data: data
        });
        
        // Helper function to check if a string field is truly empty
        const isEmpty = (value: unknown): boolean => {
          return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
        };
        
        // Check if the form is completely untouched (all default empty values)
        const isFormEmpty = isEmpty(finalValues.name) && 
                           isEmpty(finalValues.variantName) && 
                           isEmpty(finalValues.brand) && 
                           isEmpty(finalValues.description) && 
                           isEmpty(finalValues.categoryId) && 
                           isEmpty(finalValues.subCategoryId);
                           
        if (isFormEmpty) {
          toast.error(
            "Compila almeno i campi principali prima di salvare",
            {
              description: "Inizia inserendo il nome del prodotto, la variante e la marca. Usa i menu 💡 per consigli utili.",
              duration: 6000,
            }
          );
          return;
        }
        
        // Step 1: Campi assolutamente essenziali
        const essentialFields = [];
        if (isEmpty(finalValues.name))
          essentialFields.push("Nome prodotto");
        if (isEmpty(finalValues.variantName))
          essentialFields.push("Nome variante");
        if (isEmpty(finalValues.brand)) 
          essentialFields.push("Marca");
        
        // Step 2: Campi molto importanti  
        const importantFields = [];
        if (isEmpty(finalValues.description))
          importantFields.push("Descrizione");
        if (isEmpty(finalValues.categoryId))
          importantFields.push("Categoria");
        if (isEmpty(finalValues.subCategoryId))
          importantFields.push("Sottocategoria");
        
        // Priority 1: Check essential fields first
        if (essentialFields.length > 0) {
          console.log("Debug - Essential fields missing:", essentialFields);
          toast.error(
            "Campi essenziali mancanti",
            {
              description: `Completa prima: ${essentialFields.join(
                ", "
              )}. Questi sono i campi minimi per creare un prodotto.`,
              duration: 6000,
            }
          );
          return;
        }
        
        // Priority 2: Check important fields  
        if (importantFields.length > 0) {
          console.log("Debug - Important fields missing:", importantFields);
          toast.error(
            "Campi importanti mancanti",
            {
              description: `Aggiungi anche: ${importantFields.join(
                ", "
              )}. Usa i consigli 💡 per aiuto.`,
              duration: 6000,
            }
          );
          return;
        }
        
        // Priority 3: Check additional required fields (only if basic fields are OK)
        const additionalMissingFields = [];
        if (!finalValues.images || finalValues.images.length < 3)
          additionalMissingFields.push("Almeno 3 immagini del prodotto");
        if (!finalValues.variantImage || finalValues.variantImage.length !== 1)
          additionalMissingFields.push("Un'immagine per la variante");
        if (!finalValues.keywords || finalValues.keywords.length < 5)
          additionalMissingFields.push("Almeno 5 parole chiave");
        
        // Check product specs
        if (!finalValues.product_specs || finalValues.product_specs.length === 0 ||
            !finalValues.product_specs.every(spec => spec.name.trim() !== "" && spec.value.trim() !== ""))
          additionalMissingFields.push("Specifiche prodotto complete");
        
        // Check variant specs
        if (!finalValues.variant_specs || finalValues.variant_specs.length === 0 ||
            !finalValues.variant_specs.every(spec => spec.name.trim() !== "" && spec.value.trim() !== ""))
          additionalMissingFields.push("Specifiche variante complete");
        
        // Check questions
        if (!finalValues.questions || finalValues.questions.length === 0 ||
            !finalValues.questions.every(q => q.question.trim() !== "" && q.answer.trim() !== ""))
          additionalMissingFields.push("Domande e risposte complete");
        
        // Check colors
        if (!finalValues.colors || finalValues.colors.length === 0 ||
            !finalValues.colors.every(c => c.color.trim() !== ""))
          additionalMissingFields.push("Almeno un colore");
        
        // Check sizes
        if (!finalValues.sizes || finalValues.sizes.length === 0 ||
            !finalValues.sizes.every(s => s.size.trim() !== "" && s.price > 0 && s.quantity > 0))
          additionalMissingFields.push("Almeno una taglia con prezzo e quantità validi");
        
        console.log("Debug - Additional missing fields:", additionalMissingFields);
        
        if (additionalMissingFields.length > 0) {
          toast.error(
            "Completa tutti i dettagli del prodotto",
            {
              description: `Mancano ancora: ${additionalMissingFields.join(
                ", "
              )}. 🎆 Stai quasi finendo!`,
              duration: 8000,
            }
          );
          return;
        }

      }

      try {
        // Per le nuove varianti, usa i valori del prodotto esistente dove necessario
        const productData = {
          productId: data?.productId ? data.productId : v4(),
          variantId: data?.variantId ? data.variantId : v4(),
          // Per nuove varianti, usa i dati del prodotto esistente
          name: finalValues.name || data?.name || "",
          description: finalValues.description || data?.description || "",
          variantName: finalValues.variantName,
          variantDescription: finalValues.variantDescription || "",
          images: finalValues.images,
          variantImage: finalValues.variantImage?.[0]?.url || "",
          categoryId: finalValues.categoryId || data?.categoryId || "",
          subCategoryId: finalValues.subCategoryId || data?.subCategoryId || "",
          offerTagId: finalValues.offerTagId || "",
          isSale: finalValues.isSale,
          saleEndDate: finalValues.saleEndDate,
          brand: finalValues.brand || data?.brand || "",
          sku: finalValues.sku,
          weight: finalValues.weight,
          colors: finalValues.colors,
          sizes: finalValues.sizes,
          product_specs: finalValues.product_specs,
          variant_specs: finalValues.variant_specs,
          keywords: finalValues.keywords,
          questions: finalValues.questions,
          shippingFeeMethod: finalValues.shippingFeeMethod,
          freeShippingForAllCountries: finalValues.freeShippingForAllCountries,
          freeShippingCountriesIds: finalValues.freeShippingCountriesIds || [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        console.log("Debug - Final product data for upsert:", productData);
        
        await upsertProduct(productData, storeUrl);

        toast.success(
          data?.productId && data?.variantId
            ? "Prodotto aggiornato con successo! 🎉"
            : "Congratulazioni! Il prodotto è stato creato con successo! 🎉",
          {
            description:
              "Il tuo prodotto è ora disponibile nel tuo negozio.",
            duration: 5000,
          }
        );

        if (data?.productId && data?.variantId) {
          router.refresh();
        } else {
          router.push(
            `/dashboard/seller/stores/${storeUrl}/products`
          );
        }
      } catch (error: unknown) {
        console.log(error);
        toast.error(
          error instanceof Error ? error.message : String(error)
        );
      }
    },
    (errors) => {
      console.log("Debug - Form validation errors:", errors);
      toast.error(
        "Si sono verificati errori nella validazione del form. Controlla i campi richiesti."
      );
    }
  );

  const saleEndDate = form.getValues().saleEndDate || new Date().toISOString();
  const formattedDate = new Date(saleEndDate).toLocaleString("en-Us", {
    weekday: "short",
    month: "long",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return {
    // Form
    form,
    onSubmit,
    isLoading,
    errors,
    
    // Page state
    isNewVariantPage,
    debugForceShowAllFields,
    
    // Progress and quality
    formProgress,
    qualityChecks,
    
    // Categories
    subCategories,
    
    // Product state - using enhanced handlers that sync with form
    colors,
    setColors: setColorsAndForm,
    sizes,
    setSizes: setSizesAndForm,
    productSpecs,
    setProductSpecs: setProductSpecsAndForm,
    variantSpecs,
    setVariantSpecs: setVariantSpecsAndForm,
    questions,
    setQuestions: setQuestionsAndForm,
    
    // Keywords - using enhanced handlers
    keywords,
    setKeywords: setKeywordsAndForm,
    handleAddition,
    handleDeleteKeyword,
    
    // Countries
    countryOptions,
    handleDeleteCountryFreeShipping,
    
    // Date formatting
    formattedDate,
  };
};