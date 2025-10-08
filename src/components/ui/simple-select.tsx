"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

interface SimpleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode
  placeholder?: string
}

interface SimpleSelectOptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children: React.ReactNode
}

/**
 * Select HTML nativo ultra-semplificato
 * Evita completamente Radix UI per prevenire errori di idratazione
 * DA USARE SOLO come ultima risorsa quando altri approcci falliscono
 */
export const SimpleSelect = React.forwardRef<HTMLSelectElement, SimpleSelectProps>(
  ({ className, children, placeholder, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    )
  }
)

SimpleSelect.displayName = "SimpleSelect"

export const SimpleSelectOption = React.forwardRef<HTMLOptionElement, SimpleSelectOptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <option
        ref={ref}
        className={className}
        {...props}
      >
        {children}
      </option>
    )
  }
)

SimpleSelectOption.displayName = "SimpleSelectOption"