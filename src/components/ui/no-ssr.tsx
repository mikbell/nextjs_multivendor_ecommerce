"use client";

import { useEffect, useState } from 'react';

interface NoSSRProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Componente per evitare il rendering lato server
 * Utile per componenti che causano problemi di idratazione
 */
export function NoSSR({ children, fallback = null }: NoSSRProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []); // Empty dependency array to run only once

  // During SSR and initial render, show fallback
  if (!isMounted) {
    return <>{fallback}</>;
  }

  // After component is mounted, show children
  return <>{children}</>;
}
