import * as React from "react"

import { cn } from "@/lib/utils"
import { useFormElementExtensionSafety } from "@/hooks/useBrowserExtensionSafety"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const extensionSafeRef = useFormElementExtensionSafety<HTMLInputElement>()
    
    // Merge refs to use both extension-safe ref and forwarded ref
    const mergedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        extensionSafeRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref, extensionSafeRef]
    )

    return (
      <input
        suppressHydrationWarning
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={mergedRef}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
