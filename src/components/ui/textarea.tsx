import * as React from "react"

import { cn } from "@/lib/utils"
import { useFormElementExtensionSafety } from "@/hooks/useBrowserExtensionSafety"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  const extensionSafeRef = useFormElementExtensionSafety<HTMLTextAreaElement>()
    
  // Merge refs to use both extension-safe ref and forwarded ref
  const mergedRef = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
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
    <textarea
      suppressHydrationWarning
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={mergedRef}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
