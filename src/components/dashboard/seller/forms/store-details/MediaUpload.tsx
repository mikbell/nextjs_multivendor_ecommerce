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
import ImageUpload from "@/components/dashboard/shared/image-upload";

interface MediaUploadProps {
  form: UseFormReturn<z.input<typeof StoreFormSchema>, unknown, z.infer<typeof StoreFormSchema>>;
}

const MediaUpload: FC<MediaUploadProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="logo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Logo</FormLabel>
            <FormControl>
              <ImageUpload
                value={field.value ? [field.value] : []}
                onChange={(urls) => field.onChange(urls[0] ?? "")}
                onRemove={() => field.onChange("")}
                type="logo"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="cover"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cover</FormLabel>
            <FormControl>
              <ImageUpload
                value={field.value ? [field.value] : []}
                onChange={(urls) => field.onChange(urls[0] ?? "")}
                onRemove={() => field.onChange("")}
                type="cover"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default MediaUpload;