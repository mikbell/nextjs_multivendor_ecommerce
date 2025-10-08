import { NextRequest, NextResponse } from "next/server";
import { SubCategoryFormSchema } from "@/lib/schemas/category";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    // Verifica autenticazione
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 401 }
      );
    }

    // Verifica che l'utente esista nel database
    const dbUser = await db.user.findUnique({
      where: { id: user.id },
    });
    if (!dbUser) {
      return NextResponse.json(
        { error: "Utente non trovato nel database" },
        { status: 404 }
      );
    }

    // Verifica che sia admin
    if (dbUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accesso negato. Solo gli admin possono gestire le sottocategorie." },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Valida i dati con il nostro schema
    const validatedData = SubCategoryFormSchema.parse(body);

    // Prepara i dati per il database
    const subCategoryData = {
      name: validatedData.name,
      description: validatedData.description,
      image: validatedData.image[0]?.url || '', // Estrai l'URL dall'array validato
      slug: validatedData.slug,
      url: validatedData.url,
      featured: validatedData.featured,
      categoryId: validatedData.categoryId,
    };

    let subCategory;

    if (body.id) {
      // Update existing subcategory
      subCategory = await db.subcategory.update({
        where: { id: body.id },
        data: {
          ...subCategoryData,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new subcategory
      subCategory = await db.subcategory.create({
        data: {
          ...subCategoryData,
          id: uuidv4(),
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: body.id ? "Sottocategoria aggiornata con successo" : "Sottocategoria creata con successo",
      data: subCategory
    });

  } catch (error) {
    console.error("Errore nella gestione della sottocategoria:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: "Errore nella validazione dei dati",
          details: error.message 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}