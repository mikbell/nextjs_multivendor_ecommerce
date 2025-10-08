"use client";

import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FormProgressProps } from "../types";
import { useEffect, useState, useMemo } from "react";
import { ClientOnly } from "@/components/ui/client-only";

export const FormProgress = ({ formProgress, isNewVariantPage }: FormProgressProps) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoize classes to prevent recalculation
  const progressClasses = useMemo(() => ({
    iconContainer: formProgress >= 100 ? "bg-green-100 dark:bg-green-900" : "bg-primary/10",
    icon: formProgress >= 100 ? "text-green-600 dark:text-green-400" : "text-primary",
    percentage: 
      formProgress < 30 ? "text-destructive" :
      formProgress < 60 ? "text-yellow-500" :
      formProgress < 80 ? "text-primary" : "text-green-500",
    progressBar: 
      formProgress >= 100 ? "[&>div]:bg-green-500" : 
      formProgress >= 80 ? "[&>div]:bg-primary" :
      formProgress >= 60 ? "[&>div]:bg-yellow-500" :
      "[&>div]:bg-destructive",
    message: 
      formProgress < 30 ? "text-destructive" :
      formProgress < 60 ? "text-yellow-600" :
      formProgress < 80 ? "text-primary" :
      "text-green-600"
  }), [formProgress]);

  const getMessage = useMemo(() => {
    if (formProgress < 30) return "Inizia inserendo le informazioni di base del prodotto";
    if (formProgress < 60) return "Ottimo inizio! Continua ad aggiungere dettagli";
    if (formProgress < 80) return "Ci siamo quasi! Aggiungi le ultime informazioni";
    if (formProgress < 100) return "Perfetto! Completa gli ultimi campi";
    return "Fantastico! Il prodotto è pronto per essere pubblicato";
  }, [formProgress]);

  // Only evaluate environment-dependent logic on client
  const debugForceShowAllFields = isClient && process.env.NODE_ENV === "development" && false;

  if (isNewVariantPage && !debugForceShowAllFields) {
    return null;
  }

  return (
    <ClientOnly fallback={<div className="h-48 animate-pulse bg-gray-100 rounded-xl mb-8" />}>
      <Card className="shadow-md mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${progressClasses.iconContainer}`}>
                <CheckCircle className={`h-6 w-6 ${progressClasses.icon}`} />
              </div>
              <div>
                <CardTitle className="text-xl">
                  Progresso Completamento
                </CardTitle>
                <CardDescription>
                  Completa tutti i campi per ottimizzare la scheda prodotto
                </CardDescription>
              </div>
            </div>
            <div className={`text-3xl font-bold ${progressClasses.percentage}`}>
              {formProgress}%
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Progress 
              value={formProgress} 
              className={`w-full h-4 transition-all duration-1000 ease-out ${progressClasses.progressBar}`}
            />
            {formProgress >= 100 && (
              <div className="absolute right-0 top-0 -mt-2 -mr-2">
                <div className="animate-bounce">
                  <div className="bg-green-500 rounded-full p-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={`text-base font-medium transition-colors duration-300 ${progressClasses.message}`}>
            {getMessage}
          </div>
        </CardContent>
      </Card>
    </ClientOnly>
  );
};
