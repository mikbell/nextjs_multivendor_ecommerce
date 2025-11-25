import { FC } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";
import { CategoryDescriptionProps } from "./types";
import { STYLES, VALIDATION_LIMITS } from "./constants";
import { getCharacterCountDisplay } from "./utils";

const CategoryDescription: FC<CategoryDescriptionProps> = ({ form, isLoading }) => {
  const description = form.watch("description") || "";
  const isDescriptionValid = description.length >= VALIDATION_LIMITS.DESCRIPTION_MIN_LENGTH && 
                            description.length <= VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH;

  return (
    <div className={STYLES.CARD_BASE}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 ${STYLES.GRADIENT_PURPLE} rounded-xl`}>
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">
            Descrizione
          </h3>
          <p className="text-muted-foreground text-sm">
            Descrizione dettagliata della categoria
          </p>
        </div>
        {isDescriptionValid && (
          <Badge className="ml-auto bg-green-100 text-green-800">
            Completa
          </Badge>
        )}
      </div>

      <FormField
        disabled={isLoading}
        control={form.control}
        name="description"
        render={({ field, fieldState }) => {
          const charCount = getCharacterCountDisplay(
            field.value?.length || 0,
            VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH,
            VALIDATION_LIMITS.DESCRIPTION_MIN_LENGTH
          );
          
          return (
            <FormItem>
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Descrizione categoria
                <Badge variant="secondary" className="text-xs">
                  Importante
                </Badge>
                {isDescriptionValid && !fieldState.error && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                {!isDescriptionValid && field.value && field.value.length > 0 && (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
              </FormLabel>
              <FormDescription className="text-sm text-muted-foreground">
                Spiega ai clienti che tipo di prodotti troveranno in questa categoria. Una buona descrizione aiuta nella SEO e migliora l&apos;esperienza utente.
              </FormDescription>
              <FormControl>
                <div className="relative">
                  {isLoading && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  )}
                  <Textarea
                    placeholder="Descrivi questa categoria e i prodotti che contiene. Ad esempio: 'Scopri la nostra collezione di abbigliamento casual e formale per uomo e donna. Abiti eleganti, jeans, t-shirt e accessori delle migliori marche.'"
                    className="min-h-[120px] text-base resize-none"
                    maxLength={VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH}
                    {...field}
                  />
                </div>
              </FormControl>
              <div className="flex justify-between items-start">
                <FormMessage />
                <span className={`text-xs ${charCount.color} ml-auto`}>
                  {charCount.text}
                </span>
              </div>
              
              {/* SEO Tips */}
              {field.value && field.value.length < VALIDATION_LIMITS.DESCRIPTION_MIN_LENGTH && (
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Suggerimento SEO:</p>
                      <ul className="text-xs space-y-0.5 text-yellow-700">
                        <li>• Aggiungi almeno {VALIDATION_LIMITS.DESCRIPTION_MIN_LENGTH} caratteri per migliorare il posizionamento</li>
                        <li>• Usa parole chiave correlate alla categoria</li>
                        <li>• Descrivi i benefici per il cliente</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Quality indicator */}
              {isDescriptionValid && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-medium text-green-800">
                      Perfetto! Descrizione completa e ottimizzata per i motori di ricerca.
                    </p>
                  </div>
                </div>
              )}
            </FormItem>
          );
        }}
      />
    </div>
  );
};

export default CategoryDescription;