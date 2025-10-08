import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateSlug,
	prisma,
	generateImageUrl,
	categoriesData,
} from "./seed-utils.js";
import { customAlphabet } from "nanoid";
const generateId = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 12);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedCountries() {
	console.log("🌍 Seeding countries...");

	try {
		// Read countries from existing JSON file
		const countriesPath = path.join(__dirname, "../src/data/countries.json");
		const countriesData = JSON.parse(fs.readFileSync(countriesPath, "utf8"));

		// Transform countries data for database
		const countries = countriesData.map((country) => ({
			id: generateId(),
			name: country.name,
			code: country.code,
		}));

		// Insert countries in chunks to avoid timeout
		const chunkSize = 50;
		for (let i = 0; i < countries.length; i += chunkSize) {
			const chunk = countries.slice(i, i + chunkSize);
			await prisma.country.createMany({
				data: chunk,
				skipDuplicates: true,
			});
		}

		console.log(`✅ Seeded ${countries.length} countries`);
		return countries;
	} catch (error) {
		console.error("❌ Error seeding countries:", error);
		throw error;
	}
}

async function seedOfferTags() {
	console.log("🏷️ Seeding offer tags...");

	try {
		const offerTags = [
			{ name: "Saldi Estivi", url: "/offers/summer-sale" },
			{ name: "Black Friday", url: "/offers/black-friday" },
			{ name: "Nuovi Arrivi", url: "/offers/new-arrivals" },
			{ name: "Liquidazione", url: "/offers/clearance" },
			{ name: "Offerta Limitata", url: "/offers/limited-time" },
			{ name: "Sconto 50%", url: "/offers/50-percent-off" },
			{ name: "Promozione Esclusiva", url: "/offers/exclusive" },
			{ name: "Fine Stagione", url: "/offers/end-of-season" },
		].map((tag) => ({
			id: generateId(),
			...tag,
		}));

		await prisma.offerTag.createMany({
			data: offerTags,
			skipDuplicates: true,
		});

		console.log(`✅ Seeded ${offerTags.length} offer tags`);
		return offerTags;
	} catch (error) {
		console.error("❌ Error seeding offer tags:", error);
		throw error;
	}
}

async function seedCategories() {
	console.log("📂 Seeding categories...");

	try {
		const categories = [];

		for (let i = 0; i < categoriesData.length; i++) {
			const categoryData = categoriesData[i];
			const slug = generateSlug(categoryData.name);

			const category = {
				id: generateId(),
				name: categoryData.name,
				description: categoryData.description,
				slug: slug,
				url: `/categories/${slug}`,
				image: generateImageUrl("category", i + 1),
				featured: i < 2, // Make first 2 categories featured
			};

			categories.push(category);
		}

		await prisma.category.createMany({
			data: categories,
			skipDuplicates: true,
		});

		console.log(`✅ Seeded ${categories.length} categories`);
		return categories;
	} catch (error) {
		console.error("❌ Error seeding categories:", error);
		throw error;
	}
}

async function seedSubCategories() {
	console.log("📁 Seeding subcategories...");

	try {
		// Get existing categories
		const categories = await prisma.category.findMany();

		const subcategories = [];

		for (let i = 0; i < categoriesData.length; i++) {
			const categoryData = categoriesData[i];
			const category = categories[i];

			if (category && categoryData.subcategories) {
				for (let j = 0; j < categoryData.subcategories.length; j++) {
					const subCatName = categoryData.subcategories[j];
					const slug = generateSlug(subCatName);

					const subcategory = {
						id: generateId(),
						name: subCatName,
						description: `Collezione ${subCatName.toLowerCase()} della categoria ${
							category.name
						}`,
						slug: slug,
						url: `/categories/${category.slug}/${slug}`,
						image: generateImageUrl("subcategory", i * 10 + j),
						categoryId: category.id,
						featured: j === 0, // Make first subcategory of each category featured
						updatedAt: new Date(),
					};

					subcategories.push(subcategory);
				}
			}
		}

		await prisma.subCategory.createMany({
			data: subcategories,
			skipDuplicates: true,
		});

		console.log(`✅ Seeded ${subcategories.length} subcategories`);
		return subcategories;
	} catch (error) {
		console.error("❌ Error seeding subcategories:", error);
		throw error;
	}
}

async function seedBaseData() {
	console.log("🚀 Starting base data seeding...");

	try {
		const countries = await seedCountries();
		const offerTags = await seedOfferTags();
		const categories = await seedCategories();
		const subcategories = await seedSubCategories();

		console.log("✅ Base data seeding completed successfully!");

		return {
			countries,
			offerTags,
			categories,
			subcategories,
		};
	} catch (error) {
		console.error("❌ Base data seeding failed:", error);
		throw error;
	}
}

export {
	seedCountries,
	seedOfferTags,
	seedCategories,
	seedSubCategories,
	seedBaseData,
};
