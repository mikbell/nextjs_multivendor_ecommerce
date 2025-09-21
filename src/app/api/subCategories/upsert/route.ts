import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { z } from "zod";

const SubCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  image: z.string().url().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  featured: z.boolean().optional().default(false),
  categoryId: z.string().min(1),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Non autenticato." }, { status: 401 });
    }

    // Only ADMIN can upsert sub-categories
    if (user.privateMetadata.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non hai i permessi necessari." },
        { status: 403 }
      );
    }

    const json = await req.json();
    const parsed = SubCategorySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dati non validi.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const subCategory = parsed.data;

    // Check for duplicates by name or slug excluding current id
    const existingSubCategory = await db.subCategory.findFirst({
      where: {
        AND: [
          { OR: [{ name: subCategory.name }, { slug: subCategory.slug }] },
          { NOT: { id: subCategory.id } },
        ],
      },
    });

    if (existingSubCategory) {
      let errorMessage = "";
      if (existingSubCategory.name === subCategory.name) {
        errorMessage = "Nome sotto-categoria esistente.";
      } else if (existingSubCategory.slug === subCategory.slug) {
        errorMessage = "Slug sotto-categoria esistente.";
      }
      return NextResponse.json({ error: errorMessage }, { status: 409 });
    }

    const details = await db.subCategory.upsert({
      where: { id: subCategory.id },
      update: {
        name: subCategory.name,
        image: subCategory.image,
        slug: subCategory.slug,
        description: subCategory.description,
        featured: subCategory.featured,
        categoryId: subCategory.categoryId,
        updatedAt: subCategory.updatedAt,
      },
      create: {
        id: subCategory.id,
        name: subCategory.name,
        image: subCategory.image,
        slug: subCategory.slug,
        description: subCategory.description,
        featured: subCategory.featured,
        categoryId: subCategory.categoryId,
        createdAt: subCategory.createdAt,
        updatedAt: subCategory.updatedAt,
      },
    });

    return NextResponse.json(details, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Errore durante il salvataggio." },
      { status: 500 }
    );
  }
}
