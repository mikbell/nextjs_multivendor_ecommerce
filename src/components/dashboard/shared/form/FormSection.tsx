import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title?: string;
  description?: string;
  className?: string;
  children: ReactNode;
  showDivider?: boolean;
}

const FormSection: FC<FormSectionProps> = ({
  title,
  description,
  className,
  children,
  showDivider = false,
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className="space-y-6">
        {children}
      </div>
      
      {showDivider && (
        <hr className="border-gray-200 dark:border-gray-700" />
      )}
    </div>
  );
};

export default FormSection;