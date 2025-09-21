import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { z } from "zod";

const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  image: z.string().url().min(1),
  url: z.string().min(1),
  featured: z.boolean().optional().default(false),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Non autenticato." }, { status: 401 });
    }

    // Only ADMIN can upsert categories
    if (user.privateMetadata.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non hai i permessi necessari." },
        { status: 403 }
      );
    }

    const json = await req.json();
    const parsed = CategorySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dati non validi.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const category = parsed.data;

    // Check for duplicates by name or url excluding current id
    const existingCategory = await db.category.findFirst({
      where: {
        AND: [
          { OR: [{ name: category.name }, { url: category.url }] },
          { NOT: { id: category.id } },
        ],
      },
    });

    if (existingCategory) {
      let errorMessage = "";
      if (existingCategory.name === category.name) {
        errorMessage = "Nome categoria esistente.";
      } else if (existingCategory.url === category.url) {
        errorMessage = "URL categoria esistente.";
      }
      return NextResponse.json({ error: errorMessage }, { status: 409 });
    }

    const categoryDetails = await db.category.upsert({
      where: { id: category.id },
      update: {
        name: category.name,
        image: category.image,
        url: category.url,
        featured: category.featured,
        updatedAt: category.updatedAt,
      },
      create: {
        id: category.id,
        name: category.name,
        image: category.image,
        url: category.url,
        featured: category.featured,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
    });

    return NextResponse.json(categoryDetails, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Errore durante il salvataggio." },
      { status: 500 }
    );
  }
}
