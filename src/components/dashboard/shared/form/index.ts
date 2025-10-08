export { default as FormSection } from "./FormSection";
export { default as TipsDropdown } from "./TipsDropdown";
export { default as FormActions } from "./FormActions";
export { default as FormGrid } from "./FormGrid";

// Tipi e interfacce utili
export interface Tip {
  id: string;
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export type TipsVariant = "default" | "info" | "success" | "warning";
export type GridColumns = 1 | 2 | 3 | 4;
export type GridGap = "sm" | "md" | "lg";