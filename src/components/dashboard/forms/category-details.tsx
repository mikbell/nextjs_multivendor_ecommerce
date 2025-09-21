"use client";

import { Category } from "@/generated/prisma";
import { CategoryFormSchema } from "@/lib/schemas";
import { FC, useEffect, useMemo } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import ImageUpload from "../shared/image-upload";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CategoryDetailsProps {
  data?: Category;
  cloudinary_key: string;
}

const CategoryDetails: FC<CategoryDetailsProps> = ({
  data,
  cloudinary_key,
}) => {
  const router = useRouter(); // Initialize router here

  const defaultValues = useMemo<Partial<z.input<typeof CategoryFormSchema>>>(
    () => ({
      name: data?.name ?? "",
      image: data?.image ? [{ url: data.image }] : [],
      url: data?.url ?? "",
      featured: data?.featured ?? false,
    }),
    [data]
  );

  const form = useForm<
    z.input<typeof CategoryFormSchema>,
    unknown,
    z.infer<typeof CategoryFormSchema>
  >({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues,
  });

  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: z.infer<typeof CategoryFormSchema>) => {
    try {
      const payload = {
        id: data?.id ? data.id : uuid(),
        name: values.name,
        image: values.image[0].url,
        url: values.url,
        featured: values.featured,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const res = await fetch("/api/categories/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Errore durante il salvataggio.");
      }
      toast.success(data?.id ? "Modifica categoria" : "Nuova categoria", {
        description: "Categoria salvata con successo.",
      });
      if (data?.id) {
        router.push("/dashboard/admin/categories/"); // Use router.push()
      } else {
        router.push("/dashboard/admin/categories"); // Use router.push()
      }
    } catch (error: Error | unknown) {
      console.log(error);
      toast.error(data?.id ? "Modifica categoria" : "Nuova categoria", {
        description: "Errore durante il salvataggio.",
      });
    }
  };

  useEffect(() => {
    if (data) {
      form.reset(defaultValues);
    }
  }, [data, defaultValues, form]);

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          Informazioni categoria
          <CardDescription>
            {data?.id ? `Modifica categoria: ${data?.name}` : "Nuova categoria"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-10"
              autoComplete="off"
              suppressHydrationWarning>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Immagine categoria</FormLabel>
                    <FormDescription>
                      Carica una sola immagine rappresentativa della categoria.
                    </FormDescription>
                    <FormControl>
                      <ImageUpload
                        type="standard"
                        cloudinary_key={cloudinary_key}
                        maxImages={1}
                        uploadText="Carica immagine"
                        removeText="Rimuovi"
                        value={(field.value ?? []).map((image) => image.url)}
                        disabled={isLoading}
                        onChange={(url) => field.onChange([{ url }])}
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome categoria</FormLabel>
                    <FormDescription>
                      Il nome verrà mostrato agli utenti e nei menu.
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="Nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL categoria</FormLabel>
                    <FormDescription>
                      Inserisci lo slug (es. <code>/t-shirt</code>). Niente
                      spazi o caratteri speciali.
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="/url-categoria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvataggio..." : "Salva"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default CategoryDetails;
