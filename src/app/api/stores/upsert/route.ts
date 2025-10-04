import { NextRequest, NextResponse } from "next/server";
import { upsertStore } from "@/queries/store";

export async function POST(request: NextRequest) {
  try {
    // Ottieni i dati dal corpo della richiesta
    const body = await request.json();
    
    if (!body) {
      return NextResponse.json(
        { error: "Bad Request - No data provided" },
        { status: 400 }
      );
    }

    // Chiama la funzione upsertStore (gestisce auth internamente)
    const result = await upsertStore(body);

    return NextResponse.json(
      { 
        success: true, 
        data: result,
        message: body.id ? "Store updated successfully" : "Store created successfully"
      },
      { status: body.id ? 200 : 201 }
    );

  } catch (error) {
    console.error("Store upsert error:", error);
    
    // Gestione degli errori specifici
    if (error instanceof Error) {
      // Se l'errore contiene informazioni sui duplicati
      if (error.message.includes("already exists")) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 } // Conflict
        );
      }
      
      // Altri errori di validazione
      if (error.message.includes("Unauthorized") || error.message.includes("privileges")) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Errore generico del server
    return NextResponse.json(
      { error: "Internal Server Error - Something went wrong" },
      { status: 500 }
    );
  }
}

// Opzionalmente, supporta anche il metodo PUT
export async function PUT(request: NextRequest) {
  return POST(request);
}