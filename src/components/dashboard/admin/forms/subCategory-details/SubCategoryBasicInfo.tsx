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
import { Input } from "@/components/ui/input";

interface SubCategoryBasicInfoProps {
  form: UseFormReturn<z.input<typeof SubCategoryFormSchema>, unknown, z.infer<typeof SubCategoryFormSchema>>;
}

const SubCategoryBasicInfo: FC<SubCategoryBasicInfoProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome sottocategoria</FormLabel>
              <FormDescription>
                Il nome verrà mostrato agli utenti e nei menu.
              </FormDescription>
              <FormControl>
                <Input placeholder="Nome sottocategoria" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug sottocategoria</FormLabel>
              <FormDescription>
                Inserisci lo slug (es. <code>t-shirt-uomo</code>). Niente spazi o caratteri speciali.
              </FormDescription>
              <FormControl>
                <Input placeholder="slug-sottocategoria" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL sottocategoria</FormLabel>
              <FormDescription>
                URL identificativo per la sottocategoria (es. <code>t-shirt-casual</code>).
              </FormDescription>
              <FormControl>
                <Input placeholder="url-sottocategoria" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default SubCategoryBasicInfo;