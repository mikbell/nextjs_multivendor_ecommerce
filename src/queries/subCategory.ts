"use server";

import { SubCategory } from "@/generated/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const upsertSubCategory = async (subCategory: SubCategory) => {
	try {
		const user = await currentUser();

		if (!user) {
			throw new Error("Non autenticato.");
		}

		if (user.privateMetadata.role !== "ADMIN") {
			throw new Error("Non hai i permessi necessari.");
		}

		if (!subCategory) {
			throw new Error("Dati sotto-categoria non forniti.");
		}

		const existingSubCategory = await db.subCategory.findFirst({
			where: {
				AND: [
					{
						OR: [{ name: subCategory.name }, { slug: subCategory.slug }],
					},
					{
						NOT: {
							id: subCategory.id,
						},
					},
				],
			},
		});

		if (existingSubCategory) {
			let errorMessage = "";

			if (existingSubCategory.name === subCategory.name) {
				errorMessage = "Nome categoria esistente.";
			} else if (existingSubCategory.slug === subCategory.slug) {
				errorMessage = "Slug categoria esistente.";
			}

			throw new Error(errorMessage);
		}

		const subCategoryDetails = await db.subCategory.upsert({
			where: {
				id: subCategory.id,
			},
			update: subCategory,
			create: subCategory,
		});

		return subCategoryDetails;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getAllSubCategories = async () => {
	try {
		const [subCategories, categories] = await Promise.all([
			db.subCategory.findMany({
				orderBy: {
					name: "asc",
				},
			}),
			db.category.findMany({
				select: {
					id: true,
					name: true,
				},
			}),
		]);

		// Manually join subcategories with categories
		const subCategoriesWithCategory = subCategories.map(subCategory => {
			const category = categories.find(cat => cat.id === subCategory.categoryId);
			return {
				...subCategory,
				category: category || { id: subCategory.categoryId, name: "Categoria non trovata" },
			};
		});

		return subCategoriesWithCategory;
	} catch (error) {
		console.log(error);
		// Ensure a consistent return type (never undefined)
		return [];
	}
};

export const getSubCategoryById = async (id: string) => {
	try {
		if (!id) throw new Error("ID categoria mancante");
		const subCategory = await db.subCategory.findUnique({
			where: { id },
		});
		return subCategory || null;
	} catch (error) {
		console.log(error);
		return null;
	}
};
