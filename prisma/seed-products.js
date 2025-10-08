import {
	generateId,
	generateSlug,
	generateImageUrl,
	randomBetween,
	randomFloat,
	randomPick,
	randomPickMultiple,
	productNames,
	brands,
	generateProductDescription,
	clothingSizes,
	shoeSizes,
	accessorySizes,
	colors,
	prisma,
} from "./seed-utils.js";

function getSizesForCategory(categoryName) {
	if (
		categoryName.toLowerCase().includes("scarpe") ||
		categoryName.toLowerCase().includes("sandali") ||
		categoryName.toLowerCase().includes("stivali")
	) {
		return shoeSizes;
	} else if (
		categoryName.toLowerCase().includes("accessori") ||
		categoryName.toLowerCase().includes("gioielli") ||
		categoryName.toLowerCase().includes("orologi")
	) {
		return accessorySizes;
	} else {
		return clothingSizes;
	}
}

function generateSKU(productName, variantName, size) {
	const productCode = productName.slice(0, 3).toUpperCase();
	const variantCode = variantName.slice(0, 3).toUpperCase();
	const sizeCode = size.replace(" ", "");
	const randomNum = Math.floor(Math.random() * 1000)
		.toString()
		.padStart(3, "0");
	return `${productCode}-${variantCode}-${sizeCode}-${randomNum}`;
}

async function seedProducts() {
	console.log("🛍️ Seeding products...");

	try {
		// Get necessary data
		const stores = await prisma.store.findMany({ where: { status: "ACTIVE" } });
		const categories = await prisma.category.findMany();
		const subcategories = await prisma.subCategory.findMany();
		const offerTags = await prisma.offerTag.findMany();

		if (
			stores.length === 0 ||
			categories.length === 0 ||
			subcategories.length === 0
		) {
			throw new Error(
				"Required data not found. Please seed base data and stores first."
			);
		}

		const products = [];
		const productsPerStore = 8; // Each store will have 8 products

		for (const store of stores) {
			for (let i = 0; i < productsPerStore; i++) {
				const category = randomPick(categories);
				const storeSubcategories = subcategories.filter(
					(sc) => sc.categoryId === category.id
				);
				const subcategory = randomPick(storeSubcategories);

				if (!subcategory) continue;

				const productName = `${randomPick(productNames)} ${randomPick(brands)}`;
				const slug = generateSlug(`${productName} ${store.name} ${Date.now()}`);

				const product = {
					id: generateId(),
					name: productName,
					description: generateProductDescription(),
					slug: slug,
					brand: randomPick(brands),
					rating: randomFloat(3.5, 5.0, 1),
					storeId: store.id,
					categoryId: category.id,
					subCategoryId: subcategory.id,
					freeShippingForAllCountries: randomBetween(1, 10) <= 2, // 20% chance
					numReviews: randomBetween(0, 25),
					offerTagId:
						randomBetween(1, 10) <= 3 ? randomPick(offerTags).id : null, // 30% chance
					sales: randomBetween(0, 100),
					shippingFeeMethod: randomPick(["ITEM", "WEIGHT", "FIXED"]),
					views: randomBetween(0, 500),
				};

				products.push(product);
			}
		}

		// Insert products in chunks
		const chunkSize = 20;
		for (let i = 0; i < products.length; i += chunkSize) {
			const chunk = products.slice(i, i + chunkSize);
			await prisma.product.createMany({
				data: chunk,
				skipDuplicates: true,
			});
		}

		console.log(`✅ Seeded ${products.length} products`);
		return products;
	} catch (error) {
		console.error("❌ Error seeding products:", error);
		throw error;
	}
}

async function seedProductVariants() {
	console.log("🎨 Seeding product variants...");

	try {
		const products = await prisma.product.findMany();

		if (products.length === 0) {
			throw new Error("No products found. Please seed products first.");
		}

		const variants = [];

		for (const product of products) {
			// Each product will have 1-3 variants
			const numVariants = randomBetween(1, 3);

			for (let i = 0; i < numVariants; i++) {
				const variantName = i === 0 ? "Modello Standard" : `Variante ${i + 1}`;
				const slug = generateSlug(`${product.slug} ${variantName} ${i}`);

				const variant = {
					id: generateId(),
					slug: slug,
					keywords: `${product.name}, ${variantName}, moda, abbigliamento`,
					sku: generateSKU(product.name, variantName, "VAR"),
					productId: product.id,
					isSale: randomBetween(1, 10) <= 3, // 30% chance of being on sale
					saleEndDate:
						randomBetween(1, 10) <= 3
							? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
									.toISOString()
									.split("T")[0]
							: null,
					sales: randomBetween(0, 50),
					variantDescription: `Variante ${variantName} del prodotto ${
						product.name
					}. ${generateProductDescription()}`,
					variantImage: generateImageUrl("product", `${product.id}-${i}`),
					variantName: variantName,
					weight: randomFloat(0.1, 5.0, 2), // Weight in kg
				};

				variants.push(variant);
			}
		}

		// Insert variants in chunks
		const chunkSize = 30;
		for (let i = 0; i < variants.length; i += chunkSize) {
			const chunk = variants.slice(i, i + chunkSize);
			await prisma.productVariant.createMany({
				data: chunk,
				skipDuplicates: true,
			});
		}

		console.log(`✅ Seeded ${variants.length} product variants`);
		return variants;
	} catch (error) {
		console.error("❌ Error seeding product variants:", error);
		throw error;
	}
}

async function seedSizesAndColors() {
	console.log("📏 Seeding sizes and colors...");

	try {
		const products = await prisma.product.findMany({
			include: {
				subCategory: {
					include: {
						category: true,
					},
				},
			},
		});
		const variants = await prisma.productVariant.findMany();

		if (products.length === 0 || variants.length === 0) {
			throw new Error(
				"Products or variants not found. Please seed them first."
			);
		}

		const sizes = [];
		const productColors = [];

		for (const variant of variants) {
			const product = products.find((p) => p.id === variant.productId);
			if (!product) continue;

			// Get appropriate sizes for this category
			const availableSizes = getSizesForCategory(
				product.subCategory.category.name
			);
			const numSizes = randomBetween(3, Math.min(6, availableSizes.length));
			const selectedSizes = randomPickMultiple(availableSizes, numSizes);

			// Create sizes for this variant
			for (const sizeValue of selectedSizes) {
				const basePrice = randomFloat(19.99, 199.99, 2);
				const discount = randomBetween(0, 30); // 0-30% discount

				const size = {
					id: generateId(),
					size: sizeValue,
					quantity: randomBetween(0, 50),
					price: basePrice,
					discount: discount,
					productVariantId: variant.id,
				};

				sizes.push(size);
			}

			// Create colors for this variant
			const numColors = randomBetween(2, 5);
			const selectedColors = randomPickMultiple(colors, numColors);

			for (const colorName of selectedColors) {
				const color = {
					id: generateId(),
					name: colorName,
					productVariantId: variant.id,
				};

				productColors.push(color);
			}
		}

		// Insert sizes and colors in chunks
		const chunkSize = 50;

		for (let i = 0; i < sizes.length; i += chunkSize) {
			const chunk = sizes.slice(i, i + chunkSize);
			await prisma.size.createMany({
				data: chunk,
				skipDuplicates: true,
			});
		}

		for (let i = 0; i < productColors.length; i += chunkSize) {
			const chunk = productColors.slice(i, i + chunkSize);
			await prisma.color.createMany({
				data: chunk,
				skipDuplicates: true,
			});
		}

		console.log(
			`✅ Seeded ${sizes.length} sizes and ${productColors.length} colors`
		);
		return { sizes, colors: productColors };
	} catch (error) {
		console.error("❌ Error seeding sizes and colors:", error);
		throw error;
	}
}

async function seedProductImages() {
	console.log("🖼️ Seeding product images...");

	try {
		const variants = await prisma.productVariant.findMany();

		if (variants.length === 0) {
			throw new Error("No product variants found. Please seed variants first.");
		}

		const images = [];

		for (const variant of variants) {
			// Each variant will have 2-5 images
			const numImages = randomBetween(2, 5);

			for (let i = 0; i < numImages; i++) {
				const image = {
					id: generateId(),
					url: generateImageUrl("product", `${variant.id}-img-${i + 1}`),
					alt: `Immagine ${i + 1} di ${variant.variantName}`,
					order: i + 1,
					productVariantId: variant.id,
				};

				images.push(image);
			}
		}

		// Insert images in chunks
		const chunkSize = 50;
		for (let i = 0; i < images.length; i += chunkSize) {
			const chunk = images.slice(i, i + chunkSize);
			await prisma.productVariantImage.createMany({
				data: chunk,
				skipDuplicates: true,
			});
		}

		console.log(`✅ Seeded ${images.length} product images`);
		return images;
	} catch (error) {
		console.error("❌ Error seeding product images:", error);
		throw error;
	}
}

async function seedProductSpecs() {
	console.log("📋 Seeding product specifications...");

	try {
		const products = await prisma.product.findMany();
		const variants = await prisma.productVariant.findMany();

		if (products.length === 0) {
			throw new Error("No products found. Please seed products first.");
		}

		const specs = [];

		// Common specs for products
		const commonSpecs = [
			{
				name: "Materiale",
				values: [
					"Cotone 100%",
					"Poliestere",
					"Lino",
					"Seta",
					"Pelle",
					"Tessuto misto",
				],
			},
			{
				name: "Stagione",
				values: ["Primavera/Estate", "Autunno/Inverno", "Tutto l'anno"],
			},
			{
				name: "Stile",
				values: ["Casual", "Elegante", "Sportivo", "Business", "Trendy"],
			},
			{
				name: "Cura",
				values: [
					"Lavaggio a 30°",
					"Lavaggio a mano",
					"Solo lavaggio a secco",
					"Lavaggio delicato",
				],
			},
			{
				name: "Origine",
				values: ["Made in Italy", "Made in Europe", "Importato"],
			},
			{ name: "Genere", values: ["Uomo", "Donna", "Unisex"] },
		];

		// Add specs to products
		for (const product of products) {
			const numSpecs = randomBetween(3, 5);
			const selectedSpecs = randomPickMultiple(commonSpecs, numSpecs);

			for (const specType of selectedSpecs) {
				const spec = {
					id: generateId(),
					name: specType.name,
					value: randomPick(specType.values),
					productId: product.id,
					variantId: null,
				};

				specs.push(spec);
			}
		}

		// Add some variant-specific specs
		for (let i = 0; i < Math.min(variants.length / 2, 50); i++) {
			const variant = variants[i];
			const variantSpecs = [
				{ name: "Peso", value: `${randomFloat(0.1, 2.0, 1)} kg` },
				{
					name: "Dimensioni",
					value: `${randomBetween(20, 50)}x${randomBetween(
						20,
						50
					)}x${randomBetween(5, 15)} cm`,
				},
				{ name: "Colore principale", value: randomPick(colors) },
			];

			for (const variantSpec of variantSpecs) {
				const spec = {
					id: generateId(),
					name: variantSpec.name,
					value: variantSpec.value,
					productId: null,
					variantId: variant.id,
				};

				specs.push(spec);
			}
		}

		// Insert specs in chunks
		const chunkSize = 50;
		for (let i = 0; i < specs.length; i += chunkSize) {
			const chunk = specs.slice(i, i + chunkSize);
			await prisma.spec.createMany({
				data: chunk,
				skipDuplicates: true,
			});
		}

		console.log(`✅ Seeded ${specs.length} product specifications`);
		return specs;
	} catch (error) {
		console.error("❌ Error seeding product specs:", error);
		throw error;
	}
}

async function seedProductsHierarchy() {
	console.log("🚀 Starting products hierarchy seeding...");

	try {
		const products = await seedProducts();
		const variants = await seedProductVariants();
		const sizesAndColors = await seedSizesAndColors();
		const images = await seedProductImages();
		const specs = await seedProductSpecs();

		console.log("✅ Products hierarchy seeding completed successfully!");

		return {
			products,
			variants,
			sizes: sizesAndColors.sizes,
			colors: sizesAndColors.colors,
			images,
			specs,
		};
	} catch (error) {
		console.error("❌ Products hierarchy seeding failed:", error);
		throw error;
	}
}

export {
	seedProducts,
	seedProductVariants,
	seedSizesAndColors,
	seedProductImages,
	seedProductSpecs,
	seedProductsHierarchy,
};
