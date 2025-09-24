import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const slugify = (value: string) =>
	value
		.normalize("NFD")
		.replace(/\p{Diacritic}+/gu, "")
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)+/g, "");

async function ensureUniqueSlug(
	model: "category" | "subCategory" | "store",
	baseSlug: string,
	excludeId: string
): Promise<string> {
	let candidate = baseSlug || "";
	if (!candidate) candidate = "item";
	let suffix = 0;

	// Helper to check existence by model
	const exists = async (slug: string) => {
		if (model === "category") {
			const found = await prisma.category.findFirst({
				where: { slug, NOT: { id: excludeId } },
			});
			return !!found;
		}
		if (model === "subCategory") {
			const found = await prisma.subCategory.findFirst({
				where: { slug, NOT: { id: excludeId } },
			});
			return !!found;
		}
		const found = await prisma.store.findFirst({
			where: { slug, NOT: { id: excludeId } },
		});
		return !!found;
	};

	let current = candidate;
	while (await exists(current)) {
		suffix += 1;
		current = `${candidate}-${suffix}`;
	}
	return current;
}

async function backfillCategories() {
	const items = await prisma.category.findMany();
	let updates = 0;
	for (const item of items) {
		const target = slugify(item.name);
		if (!item.slug || item.slug !== target) {
			const unique = await ensureUniqueSlug("category", target, item.id);
			if (unique !== item.slug) {
				await prisma.category.update({
					where: { id: item.id },
					data: { slug: unique },
				});
				updates += 1;
			}
		}
	}
	console.log(`Categories updated: ${updates}`);
}

async function backfillSubCategories() {
	const items = await prisma.subCategory.findMany();
	let updates = 0;
	for (const item of items) {
		const target = slugify(item.name);
		if (!item.slug || item.slug !== target) {
			const unique = await ensureUniqueSlug("subCategory", target, item.id);
			if (unique !== item.slug) {
				await prisma.subCategory.update({
					where: { id: item.id },
					data: { slug: unique },
				});
				updates += 1;
			}
		}
	}
	console.log(`SubCategories updated: ${updates}`);
}

async function backfillStores() {
	const items = await prisma.store.findMany();
	let updates = 0;
	for (const item of items) {
		const target = slugify(item.name);
		if (!item.slug || item.slug !== target) {
			const unique = await ensureUniqueSlug("store", target, item.id);
			if (unique !== item.slug) {
				await prisma.store.update({
					where: { id: item.id },
					data: { slug: unique },
				});
				updates += 1;
			}
		}
	}
	console.log(`Stores updated: ${updates}`);
}

async function main() {
	console.log("Starting slug backfill...");
	await backfillCategories();
	await backfillSubCategories();
	await backfillStores();
	console.log("Slug backfill completed.");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
