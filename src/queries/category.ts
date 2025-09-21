"use server";

import { Category } from "@/generated/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const upsertCategory = async (category: Category) => {
	try {
		const user = await currentUser();

		if (!user) {
			throw new Error("Non autenticato.");
		}

		if (user.privateMetadata.role !== "ADMIN") {
			throw new Error("Non hai i permessi necessari.");
		}

		if (!category) {
			throw new Error("Dati categoria non forniti.");
		}

		const existingCategory = await db.category.findFirst({
			where: {
				AND: [
					{
						OR: [{ name: category.name }, { slug: category.slug }],
					},
					{
						NOT: {
							id: category.id,
						},
					},
				],
			},
		});

		if (existingCategory) {
			let errorMessage = "";

			if (existingCategory.name === category.name) {
				errorMessage = "Nome categoria esistente.";
			} else if (existingCategory.slug === category.slug) {
				errorMessage = "Slug categoria esistente.";
			}

			throw new Error(errorMessage);
		}

		const categoryDetails = await db.category.upsert({
			where: {
				id: category.id,
			},
			update: category,
			create: category,
		});

		return categoryDetails;
	} catch (error) {
		console.log(error);
	}
};

export const getAllCategories = async () => {
	try {
		const categories = await db.category.findMany({
			orderBy: {
				name: "asc",
			},
		});
		return categories;
	} catch (error) {
		console.log(error);
		// Ensure a consistent return type (never undefined)
		return [];
	}
};

export const getCategoryById = async (id: string) => {
    try {
        if (!id) throw new Error("ID categoria mancante");
        const category = await db.category.findUnique({
            where: { id },
        });
        return category || null;
    } catch (error) {
        console.log(error);
        return null;
    }
};
