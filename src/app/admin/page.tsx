import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import AdminUsersPage from "@/components/admin/AdminUsersPage";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) {
    return <div className="p-6">Unauthorized</div>;
  }
  const me = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!me || me.role !== "ADMIN") {
    return <div className="p-6">Forbidden</div>;
  }
  return <AdminUsersPage />;
}
