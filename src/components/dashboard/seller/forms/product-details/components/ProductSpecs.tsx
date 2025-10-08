"use client";

import { FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TipsDropdown } from "@/components/ui/TipsDropdown";
import ClickToAddInputs from "./ClickToAddInputs";
import InputFieldset from "@/components/shared/input-fieldset";
import { ProductSpecsProps } from "../types";

export const ProductSpecs = ({
  form,
  isNewVariantPage,
  productSpecs,
  setProductSpecs,
  variantSpecs,
  setVariantSpecs,
}: ProductSpecsProps) => {
  const debugForceShowAllFields = process.env.NODE_ENV === "development" && false;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl">
              Specifiche Tecniche
            </CardTitle>
            <CardDescription>
              Dettagli tecnici del prodotto e delle varianti
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <TipsDropdown 
          title="📊 Consigli per le Specifiche Tecniche"
          tips={[
            "Le specifiche prodotto sono condivise tra tutte le varianti (materiale, origine, garanzia)",
            "Le specifiche variante sono uniche per ogni variante (dimensioni, fit, colore specifico)",
            "Usa terminologia tecnica precisa ma comprensibile ai clienti",
            "Includi informazioni utili per la decisione d'acquisto (certificazioni, trattamenti speciali)",
            "Per l'abbigliamento: materiale, peso del tessuto, elasticità, vestibilità",
            "Per l'elettronica: specifiche tecniche, compatibilità, consumi energetici",
            "Evita informazioni ridondanti tra specifiche prodotto e variante"
          ]}
        />

      <InputFieldset 
        label="Specifiche"
        description={
          isNewVariantPage
            ? ""
            : "Nota: Le specifiche del prodotto sono le specifiche principali del prodotto (verranno visualizzate in ogni pagina di variante). Puoi aggiungere specifiche extra specifiche per questa variante usando la tab 'Specifiche Variante'."
        }
      >
        <Tabs
          defaultValue={
            isNewVariantPage ? "variantSpecs" : "productSpecs"
          }
          className="w-full"
        >
          {(!isNewVariantPage || debugForceShowAllFields) && (
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="productSpecs">
                Specifiche Prodotto
              </TabsTrigger>
              <TabsTrigger value="variantSpecs">
                Specifiche Variante
              </TabsTrigger>
            </TabsList>
          )}
          
          {/* Product Specifications Tab */}
          {(!isNewVariantPage || debugForceShowAllFields) && (
            <TabsContent value="productSpecs">
              <div className="w-full flex flex-col gap-y-3">
                <Alert className="mb-4">
                  <AlertDescription>
                    <p className="font-medium">Specifiche Prodotto - Caratteristiche generali che si applicano a tutte le varianti</p>
                    <p className="text-sm mt-1">
                      Es: Materiale, Paese di origine, Certificazioni, Garanzia, ecc.
                    </p>
                  </AlertDescription>
                </Alert>
                <ClickToAddInputs
                  details={productSpecs}
                  setDetails={setProductSpecs}
                  initialDetail={{
                    name: "",
                    value: "",
                  }}
                  containerClassName="flex-1"
                  inputClassName="w-full"
                />
                {form.formState.errors.product_specs && (
                  <span className="text-sm font-medium text-destructive">
                    {form.formState.errors.product_specs.message}
                  </span>
                )}
              </div>
            </TabsContent>
          )}

          {/* Variant Specifications Tab */}
          <TabsContent value="variantSpecs">
            <div className="w-full flex flex-col gap-y-3">
              <Alert className="mb-4">
                <AlertDescription>
                  <p className="font-medium">Specifiche Variante - Caratteristiche specifiche di questa variante</p>
                  <p className="text-sm mt-1">
                    Es: Dimensioni esatte, Vestibilità, Lavaggio specifico, Dettagli colore, ecc.
                  </p>
                </AlertDescription>
              </Alert>
              <ClickToAddInputs
                details={variantSpecs}
                setDetails={setVariantSpecs}
                initialDetail={{
                  name: "",
                  value: "",
                }}
                containerClassName="flex-1"
                inputClassName="w-full"
              />
              {form.formState.errors.variant_specs && (
                <span className="text-sm font-medium text-destructive">
                  {form.formState.errors.variant_specs.message}
                </span>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </InputFieldset>

        {/* Helper Section */}
        <Alert>
          <AlertDescription>
            <p className="font-medium mb-2">💡 Come compilare le specifiche:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold mb-1">Specifiche Prodotto (Generali):</p>
                <ul className="space-y-1">
                  <li>• Materiale: Cotone 100%</li>
                  <li>• Origine: Made in Italy</li>
                  <li>• Certificazione: OEKO-TEX</li>
                  <li>• Garanzia: 2 anni</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-1">Specifiche Variante (Specifiche):</p>
                <ul className="space-y-1">
                  <li>• Fit: Slim fit</li>
                  <li>• Colletto: Girocollo</li>
                  <li>• Lavaggio: 30°C delicato</li>
                  <li>• Lunghezza: 70cm (taglia M)</li>
                </ul>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};