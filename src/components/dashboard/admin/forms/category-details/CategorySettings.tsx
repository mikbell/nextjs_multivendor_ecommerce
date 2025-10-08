import { FC } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Star, Settings, TrendingUp, Eye } from "lucide-react";
import { CategorySettingsProps } from "./types";
import { STYLES } from "./constants";

const CategorySettings: FC<CategorySettingsProps> = ({ form, isLoading }) => {
  const isFeatured = form.watch("featured");

  return (
    <div className={STYLES.CARD_BASE}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 ${STYLES.GRADIENT_ORANGE} rounded-xl`}>
          <Settings className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">
            Impostazioni
          </h3>
          <p className="text-muted-foreground text-sm">
            Configurazioni e visibilità della categoria
          </p>
        </div>
        {isFeatured && (
          <Badge className="ml-auto bg-orange-100 text-orange-800">
            In evidenza
          </Badge>
        )}
      </div>

      <div className="space-y-6">
        {/* Featured Setting */}
        <FormField
          disabled={isLoading}
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-4 space-y-0 rounded-lg border-2 border-dashed border-orange-200 bg-orange-50/30 p-6 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-200">
              <FormControl>
                <div className="relative">
                  {isLoading && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    </div>
                  )}
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    className="mt-1 h-5 w-5 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                  />
                </div>
              </FormControl>
              <div className="flex-1 space-y-2 leading-none">
                <FormLabel className="text-base font-semibold text-foreground flex items-center gap-2 cursor-pointer">
                  <Star className="h-4 w-4 text-orange-500" />
                  Categoria in evidenza
                  <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800 border-orange-200">
                    Opzionale
                  </Badge>
                </FormLabel>
                <FormDescription className="text-sm text-muted-foreground leading-relaxed">
                  Le categorie in evidenza vengono mostrate nella homepage, nei menu principali e ricevono maggiore visibilità nelle ricerche.
                </FormDescription>
                
                {/* Benefits when featured */}
                {field.value && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-orange-800 mb-2">Vantaggi categoria in evidenza:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-xs text-orange-700">
                        <TrendingUp className="h-3 w-3" />
                        Maggiore visibilità
                      </div>
                      <div className="flex items-center gap-2 text-xs text-orange-700">
                        <Eye className="h-3 w-3" />
                        Posizione privilegiata
                      </div>
                      <div className="flex items-center gap-2 text-xs text-orange-700">
                        <Star className="h-3 w-3" />
                        Priorità nei menu
                      </div>
                      <div className="flex items-center gap-2 text-xs text-orange-700">
                        <Settings className="h-3 w-3" />
                        SEO ottimizzato
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Suggestion when not featured */}
                {!field.value && (
                  <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="text-xs text-blue-800">
                      <strong>Suggerimento:</strong> Abilita questa opzione se vuoi che la categoria sia prominente nel tuo store e attiri più attenzione dai visitatori.
                    </p>
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Info box */}
        <div className="p-4 bg-muted/30 rounded-lg border border-muted">
          <div className="flex items-start gap-3">
            <Settings className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm text-foreground mb-1">Gestione avanzata</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Altre impostazioni avanzate come ordinamento, filtri personalizzati e regole di visualizzazione saranno disponibili dopo la creazione della categoria.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySettings;