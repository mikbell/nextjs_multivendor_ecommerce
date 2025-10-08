import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { SubCategoryFormSchema } from "@/lib/schemas/category";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface SubCategorySettingsProps {
  form: UseFormReturn<z.input<typeof SubCategoryFormSchema>, unknown, z.infer<typeof SubCategoryFormSchema>>;
}

const SubCategorySettings: FC<SubCategorySettingsProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="featured"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={(checked) =>
                field.onChange(checked === true)
              }
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>Sottocategoria in evidenza</FormLabel>
            <FormDescription>
              Le sottocategorie in evidenza vengono mostrate nelle sezioni principali della categoria.
            </FormDescription>
          </div>
        </FormItem>
      )}
    />
  );
};

export default SubCategorySettings;