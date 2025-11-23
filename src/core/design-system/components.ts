/**
 * Design system component configurations
 */

export interface ComponentConfig {
  baseClasses: string;
  variants: Record<string, string>;
  sizes?: Record<string, string>;
  states?: Record<string, string>;
}

export const componentConfigs = {
  button: {
    baseClasses: 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    variants: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 hover:bg-gray-300 focus:ring-gray-500',
      outline: 'border border-border bg-white hover:bg-gray-50 focus:ring-blue-500',
      ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500',
      destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    },
    sizes: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
    },
    states: {
      disabled: 'opacity-50 cursor-not-allowed',
      loading: 'opacity-75 cursor-wait',
    },
  } as ComponentConfig,

  input: {
    baseClasses: 'block w-full rounded-md border-border shadow-sm transition-colors focus:border-blue-500 focus:ring-blue-500',
    variants: {
      default: 'border-border',
      error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
      success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
    },
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-2.5 text-base',
    },
    states: {
      disabled: 'opacity-50 cursor-not-allowed bg-gray-50',
      readonly: 'bg-gray-50',
    },
  } as ComponentConfig,

  card: {
    baseClasses: 'bg-white rounded-lg border border-border shadow-sm',
    variants: {
      default: 'border-border',
      elevated: 'shadow-md border-border',
      outline: 'border-2 border-border shadow-none',
    },
    sizes: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  } as ComponentConfig,
} as const;