import { VALIDATION_LIMITS, PROGRESS_THRESHOLDS, MESSAGES } from './constants';
import { CategoryFormData, CategoryQualityCheck, CategoryProgressTracking } from './types';

/**
 * Generates a URL-friendly slug from a string
 */
export const generateSlug = (text: string): string => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD') // Normalize unicode characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Generates a category URL from a name
 */
export const generateCategoryUrl = (name: string): string => {
  const slug = generateSlug(name);
  return slug ? `/categoria/${slug}` : '';
};

/**
 * Checks if a string value is empty or only whitespace
 */
export const isEmpty = (value: unknown): boolean => {
  return value === undefined || 
         value === null || 
         (typeof value === 'string' && value.trim() === '') ||
         (Array.isArray(value) && value.length === 0);
};

/**
 * Validates form values and returns quality checks
 */
export const validateFormQuality = (values: Partial<CategoryFormData> | null | undefined): CategoryQualityCheck => {
  // If values is null or undefined, return all false
  if (!values || typeof values !== 'object') {
    return {
      hasGoodName: false,
      hasDetailedDescription: false,
      hasImage: false,
      hasSlug: false,
      hasUrl: false,
    };
  }

  return {
    hasGoodName: Boolean(
      values.name && 
      typeof values.name === 'string' && 
      values.name.trim().length >= VALIDATION_LIMITS.NAME_MIN_LENGTH &&
      values.name.trim().length <= VALIDATION_LIMITS.NAME_MAX_LENGTH
    ),
    hasDetailedDescription: Boolean(
      values.description && 
      typeof values.description === 'string' && 
      values.description.trim().length >= VALIDATION_LIMITS.DESCRIPTION_MIN_LENGTH &&
      values.description.trim().length <= VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH
    ),
    hasImage: Boolean(
      values.image && 
      Array.isArray(values.image) && 
      values.image.length > 0 &&
      values.image[0]?.url
    ),
    hasSlug: Boolean(
      values.slug && 
      typeof values.slug === 'string' && 
      values.slug.trim().length >= VALIDATION_LIMITS.SLUG_MIN_LENGTH &&
      values.slug.trim().length <= VALIDATION_LIMITS.SLUG_MAX_LENGTH
    ),
    hasUrl: Boolean(
      values.url && 
      typeof values.url === 'string' && 
      values.url.trim().length >= VALIDATION_LIMITS.URL_MIN_LENGTH
    ),
  };
};

/**
 * Calculates progress tracking from quality checks
 */
export const calculateProgressTracking = (qualityChecks: CategoryQualityCheck | null | undefined): CategoryProgressTracking => {
  // Provide default values if qualityChecks is null or undefined
  const defaultChecks: CategoryQualityCheck = {
    hasGoodName: false,
    hasDetailedDescription: false,
    hasImage: false,
    hasSlug: false,
    hasUrl: false,
  };
  
  const validChecks = qualityChecks || defaultChecks;
  const checks = Object.values(validChecks);
  const passedChecks = checks.filter(Boolean).length;
  const totalChecks = checks.length;
  const score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;

  return {
    checks: validChecks,
    passedChecks,
    totalChecks,
    score,
  };
};

/**
 * Gets progress message based on completion percentage
 */
export const getProgressMessage = (progress: number): string => {
  if (progress >= PROGRESS_THRESHOLDS.EXCELLENT) return MESSAGES.PROGRESS.COMPLETE;
  if (progress >= PROGRESS_THRESHOLDS.GOOD) return MESSAGES.PROGRESS.ALMOST_COMPLETE;
  if (progress >= PROGRESS_THRESHOLDS.FAIR) return MESSAGES.PROGRESS.GOOD_PROGRESS;
  if (progress >= PROGRESS_THRESHOLDS.POOR) return MESSAGES.PROGRESS.MAKING_PROGRESS;
  if (progress >= PROGRESS_THRESHOLDS.MINIMAL) return MESSAGES.PROGRESS.GETTING_STARTED;
  return MESSAGES.PROGRESS.JUST_STARTED;
};

/**
 * Gets progress color class based on completion percentage
 */
export const getProgressColor = (progress: number): string => {
  if (progress >= PROGRESS_THRESHOLDS.GOOD) return 'bg-green-500';
  if (progress >= PROGRESS_THRESHOLDS.FAIR) return 'bg-yellow-500';
  return 'bg-red-500';
};

/**
 * Gets progress badge configuration
 */
export const getProgressBadge = (progress: number) => {
  if (progress >= PROGRESS_THRESHOLDS.EXCELLENT) {
    return { variant: 'default', text: 'Completata', class: 'bg-green-100 text-green-800' };
  }
  if (progress >= PROGRESS_THRESHOLDS.GOOD) {
    return { variant: 'secondary', text: 'Quasi pronta', class: 'bg-yellow-100 text-yellow-800' };
  }
  if (progress >= PROGRESS_THRESHOLDS.FAIR) {
    return { variant: 'secondary', text: 'In progresso', class: 'bg-blue-100 text-blue-800' };
  }
  return { variant: 'outline', text: 'Da completare', class: 'bg-gray-100 text-gray-800' };
};

/**
 * Validates essential fields and returns missing field names
 */
export const getEssentialFieldErrors = (values: Partial<CategoryFormData>): string[] => {
  const errors: string[] = [];
  
  if (isEmpty(values.name)) errors.push('Nome categoria');
  if (isEmpty(values.slug)) errors.push('Slug');
  if (isEmpty(values.url)) errors.push('URL');
  
  return errors;
};

/**
 * Validates important fields and returns missing field names
 */
export const getImportantFieldErrors = (values: Partial<CategoryFormData>): string[] => {
  const errors: string[] = [];
  
  // Description is important but not required
  if (isEmpty(values.description)) errors.push('Descrizione');
  
  // Image is recommended but not required for creation
  if (!values.image || values.image.length === 0) errors.push('Immagine');
  
  return errors;
};

/**
 * Creates form payload for API submission
 */
export const createFormPayload = (values: CategoryFormData, existingId?: string) => {
  const payload: Record<string, unknown> = {
    name: values.name,
    image: values.image && values.image.length > 0 ? values.image[0]?.url || '' : '',
    slug: values.slug,
    url: values.url,
    description: values.description || '', // Ensure description is never undefined
    featured: Boolean(values.featured),
  };

  // Add ID for updates
  if (existingId) {
    payload.id = existingId;
  }

  // Add timestamps for new categories
  if (!existingId) {
    payload.createdAt = new Date();
    payload.updatedAt = new Date();
  }

  return payload;
};

/**
 * Gets character count display for text inputs
 */
export const getCharacterCountDisplay = (
  currentLength: number, 
  maxLength: number, 
  minLength?: number
): { text: string; color: string } => {
  const remaining = maxLength - currentLength;
  
  if (minLength && currentLength < minLength) {
    return {
      text: `${currentLength}/${maxLength} (min: ${minLength})`,
      color: 'text-red-500'
    };
  }
  
  if (remaining < 20) {
    return {
      text: `${remaining} caratteri rimanenti`,
      color: 'text-yellow-600'
    };
  }
  
  return {
    text: `${currentLength}/${maxLength}`,
    color: 'text-gray-500'
  };
};