import * as React from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function FormSection({ 
  title, 
  description, 
  children, 
  className,
  icon 
}: FormSectionProps) {
  return (
    <div className={cn(
      "space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm",
      className
    )}>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="flex h-5 w-5 items-center justify-center">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            {title}
          </h3>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

interface FormRowProps {
  children: React.ReactNode;
  className?: string;
}

export function FormRow({ children, className }: FormRowProps) {
  return (
    <div className={cn(
      "grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      className
    )}>
      {children}
    </div>
  );
}

interface FormColumnProps {
  children: React.ReactNode;
  className?: string;
  span?: 1 | 2 | 3;
}

export function FormColumn({ children, className, span = 1 }: FormColumnProps) {
  return (
    <div className={cn(
      "space-y-4",
      {
        "sm:col-span-1": span === 1,
        "sm:col-span-2": span === 2,
        "sm:col-span-3": span === 3,
      },
      className
    )}>
      {children}
    </div>
  );
}