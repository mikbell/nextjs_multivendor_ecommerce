"use client";

import { Package } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NumberInput } from "@tremor/react";
import { TipsDropdown } from "@/components/ui/TipsDropdown";
import { BaseFormProps } from "../types";

export const ProductTechnicalDetails = ({
  form,
  isLoading,
}: BaseFormProps) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 p-8 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
          <Package className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Dettagli Tecnici
          </h3>
          <p className="text-gray-600 text-sm">
            SKU e specifiche tecniche del prodotto
          </p>
        </div>
      </div>

      <TipsDropdown 
        title="📎 Consigli per i Dettagli Tecnici"
        tips={[
          "Il SKU deve essere unico per ogni variante del prodotto",
          "Usa un formato consistente per i SKU (es. CATEGORIA-PRODOTTO-COLORE-TAGLIA)",
          "Evita caratteri speciali nei codici SKU, usa solo lettere, numeri e trattini",
          "Il peso è fondamentale per calcolare le spese di spedizione accurate",
          "Considera il peso dell'imballo oltre al peso del prodotto stesso",
          "Per prodotti molto leggeri, imposta comunque un peso minimo di 0.01 kg",
          "Mantieni un database dei pesi per categoria di prodotto per coerenza"
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SKU */}
        <FormField
          disabled={isLoading}
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
                SKU (Codice Prodotto)
                <Badge variant="destructive" className="text-xs">
                  Richiesto
                </Badge>
              </FormLabel>
              <FormDescription className="text-sm text-gray-600">
                Codice identificativo unico (lettere e numeri)
              </FormDescription>
              <FormControl>
                <Input
                  placeholder="es. MAG-001-RED-M"
                  {...field}
                  className="h-12 text-base focus:ring-2 focus:ring-green-500 font-mono"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Weight */}
        <FormField
          disabled={isLoading}
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-gray-900 flex items-center gap-2">
                Peso del Prodotto
                <Badge variant="destructive" className="text-xs">
                  Richiesto
                </Badge>
              </FormLabel>
              <FormDescription className="text-sm text-gray-600">
                Peso in chilogrammi per la spedizione
              </FormDescription>
              <FormControl>
                <NumberInput
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  placeholder="0.5"
                  min={0.01}
                  step={0.01}
                  className="h-12 text-base focus:ring-2 focus:ring-green-500 !shadow-none rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};