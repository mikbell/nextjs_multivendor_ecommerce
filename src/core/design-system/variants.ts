/**
 * Design system variant utilities
 */

import { clsx, type ClassValue } from 'clsx';

export interface VariantProps {
  variant?: string;
  size?: string;
  state?: string;
}

export interface VariantConfig {
  base?: string;
  variants?: Record<string, Record<string, string>>;
  defaultVariants?: Record<string, string>;
}

/**
 * Create variant-based class names
 */
export function createVariants(config: VariantConfig) {
  return ({ variant, size, state, ...props }: VariantProps & Record<string, any>) => {
    const classes: ClassValue[] = [];
    
    // Add base classes
    if (config.base) {
      classes.push(config.base);
    }
    
    // Add variant classes
    if (config.variants) {
      Object.entries(config.variants).forEach(([key, values]) => {
        const value = props[key] || config.defaultVariants?.[key];
        if (value && values[value]) {
          classes.push(values[value]);
        }
      });
    }
    
    return clsx(classes);
  };
}

/**
 * Common variant configurations
 */
export const buttonVariants = createVariants({
  base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export const inputVariants = createVariants({
  base: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  variants: {
    variant: {
      default: '',
      error: 'border-destructive focus-visible:ring-destructive',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});