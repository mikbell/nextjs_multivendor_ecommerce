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
import { Textarea } from "@/components/ui/textarea";

interface SubCategoryDescriptionProps {
  form: UseFormReturn<z.input<typeof SubCategoryFormSchema>, unknown, z.infer<typeof SubCategoryFormSchema>>;
}

const SubCategoryDescription: FC<SubCategoryDescriptionProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Descrizione sottocategoria</FormLabel>
          <FormDescription>
            La descrizione verrà mostrata agli utenti per spiegare il tipo specifico di prodotti.
          </FormDescription>
          <FormControl>
            <Textarea
              placeholder="Descrivi questa sottocategoria..."
              className="min-h-[100px]"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SubCategoryDescription;