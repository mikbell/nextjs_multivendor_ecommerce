"use client";

import { useEffect } from 'react';
import { setupGlobalExtensionCleaning } from '@/lib/extension-cleanup';

interface ExtensionCleanupProviderProps {
  children: React.ReactNode;
}

/**
 * Provider che inizializza la pulizia globale degli attributi delle estensioni browser
 * Deve essere posizionato ad alto livello nell'app per proteggere tutta l'applicazione
 */
export function ExtensionCleanupProvider({ children }: ExtensionCleanupProviderProps) {
  useEffect(() => {
    // Setup global extension cleaning only on client side
    const observer = setupGlobalExtensionCleaning();
    
    return () => {
      // Cleanup observer when component unmounts
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return <>{children}</>;
}