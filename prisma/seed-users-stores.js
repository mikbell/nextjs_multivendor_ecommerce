import {
	generateId,
	generateSlug,
	generateImageUrl,
	randomBetween,
	randomPick,
	firstNames,
	lastNames,
	storeNames,
	generateAddress,
	prisma,
} from "./seed-utils.js";

async function seedUsers() {
	console.log("👥 Seeding users...");

	try {
		const users = [];

		// Create admin user
		const adminUser = {
			id: generateId(),
			name: "Admin Sistema",
			email: "admin@multivendor.com",
			picture: generateImageUrl("avatar", "admin"),
			role: "ADMIN",
			updatedAt: new Date(),
		};
		users.push(adminUser);

		// Create seller users
		for (let i = 0; i < 12; i++) {
			const firstName = randomPick(firstNames);
			const lastName = randomPick(lastNames);
			const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@seller${
				i + 1
			}.com`;

			const seller = {
				id: generateId(),
				name: `${firstName} ${lastName}`,
				email: email,
				picture: generateImageUrl("avatar", `seller${i + 1}`),
				role: "SELLER",
				updatedAt: new Date(),
			};
			users.push(seller);
		}

		// Create regular users (customers)
		for (let i = 0; i < 30; i++) {
			const firstName = randomPick(firstNames);
			const lastName = randomPick(lastNames);
			const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${
				i + 1
			}@customer.com`;

			const customer = {
				id: generateId(),
				name: `${firstName} ${lastName}`,
				email: email,
				picture: generateImageUrl("avatar", `customer${i + 1}`),
				role: "USER",
				updatedAt: new Date(),
			};
			users.push(customer);
		}

		await prisma.user.createMany({
			data: users,
			skipDuplicates: true,
		});

		console.log(`✅ Seeded ${users.length} users`);
		return users;
	} catch (error) {
		console.error("❌ Error seeding users:", error);
		throw error;
	}
}

async function seedStores() {
	console.log("🏪 Seeding stores...");

	try {
		// Get seller users
		const sellers = await prisma.user.findMany({
			where: { role: "SELLER" },
		});

		if (sellers.length === 0) {
			throw new Error("No seller users found. Please seed users first.");
		}

		const stores = [];

		for (let i = 0; i < sellers.length; i++) {
			const seller = sellers[i];
			const storeName = storeNames[i] || `Store ${seller.name}`;
			const slug = generateSlug(storeName);

			const store = {
				id: generateId(),
				name: storeName,
				slug: slug,
				url: `/stores/${slug}`,
				description: `${storeName} è un negozio specializzato in moda e accessori di alta qualità. Offriamo una selezione curata di prodotti per soddisfare ogni esigenza di stile.`,
				email: `info@${slug.replace(/-/g, "")}.com`,
				phone: `+39 ${randomBetween(300, 399)} ${randomBetween(
					1000000,
					9999999
				)}`,
				logo: generateImageUrl("logo", `store${i + 1}`),
				cover: generateImageUrl("cover", `store${i + 1}`),
				featured: i < 3, // Make first 3 stores featured
				status: i < 10 ? "ACTIVE" : "PENDING", // Most stores are active, some pending
				averageRating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // Between 3.0 and 5.0
				returnPolicy:
					"Reso gratuito entro 30 giorni dall'acquisto. Prodotto deve essere in condizioni originali.",
				defaultShippingService: randomPick([
					"Corriere Espresso",
					"Posta Prioritaria",
					"Spedizione Standard",
				]),
				defaultDeliveryTimeMin: randomBetween(1, 3),
				defaultDeliveryTimeMax: randomBetween(5, 10),
				defaultShippingFeeFixed: parseFloat((Math.random() * 10).toFixed(2)),
				defaultShippingFeeForAdditionalItem: parseFloat(
					(Math.random() * 5).toFixed(2)
				),
				defaultShippingFeePerItem: parseFloat((Math.random() * 8).toFixed(2)),
				defaultShippingFeePerKg: parseFloat((Math.random() * 12).toFixed(2)),
				numReviews: randomBetween(0, 50),
				userId: seller.id,
			};

			stores.push(store);
		}

		await prisma.store.createMany({
			data: stores,
			skipDuplicates: true,
		});

		console.log(`✅ Seeded ${stores.length} stores`);
		return stores;
	} catch (error) {
		console.error("❌ Error seeding stores:", error);
		throw error;
	}
}

async function seedShippingAddresses() {
	console.log("📮 Seeding shipping addresses...");

	try {
		// Get customer users
		const customers = await prisma.user.findMany({
			where: { role: "USER" },
		});

		// Get countries
		const countries = await prisma.country.findMany();
		const italyCountry = countries.find((c) => c.code === "IT") || countries[0];

		const addresses = [];

		// Create 1-3 addresses for each customer
		for (const customer of customers) {
			const numAddresses = randomBetween(1, 3);

			for (let i = 0; i < numAddresses; i++) {
				const addressData = generateAddress();

				const address = {
					id: generateId(),
					firstName: customer.name.split(" ")[0],
					lastName: customer.name.split(" ")[1] || "Cliente",
					phone: `+39 ${randomBetween(300, 399)} ${randomBetween(
						1000000,
						9999999
					)}`,
					address1: addressData.address1,
					address2:
						randomBetween(1, 10) > 7 ? `Interno ${randomBetween(1, 20)}` : null,
					state: addressData.state,
					city: addressData.city,
					zipCode: addressData.zip_code,
					default: i === 0, // First address is default
					userId: customer.id,
					countryId: italyCountry.id,
					updatedAt: new Date(),
				};

				addresses.push(address);
			}
		}

		await prisma.shippingAddress.createMany({
			data: addresses,
			skipDuplicates: true,
		});

		console.log(`✅ Seeded ${addresses.length} shipping addresses`);
		return addresses;
	} catch (error) {
		console.error("❌ Error seeding shipping addresses:", error);
		throw error;
	}
}

async function seedUsersAndStores() {
	console.log("🚀 Starting users and stores seeding...");

	try {
		const users = await seedUsers();
		const stores = await seedStores();
		const addresses = await seedShippingAddresses();

		console.log("✅ Users and stores seeding completed successfully!");

		return {
			users,
			stores,
			addresses,
		};
	} catch (error) {
		console.error("❌ Users and stores seeding failed:", error);
		throw error;
	}
}

export {
	seedUsers,
	seedStores,
	seedShippingAddresses,
	seedUsersAndStores,
};
