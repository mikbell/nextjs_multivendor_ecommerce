"use client";

export default function CloudinaryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // No-op provider. Kept for future use if global provider is needed.
  return <>{children}</>;
}
