"use client";

import { Truck, Calendar, X } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  SimpleSelect,
  SimpleSelectOption,
} from "@/components/ui/simple-select";
import { Badge } from "@/components/ui/badge";
import { SimpleMultiSelect } from "@/components/ui/simple-multi-select";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TipsDropdown } from "@/components/ui/TipsDropdown";
import { ShippingSettingsProps } from "../types";

const shippingFeeMethods = [
  {
    value: "ITEM",
    description: "PER ARTICOLO - Spese calcolate in base al numero di prodotti",
  },
  {
    value: "WEIGHT",
    description: "PER PESO - Spese calcolate in base al peso del prodotto",
  },
  {
    value: "FIXED",
    description: "FISSO - Spese di spedizione fisse",
  },
];

export const ShippingSettings = ({
  form,
  isLoading,
  isNewVariantPage,
  countryOptions,
  handleDeleteCountryFreeShipping,
}: ShippingSettingsProps) => {
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
            <Truck className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl">
              Impostazioni Spedizione
            </CardTitle>
            <CardDescription>
              Configura metodi e costi di spedizione per questo prodotto
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <TipsDropdown 
          title="🚚 Consigli per la Spedizione"
          tips={[
            "Il metodo PER ARTICOLO è ideale per prodotti di dimensioni simili",
            "Il metodo PER PESO è perfetto per prodotti con pesi molto variabili",
            "Il metodo FISSO semplifica il calcolo ma può penalizzare ordini piccoli",
            "La spedizione gratuita aumenta le conversioni del 30-50%",
            "Considera di includere i costi di spedizione nel prezzo del prodotto",
            "I saldi con data di scadenza creano urgenza negli acquisti",
            "Testa diversi metodi di spedizione per trovare quello più efficace"
          ]}
        />

        {/* Shipping Method */}
        <FormField
          disabled={isLoading}
          control={form.control}
          name="shippingFeeMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Metodo di Calcolo Spedizione
              </FormLabel>
              <FormDescription className="mb-4">
                Scegli come calcolare le spese di spedizione per questo prodotto
              </FormDescription>
              <FormControl>
                <SimpleSelect
                  disabled={isLoading}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Seleziona metodo di spedizione"
                  className="h-10">
                  {shippingFeeMethods.map((method) => (
                    <SimpleSelectOption key={method.value} value={method.value}>
                      {method.value} - {method.description}
                    </SimpleSelectOption>
                  ))}
                </SimpleSelect>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Free Shipping */}
        <div className="p-6 bg-muted/50 border border-border rounded-lg">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Spedizione Gratuita
          </h4>
          
          <div className="space-y-4">
            {/* Free Shipping for All Countries */}
            <FormField
              control={form.control}
              name="freeShippingForAllCountries"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      Spedizione gratuita per tutti i paesi
                    </FormLabel>
                    <FormDescription className="text-xs">
                      Attiva la spedizione gratuita per tutti i paesi disponibili
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Specific Countries Free Shipping */}
            {!form.watch("freeShippingForAllCountries") && (
              <FormField
                control={form.control}
                name="freeShippingCountriesIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Spedizione gratuita per paesi specifici
                    </FormLabel>
                    <FormDescription className="text-xs mb-2">
                      Seleziona i paesi per cui offrire la spedizione gratuita
                    </FormDescription>
                    <FormControl>
                      <SimpleMultiSelect
                        options={countryOptions}
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="Seleziona paesi..."
                        searchPlaceholder="Cerca paese..."
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Display Selected Countries */}
            {form.watch("freeShippingCountriesIds")?.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">
                  Paesi con spedizione gratuita:
                </p>
                <div className="flex flex-wrap gap-2">
                  {form.watch("freeShippingCountriesIds").map((country, index) => (
                    <div
                      key={country.value}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                      <span>{country.label}</span>
                      <button
                        type="button"
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                        onClick={() => handleDeleteCountryFreeShipping(index)}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sale Settings */}
        <div className="p-6 bg-muted/50 border border-border rounded-lg">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Impostazioni Saldi
          </h4>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="isSale"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      Il prodotto è in saldo
                      {field.value && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          ATTIVO
                        </Badge>
                      )}
                    </FormLabel>
                    <FormDescription className="text-xs">
                      Attiva per mostrare il prodotto come &quot;In Saldo&quot;
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {form.watch("isSale") && (
              <FormField
                control={form.control}
                name="saleEndDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Data fine saldo
                    </FormLabel>
                    <FormDescription className="text-xs mb-2">
                      Seleziona quando termina il periodo di saldo
                    </FormDescription>
                    <FormControl>
                      <DateTimePicker
                        onChange={(date: Date | null) => {
                          field.onChange(date?.toISOString() || "");
                        }}
                        value={field.value ? new Date(field.value) : null}
                        disabled={isLoading}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        {/* Info Helper */}
        <Alert>
          <AlertDescription>
            <p className="font-medium mb-2">💡 Suggerimenti per la spedizione:</p>
            <ul className="text-sm space-y-1">
              <li>• Le spese di spedizione possono influenzare significativamente le vendite</li>
              <li>• La spedizione gratuita aumenta il tasso di conversione</li>
              <li>• Considera di includere i costi di spedizione nel prezzo del prodotto</li>
              <li>• I saldi temporanei creano urgenza negli acquisti</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};