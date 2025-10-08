import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  gap?: "sm" | "md" | "lg";
  responsive?: boolean;
}

const FormGrid: FC<FormGridProps> = ({
  children,
  columns = 2,
  className,
  gap = "md",
  responsive = true,
}) => {
  const gapClasses = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  const columnClasses = {
    1: "grid-cols-1",
    2: responsive ? "grid-cols-1 md:grid-cols-2" : "grid-cols-2",
    3: responsive ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-3",
    4: responsive ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-4",
  };

  return (
    <div className={cn(
      "grid",
      columnClasses[columns],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
};

export default FormGrid;