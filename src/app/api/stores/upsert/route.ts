import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { StoreStatus } from "@prisma/client";
import { z } from "zod";

const StoreSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().min(1),
  email: z.string().email().min(1),
  phone: z.string().min(1),
  slug: z.string().optional(),
  logo: z.string().url().min(1),
  cover: z.string().url().min(1),
  returnPolicy: z.string().min(1),
  defaultShippingService: z.string().optional(),
  defaultShippingFee: z.number().optional(),
  defaultDeliveryTimeMin: z.number().optional(),
  defaultDeliveryTimeMax: z.number().optional(),
  averageRating: z.number().optional().default(0),
  featured: z.boolean().optional().default(false),
  status: z.string().optional().default("PENDING"),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Non autenticato." }, { status: 401 });
    }

    // Only SELLER (or ADMIN) can upsert stores
    const role = user.privateMetadata.role;
    if (role !== "SELLER" && role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non hai i permessi necessari." },
        { status: 403 }
      );
    }

    const json = await req.json();
    const parsed = StoreSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dati non validi.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const store = parsed.data;

    // slugify helper
    const slugify = (value: string) =>
      value
        .normalize("NFD")
        .replace(/\p{Diacritic}+/gu, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const computedSlug = slugify(store.name);

    // Ensure a corresponding User record exists to satisfy the FK constraint on Store.userId
    // Clerk provides the authenticated user, but a DB record may not exist yet.
    // Derive primary email and phone using Clerk user fields to satisfy type checks
    const primaryEmail =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.
        emailAddress || user.emailAddresses?.[0]?.emailAddress || "";
    const primaryPhone =
      user.phoneNumbers?.find((p) => p.id === user.primaryPhoneNumberId)?.
        phoneNumber ?? null;

    await db.user.upsert({
      where: { id: user.id },
      update: {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: primaryEmail,
        picture: user.imageUrl || "",
        phone: primaryPhone,
      },
      create: {
        id: user.id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: primaryEmail,
        picture: user.imageUrl || "",
        phone: primaryPhone,
      },
    });

    // If updating, ensure ownership (unless ADMIN)
    const existingById = await db.store.findUnique({ where: { id: store.id } });
    if (existingById && role !== "ADMIN" && existingById.userId !== user.id) {
      return NextResponse.json(
        { error: "Non hai i permessi per modificare questo negozio." },
        { status: 403 }
      );
    }

    // Check for duplicates by email or slug excluding current id
    const existingStore = await db.store.findFirst({
      where: {
        AND: [
          { OR: [{ email: store.email }, { slug: computedSlug }] },
          { NOT: { id: store.id } },
        ],
      },
    });

    if (existingStore) {
      let errorMessage = "";
      if (existingStore.email === store.email) {
        errorMessage = "Email negozio esistente.";
      } else if (existingStore.slug === computedSlug) {
        errorMessage = "Slug negozio esistente.";
      }
      return NextResponse.json({ error: errorMessage }, { status: 409 });
    }

    const upserted = await db.store.upsert({
      where: { id: store.id },
      update: {
        name: store.name,
        description: store.description,
        email: store.email,
        phone: store.phone,
        slug: computedSlug,
        logo: store.logo,
        cover: store.cover,
        returnPolicy: store.returnPolicy,
        defaultShippingService: store.defaultShippingService,
        defaultShippingFee: store.defaultShippingFee,
        defaultDeliveryTimeMin: store.defaultDeliveryTimeMin,
        defaultDeliveryTimeMax: store.defaultDeliveryTimeMax,
        featured: store.featured,
        status: (store.status as StoreStatus) ?? StoreStatus.PENDING,
        updatedAt: store.updatedAt,
      },
      create: {
        id: store.id,
        name: store.name,
        description: store.description,
        email: store.email,
        phone: store.phone,
        slug: computedSlug,
        logo: store.logo,
        cover: store.cover,
        returnPolicy: store.returnPolicy,
        defaultShippingService: store.defaultShippingService,
        defaultShippingFee: store.defaultShippingFee,
        defaultDeliveryTimeMin: store.defaultDeliveryTimeMin,
        defaultDeliveryTimeMax: store.defaultDeliveryTimeMax,
        featured: store.featured,
        status: (store.status as StoreStatus) ?? StoreStatus.PENDING,
        userId: user.id,
        createdAt: store.createdAt,
        updatedAt: store.updatedAt,
      },
    });

    return NextResponse.json(upserted, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Errore durante il salvataggio." },
      { status: 500 }
    );
  }
}
