import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
        { error: "Accesso negato. Solo gli admin possono eliminare le categorie." },
        { status: 403 }
      );
    }

    const categoryId = params.id;

    if (!categoryId) {
      return NextResponse.json(
        { error: "ID categoria richiesto" },
        { status: 400 }
      );
    }

    // Verifica se la categoria esiste
    const existingCategory = await db.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Categoria non trovata" },
        { status: 404 }
      );
    }

    // Verifica se ci sono sottocategorie collegate
    const subCategoriesCount = await db.subCategory.count({
      where: { categoryId: categoryId },
    });

    if (subCategoriesCount > 0) {
      return NextResponse.json(
        { 
          error: `Impossibile eliminare la categoria. Ci sono ${subCategoriesCount} sottocategorie collegate.`,
          details: "Elimina prima tutte le sottocategorie."
        },
        { status: 400 }
      );
    }

    // Elimina la categoria
    await db.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({
      success: true,
      message: "Categoria eliminata con successo"
    });

  } catch (error) {
    console.error("Errore nell'eliminazione della categoria:", error);
    
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;

    if (!categoryId) {
      return NextResponse.json(
        { error: "ID categoria richiesto" },
        { status: 400 }
      );
    }

    const category = await db.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoria non trovata" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category
    });

  } catch (error) {
    console.error("Errore nel recupero della categoria:", error);
    
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}