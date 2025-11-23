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
import { Country, SubCategory } from "@prisma/client";

interface UseProductFormProps {
  data?: Partial<ProductWithVariantType>;
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

  // Calculate form progress based on field completion
  const calculateFormProgress = useCallback(() => {
    const values = form.getValues();
    let completed = 0;
    const total = 13;

    // Basic info (3 points)
    if (values.name && values.name.trim().length >= 2) completed++;
    if (values.description && values.description.trim().length >= 20) completed++;
    if (values.brand && values.brand.trim().length >= 2) completed++;

    // Categories (2 points)
    if (values.categoryId && values.categoryId.trim()) completed++;
    if (values.subCategoryId && values.subCategoryId.trim()) completed++;

    // Variant info (2 points)
    if (values.variantName && values.variantName.trim().length >= 2) completed++;
    if (values.sku && values.sku.trim().length >= 6) completed++;

    // Images (2 points)
    if (values.images && values.images.length >= 3) completed++;
    if (values.variantImage && values.variantImage.length === 1) completed++;

    // Variant details (2 points)
    if (values.colors && values.colors.length > 0 && values.colors.every(c => c.color.trim())) completed++;
    if (values.sizes && values.sizes.length > 0 && values.sizes.every(s => s.size && s.price > 0 && s.quantity > 0)) completed++;

    // Keywords (1 point)
    if (values.keywords && values.keywords.length >= 5) completed++;

    // Weight (1 point)
    if (values.weight && values.weight >= 0.01) completed++;

    return Math.round((completed / total) * 100);
  }, [form]);

  const [formProgress, setFormProgress] = useState(0);

  // Update progress on form change
  useEffect(() => {
    const subscription = form.watch(() => {
      setFormProgress(calculateFormProgress());
    });
    return () => subscription.unsubscribe();
  }, [form, calculateFormProgress]);

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

      // Log validation passed
      console.log("Debug - Form validation passed, proceeding with save");

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
          isSale: finalValues.isSale ?? false,
          saleEndDate: finalValues.saleEndDate ?? "",
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
          freeShippingForAllCountries: finalValues.freeShippingForAllCountries ?? false,
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

      // Count total errors
      const errorCount = Object.keys(errors).length;

      // Get first few error messages
      const errorMessages = Object.entries(errors)
        .slice(0, 3)
        .map(([field, error]: [string, any]) => {
          const fieldLabels: Record<string, string> = {
            name: "Nome prodotto",
            description: "Descrizione",
            variantName: "Nome variante",
            categoryId: "Categoria",
            subCategoryId: "Sottocategoria",
            brand: "Marca",
            sku: "SKU",
            images: "Immagini",
            variantImage: "Immagine variante",
            colors: "Colori",
            sizes: "Taglie",
            keywords: "Parole chiave",
            weight: "Peso",
            product_specs: "Specifiche prodotto",
            variant_specs: "Specifiche variante",
            questions: "Domande",
          };

          const fieldLabel = fieldLabels[field] || field;
          const message = error?.message || "Campo obbligatorio";

          return `• ${fieldLabel}: ${message}`;
        })
        .join("\n");

      const additionalErrors = errorCount > 3 ? `\n... e altri ${errorCount - 3} errori` : "";

      toast.error(
        `Errori di validazione (${errorCount})`,
        {
          description: errorMessages + additionalErrors,
          duration: 8000,
        }
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