import {
	generateId,
	randomBetween,
	randomFloat,
	randomPick,
	randomPickMultiple,
	prisma,
} from "./seed-utils.js";

async function seedShippingRates() {
	console.log("🚚 Seeding shipping rates...");

	try {
		// Get stores and countries
		const stores = await prisma.store.findMany({ where: { status: "ACTIVE" } });
		const countries = await prisma.country.findMany();

		if (stores.length === 0 || countries.length === 0) {
			throw new Error("Stores or countries not found. Please seed them first.");
		}

		// Focus on key European countries
		const keyCountries = countries.filter((c) =>
			["IT", "FR", "DE", "ES", "GB", "NL", "BE", "CH", "AT"].includes(c.code)
		);

		const shippingServices = [
			"Corriere Espresso",
			"Posta Prioritaria",
			"Spedizione Standard",
			"Consegna Rapida",
			"Corriere Internazionale",
		];

		const rates = [];

		for (const store of stores) {
			// Each store will have shipping rates for 3-5 key countries
			const storeCountries = randomPickMultiple(
				keyCountries,
				randomBetween(3, 5)
			);

			for (const country of storeCountries) {
				// Each country will have 2-3 shipping services
				const numServices = randomBetween(2, 3);
				const storeServices = randomPickMultiple(shippingServices, numServices);

				for (const service of storeServices) {
					const rate = {
						id: generateId(),
						shippingService: service,
						shippingFeePerItem: randomFloat(2.0, 15.0, 2),
						shippingFeeForAdditionalItem: randomFloat(1.0, 8.0, 2),
						shippingFeePerKg: randomFloat(3.0, 12.0, 2),
						shippingFeeFixed: randomFloat(5.0, 25.0, 2),
						deliveryTimeMin: randomBetween(1, 3),
						deliveryTimeMax: randomBetween(5, 14),
						returnPolicy:
							"Reso gratuito entro 30 giorni. Spese di spedizione a carico del cliente.",
						countryId: country.id,
						storeId: store.id,
					};

					rates.push(rate);
				}
			}
		}

		// Insert shipping rates in chunks
		const chunkSize = 30;
		for (let i = 0; i < rates.length; i += chunkSize) {
			const chunk = rates.slice(i, i + chunkSize);
			await prisma.shippingRate.createMany({
				data: chunk,
				skipDuplicates: true,
			});
		}

		console.log(`✅ Seeded ${rates.length} shipping rates`);
		return rates;
	} catch (error) {
		console.error("❌ Error seeding shipping rates:", error);
		throw error;
	}
}

async function seedCoupons() {
	console.log("🎫 Seeding coupons...");

	try {
		const stores = await prisma.store.findMany({ where: { status: "ACTIVE" } });

		if (stores.length === 0) {
			throw new Error("No active stores found. Please seed stores first.");
		}

		const couponTypes = [
			{ prefix: "WELCOME", discount: [10, 15, 20], description: "Benvenuto" },
			{ prefix: "SUMMER", discount: [15, 25, 30], description: "Saldi Estivi" },
			{ prefix: "BLACK", discount: [20, 30, 40], description: "Black Friday" },
			{
				prefix: "WINTER",
				discount: [10, 20, 25],
				description: "Saldi Invernali",
			},
			{ prefix: "VIP", discount: [15, 20, 25], description: "Cliente VIP" },
			{ prefix: "FLASH", discount: [30, 40, 50], description: "Offerta Lampo" },
		];

		const coupons = [];

		for (const store of stores) {
			// Each store will have 3-5 coupons
			const numCoupons = randomBetween(3, 5);
			const selectedCouponTypes = randomPickMultiple(couponTypes, numCoupons);

			for (const couponType of selectedCouponTypes) {
				const randomSuffix = Math.random()
					.toString(36)
					.substring(2, 6)
					.toUpperCase();
				const code = `${couponType.prefix}${randomSuffix}`;

				// Generate dates
				const startDate = new Date(
					Date.now() - randomBetween(1, 30) * 24 * 60 * 60 * 1000
				);
				const endDate = new Date(
					Date.now() + randomBetween(30, 90) * 24 * 60 * 60 * 1000
				);

				const coupon = {
					id: generateId(),
					code: code,
					startDate: startDate.toISOString().split("T")[0],
					endDate: endDate.toISOString().split("T")[0],
					discount: randomPick(couponType.discount),
					storeId: store.id,
				};

				coupons.push(coupon);
			}
		}

		// Insert coupons
		await prisma.coupon.createMany({
			data: coupons,
			skipDuplicates: true,
		});

		console.log(`✅ Seeded ${coupons.length} coupons`);
		return coupons;
	} catch (error) {
		console.error("❌ Error seeding coupons:", error);
		throw error;
	}
}

async function seedFreeShipping() {
	console.log("🆓 Seeding free shipping configurations...");

	try {
		const products = await prisma.product.findMany();
		const countries = await prisma.country.findMany();

		if (products.length === 0 || countries.length === 0) {
			throw new Error(
				"Products or countries not found. Please seed them first."
			);
		}

		// Select some products for free shipping (about 20%)
		const freeShippingProducts = randomPickMultiple(
			products,
			Math.floor(products.length * 0.2)
		);

		const freeShippingConfigs = [];
		const freeShippingCountries = [];

		// Focus on major European countries for free shipping
		const majorCountries = countries.filter((c) =>
			["IT", "FR", "DE", "ES", "GB", "NL"].includes(c.code)
		);

		for (const product of freeShippingProducts) {
			const config = {
				id: generateId(),
				productId: product.id,
			};

			freeShippingConfigs.push(config);

			// Each free shipping product will have free shipping to 2-4 major countries
			const numCountries = randomBetween(2, 4);
			const selectedCountries = randomPickMultiple(
				majorCountries,
				numCountries
			);

			for (const country of selectedCountries) {
				const freeShippingCountry = {
					id: generateId(),
					freeShippingId: config.id,
					countryId: country.id,
				};

				freeShippingCountries.push(freeShippingCountry);
			}
		}

		// Insert free shipping configurations
		await prisma.freeShipping.createMany({
			data: freeShippingConfigs,
			skipDuplicates: true,
		});

		// Insert free shipping countries
		const chunkSize = 50;
		for (let i = 0; i < freeShippingCountries.length; i += chunkSize) {
			const chunk = freeShippingCountries.slice(i, i + chunkSize);
			await prisma.freeShippingCountry.createMany({
				data: chunk,
				skipDuplicates: true,
			});
		}

		console.log(
			`✅ Seeded ${freeShippingConfigs.length} free shipping configs with ${freeShippingCountries.length} country associations`
		);
		return { configs: freeShippingConfigs, countries: freeShippingCountries };
	} catch (error) {
		console.error("❌ Error seeding free shipping:", error);
		throw error;
	}
}

async function seedProductQuestions() {
	console.log("❓ Seeding product questions...");

	try {
		const products = await prisma.product.findMany();

		if (products.length === 0) {
			throw new Error("No products found. Please seed products first.");
		}

		const commonQuestions = [
			{
				question: "Quale è la taglia consigliata?",
				answer:
					"Ti consigliamo di consultare la nostra guida alle taglie. In caso di dubbi, scegli una taglia in più.",
			},
			{
				question: "Il prodotto è disponibile in altri colori?",
				answer:
					"I colori disponibili sono quelli mostrati nella pagina prodotto. Controlla periodicamente per nuovi arrivi.",
			},
			{
				question: "Quanto tempo impiega la spedizione?",
				answer:
					"La spedizione standard richiede 3-5 giorni lavorativi. La spedizione express è disponibile in 24-48 ore.",
			},
			{
				question: "Posso restituire il prodotto se non sono soddisfatto?",
				answer:
					"Sì, accettiamo resi entro 30 giorni dall'acquisto. Il prodotto deve essere nelle condizioni originali.",
			},
			{
				question: "Il prodotto è di qualità?",
				answer:
					"Tutti i nostri prodotti sono selezionati con cura e rispettano alti standard di qualità.",
			},
			{
				question: "Come posso lavare questo capo?",
				answer:
					"Segui le istruzioni di lavaggio riportate sull'etichetta del prodotto per mantenerlo in ottime condizioni.",
			},
			{
				question: "Il prezzo include la spedizione?",
				answer:
					"Il prezzo mostrato non include la spedizione. I costi di spedizione vengono calcolati al checkout.",
			},
			{
				question: "Avete una garanzia?",
				answer:
					"Offriamo garanzia contro difetti di fabbricazione per 12 mesi dall'acquisto.",
			},
		];

		const questions = [];

		// Add 1-3 questions to random products (about 30% of products)
		const productsWithQuestions = randomPickMultiple(
			products,
			Math.floor(products.length * 0.3)
		);

		for (const product of productsWithQuestions) {
			const numQuestions = randomBetween(1, 3);
			const selectedQuestions = randomPickMultiple(
				commonQuestions,
				numQuestions
			);

			for (const qa of selectedQuestions) {
				const question = {
					id: generateId(),
					question: qa.question,
					answer: qa.answer,
					productId: product.id,
				};

				questions.push(question);
			}
		}

		// Insert questions
		const chunkSize = 30;
		for (let i = 0; i < questions.length; i += chunkSize) {
			const chunk = questions.slice(i, i + chunkSize);
			await prisma.question.createMany({
				data: chunk,
				skipDuplicates: true,
			});
		}

		console.log(`✅ Seeded ${questions.length} product questions`);
		return questions;
	} catch (error) {
		console.error("❌ Error seeding product questions:", error);
		throw error;
	}
}

async function seedCommerceData() {
	console.log("🚀 Starting commerce data seeding...");

	try {
		const shippingRates = await seedShippingRates();
		const coupons = await seedCoupons();
		const freeShipping = await seedFreeShipping();
		const questions = await seedProductQuestions();

		console.log("✅ Commerce data seeding completed successfully!");

		return {
			shippingRates,
			coupons,
			freeShipping,
			questions,
		};
	} catch (error) {
		console.error("❌ Commerce data seeding failed:", error);
		throw error;
	}
}

export {
	seedShippingRates,
	seedCoupons,
	seedFreeShipping,
	seedProductQuestions,
	seedCommerceData,
};
