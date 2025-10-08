"use client";

import { useEffect, useRef } from 'react';

/**
 * Lista completa di attributi problematici aggiunti dalle estensioni browser
 */
const PROBLEMATIC_ATTRIBUTES = [
  // Password managers
  'data-np-intersection-state',
  'data-np-checked', 
  'data-np-watching',
  // LastPass
  'data-lp-ignore',
  'data-lpignore',
  'data-form-type',
  // Microsoft Edge
  'data-ms-editor',
  'data-ms-input-placeholder',
  // Chrome extensions
  'data-gramm',
  'data-gramm_editor',
  'data-enable-grammarly',
  // Other common extensions
  'data-lastpass-icon-added',
  'data-dashlane-rid',
  'data-bitwarden-watching',
  // Generic patterns
  'data-auto-',
  'data-extension-',
];

/**
 * Hook per proteggere completamente dagli attributi delle estensioni browser
 * Previene errori di idratazione causati da modifiche DOM post-rendering
 */
export function useBrowserExtensionSafety() {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const element = elementRef.current;
    if (!element) return;

    // Funzione per rimuovere attributi problematici
    const cleanElement = (el: Element) => {
      PROBLEMATIC_ATTRIBUTES.forEach(attr => {
        if (attr.endsWith('-')) {
          // Pattern matching for prefixes like 'data-auto-'
          const prefix = attr.slice(0, -1);
          Array.from(el.attributes).forEach(attribute => {
            if (attribute.name.startsWith(prefix)) {
              el.removeAttribute(attribute.name);
            }
          });
        } else {
          // Exact match
          if (el.hasAttribute(attr)) {
            el.removeAttribute(attr);
          }
        }
      });
    };

    // Clean initial state
    cleanElement(element);

    // Set up MutationObserver per monitoraggio continuo
    let observer: MutationObserver;

    const setupObserver = () => {
      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes') {
            const target = mutation.target as Element;
            const attributeName = mutation.attributeName;
            
            if (attributeName && PROBLEMATIC_ATTRIBUTES.some(attr => {
              if (attr.endsWith('-')) {
                return attributeName.startsWith(attr.slice(0, -1));
              }
              return attributeName === attr;
            })) {
              target.removeAttribute(attributeName);
            }
          }
        });
      });

      observer.observe(element, {
        attributes: true,
        subtree: true,
        attributeOldValue: false
      });
    };

    // Setup with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(setupObserver, 100);

    // Periodic cleanup (fallback)
    const intervalId = setInterval(() => {
      if (element) {
        cleanElement(element);
        
        // Clean all descendants too
        const descendants = element.querySelectorAll('*');
        descendants.forEach(cleanElement);
      }
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return elementRef;
}

/**
 * Hook semplificato per singoli elementi form
 */
export function useFormElementExtensionSafety<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const element = ref.current;
    if (!element) return;

    // Cleanup immediato
    const cleanup = () => {
      PROBLEMATIC_ATTRIBUTES.forEach(attr => {
        if (attr.endsWith('-')) {
          const prefix = attr.slice(0, -1);
          Array.from(element.attributes).forEach(attribute => {
            if (attribute.name.startsWith(prefix)) {
              element.removeAttribute(attribute.name);
            }
          });
        } else if (element.hasAttribute(attr)) {
          element.removeAttribute(attr);
        }
      });
    };

    cleanup();

    // Cleanup ritardato per catturare attributi aggiunti dopo l'idratazione
    const timeouts = [
      setTimeout(cleanup, 50),
      setTimeout(cleanup, 200),
      setTimeout(cleanup, 1000)
    ];

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return ref;
}