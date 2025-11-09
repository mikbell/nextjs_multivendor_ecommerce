import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Schema and types
import { CategoryFormSchema } from "@/lib/schemas/category";
import { 
	CategoryFormData, 
	CategoryWithUrl, 
	CategoryQualityCheck,
	CategoryProgressTracking 
} from "../types";
import { apiClient } from "@/lib/api-client";
import { handleFormError, showSuccessToast } from "@/lib/error-handler";

// Utils and constants
import {
	generateSlug,
	generateCategoryUrl,
	validateFormQuality,
	calculateProgressTracking,
	getEssentialFieldErrors,
	getImportantFieldErrors,
	createFormPayload,
} from '../utils';
import { MESSAGES } from '../constants';

interface UseCategoryFormProps {
	data?: CategoryWithUrl | undefined;
}

export const useCategoryForm = ({ data }: UseCategoryFormProps) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [isFormReady, setIsFormReady] = useState(false);

	// Define default values based on data prop
	const defaultValues = useMemo<CategoryFormData>(
		() => {
			// Base default values for new category
			const baseValues: CategoryFormData = {
				name: "",
				description: "",
				image: [], // Always default to empty array
				slug: "",
				url: "",
				featured: false,
			};

			// If we have data (edit mode), merge it with base values
			if (data) {
				const values = { ...baseValues };
				
				if (data.name) values.name = data.name;
				if (data.description) values.description = data.description;
				if (data.slug) values.slug = data.slug;
				if (data.url) values.url = data.url;
				if (typeof data.featured === 'boolean') values.featured = data.featured;

				// Handle image field carefully for edit mode
				if (data.image) {
					if (typeof data.image === 'string' && data.image.trim()) {
						values.image = [{ url: data.image }];
					} else if (Array.isArray(data.image) && data.image.length > 0) {
						values.image = data.image;
					}
				}

				return values;
			}

			return baseValues;
		},
		[data]
	);

	// Form hook for managing form state and validation
	const form = useForm<CategoryFormData, any, CategoryFormData>({
		mode: "onBlur", // Changed from onChange to onBlur to reduce validation calls
		resolver: zodResolver(CategoryFormSchema),
		defaultValues,
		criteriaMode: "firstError", // Show first error only
		shouldFocusError: true,
	});

	// Extract form state
	const errors = form.formState.errors;
	const isFormLoading = form.formState.isSubmitting || isLoading;
	const isEditMode = Boolean(data?.id);

	// Mark form as ready after initialization
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsFormReady(true);
		}, 100); // Small delay to ensure form is fully initialized
		return () => clearTimeout(timer);
	}, []);

	// Watch form values for progress tracking - only when form is ready
	const watchedValues = useMemo(() => {
		if (!isFormReady) return {};
		
		try {
			// Get form values safely
			const values = form.getValues();
			return values || {};
		} catch (error) {
			console.warn('[CategoryForm] Error getting form values:', error);
			return {};
		}
	}, [form, isFormReady]);

	// Calculate quality checks using utility function
	const qualityChecks = useMemo<CategoryQualityCheck>(() => {
		if (!isFormReady) {
			return {
				hasGoodName: false,
				hasDetailedDescription: false,
				hasImage: false,
				hasSlug: false,
				hasUrl: false,
			};
		}
		
		try {
			return validateFormQuality(watchedValues);
		} catch (error) {
			console.warn('[CategoryForm] Error calculating quality checks:', error);
			return {
				hasGoodName: false,
				hasDetailedDescription: false,
				hasImage: false,
				hasSlug: false,
				hasUrl: false,
			};
		}
	}, [watchedValues, isFormReady]);

	// Calculate progress tracking using utility function
	const progressTracking = useMemo<CategoryProgressTracking>(() => {
		try {
			return calculateProgressTracking(qualityChecks);
		} catch (error) {
			console.warn('[CategoryForm] Error calculating progress tracking:', error);
			return {
				checks: {
					hasGoodName: false,
					hasDetailedDescription: false,
					hasImage: false,
					hasSlug: false,
					hasUrl: false,
				},
				passedChecks: 0,
				totalChecks: 5,
				score: 0,
			};
		}
	}, [qualityChecks]);


	// Watch name changes and auto-generate slug/url if they're empty
	useEffect(() => {
		try {
			const watchedName = form.getValues("name");
			if (watchedName && !isEditMode && typeof watchedName === 'string') {
				const currentSlug = form.getValues("slug");
				const currentUrl = form.getValues("url");
				
				// Only auto-generate if fields are empty (don't override user input)
				if (!currentSlug || currentSlug === "") {
					form.setValue("slug", generateSlug(watchedName), { shouldValidate: false });
				}
				if (!currentUrl || currentUrl === "") {
					form.setValue("url", generateCategoryUrl(watchedName), { shouldValidate: false });
				}
			}
		} catch (error) {
			console.warn('[CategoryForm] Error in name watch effect:', error);
		}
	}, [form, isEditMode]);

	// Reset form when data changes
	useEffect(() => {
		if (data) {
			form.reset(defaultValues);
		}
	}, [data, defaultValues, form]);

	// Enhanced form submit handler with utility functions
	const onSubmit = form.handleSubmit(
		async (values) => {
			console.log("🚀 [CategoryForm] Form submission started");
			console.log("📋 [CategoryForm] Form values:", values);

			// Validate essential fields
			const essentialErrors = getEssentialFieldErrors(values);
			if (essentialErrors.length > 0) {
				toast.error(MESSAGES.ERRORS.MISSING_ESSENTIAL, {
					description: `Completa: ${essentialErrors.join(", ")}`,
					duration: 6000,
				});
				return;
			}

			// Validate important fields (show warning but don't block submission)
			const importantErrors = getImportantFieldErrors(values);
			if (importantErrors.length > 0) {
				toast.warning("Campi consigliati mancanti", {
					description: `Per una migliore presentazione, considera di aggiungere: ${importantErrors.join(", ")}`,
					duration: 8000,
				});
				// Don't return - allow submission to continue
			}

			setIsLoading(true);
			try {
				// Create payload using utility function
				const payload = createFormPayload(values, data?.id);
				console.log("📤 [CategoryForm] Sending payload:", payload);

				await apiClient.post("/api/categories/upsert", payload);

				showSuccessToast(
					data?.id ? MESSAGES.SUCCESS.CATEGORY_UPDATED : MESSAGES.SUCCESS.CATEGORY_CREATED,
					"Operazione completata con successo."
				);

				router.push("/dashboard/admin/categories");
			} catch (error) {
				handleFormError(error, "salvataggio categoria");
			} finally {
				setIsLoading(false);
			}
		},
		(errors) => {
			console.log("❌ [CategoryForm] Validation errors:", errors);
			toast.error(MESSAGES.ERRORS.VALIDATION_ERROR, {
				description: "Controlla i campi evidenziati in rosso.",
			});
		}
	);

	return {
		// Form
		form,
		onSubmit,
		isLoading: isFormLoading,
		errors,

		// Page state
		isEditMode,

		// Progress and quality
		formProgress: progressTracking.score,
		qualityChecks: progressTracking.checks,
		progressTracking,
	};
};