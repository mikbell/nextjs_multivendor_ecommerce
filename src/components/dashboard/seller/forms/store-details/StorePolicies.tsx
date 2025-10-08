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

interface StorePoliciesProps {
  form: UseFormReturn<z.input<typeof StoreFormSchema>, unknown, z.infer<typeof StoreFormSchema>>;
}

const StorePolicies: FC<StorePoliciesProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="returnPolicy"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Politica di reso</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Dettagli sulla politica di reso"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StorePolicies;