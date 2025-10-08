import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { Category } from "@/generated/prisma";
import { SubCategoryFormSchema } from "@/lib/schemas/category";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategorySelectorProps {
  form: UseFormReturn<z.input<typeof SubCategoryFormSchema>, unknown, z.infer<typeof SubCategoryFormSchema>>;
  categories: Category[];
  isLoading?: boolean;
}

const CategorySelector: FC<CategorySelectorProps> = ({ form, categories, isLoading = false }) => {
  return (
    <FormField
      control={form.control}
      name="categoryId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Categoria padre</FormLabel>
          <FormDescription>
            Seleziona la categoria a cui appartiene questa sottocategoria.
          </FormDescription>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona una categoria" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CategorySelector;