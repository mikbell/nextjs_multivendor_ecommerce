"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";

export function ConditionalRootHeader() {
  const pathname = usePathname();

  // Hide the public/shared header on admin dashboard routes
  if (
    pathname?.startsWith("/dashboard/admin") ||
    pathname?.startsWith("/dashboard/seller")
  ) {
    return null;
  }

  return <Header />;
}
