"use client";

import { HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TipsDropdown } from "@/components/ui/TipsDropdown";
import ClickToAddInputs from "./ClickToAddInputs";
import InputFieldset from "@/components/shared/input-fieldset";
import { ProductSpecsProps } from "../types";

export const ProductQuestions = ({
  form,
  isNewVariantPage,
  questions,
  setQuestions,
}: Omit<ProductSpecsProps, "productSpecs" | "setProductSpecs" | "variantSpecs" | "setVariantSpecs"> & {
  questions: { question: string; answer: string }[];
  setQuestions: (questions: { question: string; answer: string }[]) => void;
}) => {
  const debugForceShowAllFields = process.env.NODE_ENV === "development" && false;

  // Don't show for new variant pages unless debug is enabled
  if (isNewVariantPage && !debugForceShowAllFields) {
    return null;
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <HelpCircle className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl">
              Domande Frequenti
            </CardTitle>
            <CardDescription>
              Aggiungi domande e risposte per aiutare i clienti
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <TipsDropdown 
          title="❓ Consigli per le Domande Frequenti"
          tips={[
            "Anticipate le domande più comuni dei clienti per ridurre le richieste di supporto",
            "Includete domande su: dimensioni, materiali, cura del prodotto, spedizione",
            "Per l'abbigliamento: vestibilità, taglie, tessuti, istruzioni di lavaggio",
            "Per l'elettronica: specifiche tecniche, compatibilità, garanzia",
            "Risposte chiare e dettagliate aumentano la fiducia del cliente",
            "Usate un tono amichevole e professionale nelle risposte",
            "Aggiornate le FAQ in base alle domande ricevute dai clienti"
          ]}
        />

      <InputFieldset label="Questions & Answers">

        <div className="w-full flex flex-col gap-y-3">
          <ClickToAddInputs
            details={questions}
            setDetails={setQuestions}
            initialDetail={{
              question: "",
              answer: "",
            }}
            containerClassName="flex-1"
            inputClassName="w-full"
          />
          {form.formState.errors.questions && (
            <span className="text-sm font-medium text-destructive">
              {form.formState.errors.questions.message}
            </span>
          )}
        </div>

        {questions.length > 0 && (
          <Alert className="mt-6">
            <AlertDescription>
              <p className="font-medium mb-3">
                ✅ Preview delle FAQ ({questions.length} domande):
              </p>
              <div className="space-y-3">
                {questions.slice(0, 3).map((q, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg border">
                    <p className="text-sm font-semibold mb-1">
                      Q: {q.question || "Domanda vuota"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      A: {q.answer || "Risposta mancante"}
                    </p>
                  </div>
                ))}
                {questions.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    ... e altre {questions.length - 3} domande
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </InputFieldset>
      </CardContent>
    </Card>
  );
};