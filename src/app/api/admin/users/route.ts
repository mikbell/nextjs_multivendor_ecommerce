import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const me = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!me || me.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: { id: true, email: true, firstName: true, lastName: true, role: true },
    orderBy: { createdAt: "desc" },
  });

  return new Response(JSON.stringify({ users }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
