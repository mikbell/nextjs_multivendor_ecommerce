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

		const existingCategory = await prisma?.category.findFirst({
			where: {
				AND: [
					{
						OR: [{ name: category.name }, { url: category.url }],
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
			} else if (existingCategory.url === category.url) {
				errorMessage = "URL categoria esistente.";
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
