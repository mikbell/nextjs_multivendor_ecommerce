import { FC } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import ImageUpload from "@/components/dashboard/shared/image-upload";
import { Badge } from "@/components/ui/badge";
import { Image, Upload } from "lucide-react";
import { CategoryImageProps } from "./types";
import { STYLES } from "./constants";

const CategoryImage: FC<CategoryImageProps> = ({ form, isLoading = false }) => {
  const hasImage = form.watch("image")?.length > 0;

  return (
    <div className={STYLES.CARD_BASE}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 ${STYLES.GRADIENT_GREEN} rounded-xl`}>
          <Image className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">
            Immagine categoria
          </h3>
          <p className="text-muted-foreground text-sm">
            Immagine rappresentativa per la categoria
          </p>
        </div>
        {hasImage && (
          <Badge className="ml-auto bg-green-100 text-green-800">
            Caricata
          </Badge>
        )}
      </div>

      <FormField
        control={form.control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Immagine categoria
              <Badge variant="secondary" className="text-xs">
                Consigliata
              </Badge>
            </FormLabel>
            <FormDescription className="text-sm text-muted-foreground">
              Carica un&apos;immagine rappresentativa della categoria. Formati supportati: JPG, PNG, WEBP.
              Dimensioni consigliate: 400x300px.
            </FormDescription>
            <FormControl>
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                )}
                <ImageUpload
                  type="standard"
                  maxImages={1}
                  uploadText="Carica immagine categoria"
                  removeText="Rimuovi immagine"
                  value={
                    Array.isArray(field.value) 
                      ? field.value.map((image) => image.url).filter(Boolean)
                      : []
                  }
                  disabled={isLoading}
                  onChange={(urls) => {
                    // ImageUpload restituisce un array di string (URLs)
                    // Convertiamo in formato {url: string}[] richiesto dallo schema
                    const imageObjects = urls.map(url => ({ url }));
                    field.onChange(imageObjects);
                  }}
                  onRemove={(urlToRemove) => {
                    // Rimuovi l'immagine con l'URL specificato
                    const currentImages = Array.isArray(field.value) ? field.value : [];
                    const filteredImages = currentImages.filter(
                      (image) => image.url !== urlToRemove
                    );
                    field.onChange(filteredImages);
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
            {!hasImage && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Suggerimento:</strong> Un&apos;immagine accattivante aiuta i clienti a identificare rapidamente la categoria e migliora l&apos;aspetto del tuo store.
                </p>
              </div>
            )}
          </FormItem>
        )}
      />
    </div>
  );
};

export default CategoryImage;