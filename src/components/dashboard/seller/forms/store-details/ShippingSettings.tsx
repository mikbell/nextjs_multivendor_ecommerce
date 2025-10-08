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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface ShippingSettingsProps {
  form: UseFormReturn<z.input<typeof StoreFormSchema>, unknown, z.infer<typeof StoreFormSchema>>;
}

const ShippingSettings: FC<ShippingSettingsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormLabel>In evidenza</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="defaultShippingService"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Servizio di spedizione predefinito</FormLabel>
              <FormControl>
                <Input placeholder="es. DHL, Poste, ..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="defaultShippingFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spedizione (euro)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  name={field.name}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  value={Number(field.value ?? 0)}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="defaultDeliveryTimeMin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tempo consegna min (giorni)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  name={field.name}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  value={Number(field.value ?? 0)}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="defaultDeliveryTimeMax"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tempo consegna max (giorni)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  name={field.name}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  value={Number(field.value ?? 0)}
                  onChange={(e) => field.onChange(Number(e.target.value))}
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

export default ShippingSettings;