import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { StoreFormSchema } from "@/lib/schemas";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface StoreDescriptionProps {
  form: UseFormReturn<z.input<typeof StoreFormSchema>, unknown, z.infer<typeof StoreFormSchema>>;
}

const StoreDescription: FC<StoreDescriptionProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Descrizione</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Descrivi il tuo negozio"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StoreDescription;