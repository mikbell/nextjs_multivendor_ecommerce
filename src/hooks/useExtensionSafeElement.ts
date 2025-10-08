"use client";

import { useEffect, useRef } from 'react';

/**
 * Hook to handle browser extension interference with DOM elements
 * Removes unwanted attributes added by extensions like password managers
 */
export function useExtensionSafeElement<T extends HTMLElement>() {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // List of attributes commonly added by browser extensions that can cause hydration issues
    const extensionAttributes = [
      'data-np-intersection-state',
      'data-np-checked',
      'data-lp-ignore',
      'data-lpignore',
      'data-form-type',
      'data-ms-editor'
    ];

    // Create a mutation observer to remove extension attributes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName) {
          const attrName = mutation.attributeName;
          if (extensionAttributes.some(attr => attrName.startsWith(attr))) {
            element.removeAttribute(attrName);
          }
        }
      });
    });

    // Start observing
    observer.observe(element, {
      attributes: true,
      attributeFilter: extensionAttributes
    });

    // Initial cleanup of existing extension attributes
    extensionAttributes.forEach(attr => {
      if (element.hasAttribute(attr)) {
        element.removeAttribute(attr);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return elementRef;
}