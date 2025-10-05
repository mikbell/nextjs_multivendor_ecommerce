import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and resolves conflicts with tailwind-merge
 * @param inputs - Class names to combine
 * @returns Combined and conflict-resolved class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Re-export clsx for direct usage
 */
export { clsx };

/**
 * Conditional class utility with better TypeScript support
 * @param classes - Object with condition-class pairs
 * @returns Combined class string
 */
export function conditionalClass(
  classes: Record<string, boolean | undefined>
): string {
  return cn(
    Object.entries(classes)
      .filter(([, condition]) => condition)
      .map(([className]) => className)
  );
}

/**
 * Utility for creating component variants
 * @param base - Base classes
 * @param variants - Variant classes
 * @param conditions - Conditions for applying variants
 * @returns Combined class string
 */
export function createVariants<T extends Record<string, any>>(
  base: string,
  variants: T,
  conditions: Partial<{ [K in keyof T]: boolean }>
): string {
  const variantClasses = Object.entries(conditions)
    .filter(([, condition]) => condition)
    .map(([key]) => variants[key])
    .filter(Boolean);

  return cn(base, ...variantClasses);
}