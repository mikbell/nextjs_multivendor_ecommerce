import { NextRequest, NextResponse } from "next/server";
import { CategoryFormSchema } from "@/lib/schemas/category";
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
        { error: "Accesso negato. Solo gli admin possono gestire le categorie." },
        { status: 403 }
      );
    }
    const body = await request.json();
    
    // Valida i dati con il nostro schema
    const validatedData = CategoryFormSchema.parse(body);

    // Prepara i dati per il database
    const categoryData = {
      name: validatedData.name,
      description: validatedData.description,
      image: validatedData.image[0]?.url || '', // Estrai l'URL dall'array validato
      slug: validatedData.slug,
      url: validatedData.url,
      featured: validatedData.featured,
    };

    let category;

    if (body.id) {
      // Update existing category
      category = await db.category.update({
        where: { id: body.id },
        data: categoryData,
      });
    } else {
      // Create new category
      category = await db.category.create({
        data: {
          ...categoryData,
          id: uuidv4(),
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: body.id ? "Categoria aggiornata con successo" : "Categoria creata con successo",
      data: category
    });

  } catch (error) {
    console.error("Errore nella gestione della categoria:", error);
    
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