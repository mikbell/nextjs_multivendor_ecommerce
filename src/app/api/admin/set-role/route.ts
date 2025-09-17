import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { clerkClient, auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type AllowedRole = "USER" | "ADMIN" | "SELLER";

export async function POST(req: NextRequest) {
  const { userId: adminId } = await auth();
  if (!adminId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const admin = await prisma.user.findUnique({ where: { id: adminId }, select: { role: true } });
  if (!admin || admin.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.userId !== "string" || typeof body.role !== "string") {
    return new Response("Invalid body", { status: 400 });
  }
  const allowed: AllowedRole[] = ["USER", "ADMIN", "SELLER"];
  if (!allowed.includes(body.role as AllowedRole)) {
    return new Response("Invalid role", { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: body.userId },
    data: { role: body.role as AllowedRole },
    select: { id: true, role: true },
  });

  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(updated.id, {
    privateMetadata: { role: updated.role },
  });

  return new Response(JSON.stringify({ ok: true, userId: updated.id, role: updated.role }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
