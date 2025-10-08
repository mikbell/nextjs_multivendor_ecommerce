import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { SubCategoryFormSchema } from "@/lib/schemas/category";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import ImageUpload from "@/components/dashboard/shared/image-upload";

interface SubCategoryImageProps {
  form: UseFormReturn<z.input<typeof SubCategoryFormSchema>, unknown, z.infer<typeof SubCategoryFormSchema>>;
  isLoading?: boolean;
}

const SubCategoryImage: FC<SubCategoryImageProps> = ({ form, isLoading = false }) => {
  return (
    <FormField
      control={form.control}
      name="image"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Immagine sottocategoria</FormLabel>
          <FormDescription>
            Carica una sola immagine rappresentativa della sottocategoria.
          </FormDescription>
          <FormControl>
            <ImageUpload
              type="standard"
              maxImages={1}
              uploadText="Carica immagine"
              removeText="Rimuovi"
              value={(field.value ?? []).map((image) => image.url)}
              disabled={isLoading}
              onChange={(urls) => field.onChange(urls.map(url => ({ url })))}
              onRemove={(url) =>
                field.onChange(
                  (field.value ?? []).filter(
                    (image) => image.url !== url
                  )
                )
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SubCategoryImage;