import { UseFormReturn } from "react-hook-form";
import { CategoryFormSchema } from "@/lib/schemas/category";
import { Category } from "@/generated/prisma";
import * as z from "zod";

// Type for the form data
export type CategoryFormData = z.infer<typeof CategoryFormSchema>;

// Type for form data with all fields properly typed
export interface CategoryFormDataTyped {
	name: string;
	description: string;
	image?: Array<{ url: string }>;
	slug: string;
	url: string;
	featured: boolean;
}
// Category with URL extension (temporary until Prisma client is regenerated)
export interface CategoryWithUrl extends Category {
	url: string;
}

// Base props that most form components need
export interface BaseFormProps {
	form: UseFormReturn<CategoryFormData>;
	isLoading: boolean;
}

// Props for the main CategoryDetails component
export interface CategoryDetailsProps {
	data?: CategoryWithUrl;
}

// Props for CategoryImage component
export type CategoryImageProps = BaseFormProps;

// Props for CategoryBasicInfo component
export type CategoryBasicInfoProps = BaseFormProps;

// Props for CategoryDescription component
export type CategoryDescriptionProps = BaseFormProps;

// Props for CategorySettings component
export type CategorySettingsProps = BaseFormProps;

// Props for FormProgress component (to be created)
export interface FormProgressProps {
	formProgress: number;
	isEditMode: boolean;
}

// Props for FormActions component
export interface FormActionsProps {
	isLoading: boolean;
	data?: CategoryWithUrl;
	onCancel?: () => void;
	onSubmit?: (e?: React.FormEvent) => void;
}

// Quality check structure for categories
export interface CategoryQualityCheck {
	hasGoodName: boolean;
	hasDetailedDescription: boolean;
	hasImage: boolean;
	hasSlug: boolean;
	hasUrl: boolean;
}

// Progress tracking structure
export interface CategoryProgressTracking {
	checks: CategoryQualityCheck;
	passedChecks: number;
	totalChecks: number;
	score: number;
}

// Enhanced loading states
export type LoadingState = 'idle' | 'loading' | 'submitting' | 'error' | 'success';

// Form step identifier
export type FormStepId = 'image' | 'basic-info' | 'description' | 'settings';

// Validation status for fields
export interface FieldValidationStatus {
	isValid: boolean;
	isRequired: boolean;
	characterCount?: number;
	minLength?: number;
	maxLength?: number;
	errorMessage?: string;
}

// Enhanced form context
export interface CategoryFormContext {
	loadingState: LoadingState;
	validationErrors: Record<string, string>;
	currentStep?: FormStepId;
	canProceed: boolean;
	hasUnsavedChanges: boolean;
}
