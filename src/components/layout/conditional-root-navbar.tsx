import { currentUser } from "@clerk/nextjs/server";
import ConditionalNavbarClient from "./conditional-navbar-client";

export default async function ConditionalRootNavbar() {
  const user = await currentUser();
  const userRole = user?.publicMetadata?.role as string | undefined;

  return <ConditionalNavbarClient userRole={userRole} />;
}
