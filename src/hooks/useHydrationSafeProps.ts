"use client";

import { useEffect, useRef, useState } from 'react';

/**
 * Hook per gestire props che potrebbero causare errori di idratazione
 * Particolare attenzione agli attributi disabled e data-* di Radix UI
 */
export function useHydrationSafeProps<T extends Record<string, any>>(
  props: T,
  problematicKeys: (keyof T)[] = ['disabled']
): T {
  const [isHydrated, setIsHydrated] = useState(false);
  const propsRef = useRef<T>(props);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Durante il SSR e prima dell'idratazione, rimuovi le props problematiche
  if (!isHydrated) {
    const safeProps = { ...props };
    problematicKeys.forEach(key => {
      if (key in safeProps) {
        delete safeProps[key];
      }
    });
    return safeProps;
  }

  // Dopo l'idratazione, normalizza le props
  const normalizedProps = { ...props };
  problematicKeys.forEach(key => {
    if (key === 'disabled' && key in normalizedProps) {
      // Converti esplicitamente disabled in boolean
      (normalizedProps as any)[key] = Boolean(normalizedProps[key]);
    }
  });

  return normalizedProps;
}

/**
 * Hook specifico per elementi form che gestisce attributi comuni
 */
export function useFormElementProps<T extends Record<string, any>>(props: T) {
  return useHydrationSafeProps(props, ['disabled', 'required', 'readOnly']);
}