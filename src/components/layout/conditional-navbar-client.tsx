"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

interface ConditionalNavbarClientProps {
  userRole?: string;
}

export default function ConditionalNavbarClient({ userRole }: ConditionalNavbarClientProps) {
  const pathname = usePathname();

  if (
    pathname?.startsWith("/dashboard/admin") ||
    pathname?.startsWith("/dashboard/seller")
  ) {
    return null;
  }

  return <Navbar userRole={userRole} />;
}
