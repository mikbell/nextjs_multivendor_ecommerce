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
	FormDescription,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface CategoryDetailsProps {
	data?: Category;
}

const CategoryDetails: FC<CategoryDetailsProps> = ({ data }) => {
	const defaultValues = useMemo<
		Partial<z.input<typeof CategoryFormSchema>> | undefined
	>(
		() =>
			data
				? {
						name: data?.name,
						image: data?.image ? [{ url: data.image }] : [],
						url: data?.url,
						featured: data?.featured,
				  }
				: undefined,
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
		console.log(values);
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
							className="space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nome categoria</FormLabel>
										<FormControl>
											<Input placeholder="Nome" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="image"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Immagine categoria</FormLabel>
										<FormControl>
											<Input
												placeholder="Immagine"
												value={(field.value && field.value[0]?.url) ?? ""}
												onChange={(e) =>
													field.onChange([
														{ url: (e.target as HTMLInputElement).value },
													])
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
							<FormField
								control={form.control}
								name="url"
								render={({ field }) => (
									<FormItem>
										<FormLabel>URL categoria</FormLabel>
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
							<Button type="submit" disabled={isLoading} className="w-full">
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
