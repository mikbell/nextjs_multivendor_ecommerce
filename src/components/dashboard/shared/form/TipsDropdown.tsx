import { FC, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface Tip {
  id: string;
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface TipsDropdownProps {
  title?: string;
  tips: Tip[];
  className?: string;
  defaultOpen?: boolean;
  variant?: "default" | "info" | "success" | "warning";
}

const TipsDropdown: FC<TipsDropdownProps> = ({
  title = "💡 Consigli utili",
  tips,
  className,
  defaultOpen = false,
  variant = "default",
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const variantStyles = {
    default: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
    info: "bg-cyan-50 border-cyan-200 dark:bg-cyan-900/20 dark:border-cyan-800",
    success: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
    warning: "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800",
  };

  const textStyles = {
    default: "text-blue-900 dark:text-blue-100",
    info: "text-cyan-900 dark:text-cyan-100",
    success: "text-green-900 dark:text-green-100",
    warning: "text-yellow-900 dark:text-yellow-100",
  };

  return (
    <div className={cn(
      "rounded-lg border p-4",
      variantStyles[variant],
      className
    )}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between text-left font-medium",
          textStyles[variant]
        )}
      >
        <div className="flex items-center gap-2">
          <LightBulbIcon className="h-5 w-5" />
          <span>{title}</span>
        </div>
        {isOpen ? (
          <ChevronUpIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        )}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3">
          {tips.map((tip) => (
            <div key={tip.id} className="flex gap-3">
              {tip.icon ? (
                <tip.icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", textStyles[variant])} />
              ) : (
                <div className={cn("h-2 w-2 rounded-full mt-2 flex-shrink-0", 
                  variant === "default" ? "bg-blue-400" : 
                  variant === "info" ? "bg-cyan-400" : 
                  variant === "success" ? "bg-green-400" : "bg-yellow-400"
                )} />
              )}
              <div className="space-y-1">
                <p className={cn("text-sm font-medium", textStyles[variant])}>
                  {tip.title}
                </p>
                <p className={cn("text-sm opacity-80", textStyles[variant])}>
                  {tip.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TipsDropdown;