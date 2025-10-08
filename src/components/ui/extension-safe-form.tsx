"use client";

import React from 'react';
import { useBrowserExtensionSafety } from '@/hooks/useBrowserExtensionSafety';

interface ExtensionSafeFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

/**
 * Wrapper per form che protegge automaticamente da interferenze di estensioni browser
 * Previene errori di idratazione causati da attributi aggiunti dinamicamente
 */
export const ExtensionSafeForm = React.forwardRef<HTMLFormElement, ExtensionSafeFormProps>(
  ({ children, ...props }, forwardedRef) => {
    const extensionSafeRef = useBrowserExtensionSafety();

    // Merge refs
    const mergedRef = React.useCallback(
      (node: HTMLFormElement | null) => {
        (extensionSafeRef as React.MutableRefObject<HTMLFormElement | null>).current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef, extensionSafeRef]
    );

    return (
      <form
        ref={mergedRef}
        suppressHydrationWarning
        {...props}
      >
        {children}
      </form>
    );
  }
);

ExtensionSafeForm.displayName = 'ExtensionSafeForm';