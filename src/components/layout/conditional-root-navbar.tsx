"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function ConditionalRootNavbar() {
  const pathname = usePathname();

  if (
    pathname?.startsWith("/dashboard/admin") ||
    pathname?.startsWith("/dashboard/seller")
  ) {
    return null;
  }

  return <Navbar />;
}
