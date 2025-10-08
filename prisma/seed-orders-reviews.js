import {
	generateId,
	randomBetween,
	randomFloat,
	randomPick,
	randomPickMultiple,
	generateImageUrl,
	generateReviewText,
	prisma,
} from "./seed-utils.js";

function generateSKUForCartItem(productName, variantName, size) {
	const productCode = productName.slice(0, 3).toUpperCase();
	const variantCode = variantName.slice(0, 3).toUpperCase();
	const sizeCode = size.replace(" ", "");
	const randomNum = Math.floor(Math.random() * 1000)
		.toString()
		.padStart(3, "0");
	return `${productCode}-${variantCode}-${sizeCode}-${randomNum}`;
}

async function seedOrders() {
	console.log("🛒 Seeding orders...");

	try {
		// Get necessary data
		const customers = await prisma.user.findMany({ where: { role: "USER" } });
		const addresses = await prisma.shippingAddress.findMany();
		const products = await prisma.product.findMany();
		const variants = await prisma.productVariant.findMany();
		const sizes = await prisma.size.findMany();
		const stores = await prisma.store.findMany({ where: { status: "ACTIVE" } });
		const coupons = await prisma.coupon.findMany();

		if (
			customers.length === 0 ||
			products.length === 0 ||
			addresses.length === 0
		) {
			throw new Error(
				"Required data not found. Please seed users, products, and addresses first."
			);
		}

		const orders = [];
		const orderGroups = [];
		const orderItems = [];
		const paymentDetails = [];

		const orderStatuses = [
			"Pending",
			"Confirmed",
			"Processing",
			"Shipped",
			"Delivered",
			"Cancelled",
		];
		const paymentMethods = ["Stripe", "Paypal"];
		const paymentStatuses = ["Pending", "Paid", "Failed", "Declined"];

		// Create 50-80 orders
		const numOrders = randomBetween(50, 80);

		for (let i = 0; i < numOrders; i++) {
			const customer = randomPick(customers);
			const customerAddresses = addresses.filter(
				(addr) => addr.userId === customer.id
			);

			if (customerAddresses.length === 0) continue;

			const shippingAddress = randomPick(customerAddresses);
			const orderStatus = randomPick(orderStatuses);
			const paymentMethod = randomPick(paymentMethods);
			const paymentStatus = randomPick(paymentStatuses);

			// Create order
			const orderId = generateId();
			const orderDate = new Date(
				Date.now() - randomBetween(1, 90) * 24 * 60 * 60 * 1000
			); // Last 90 days

			let orderSubTotal = 0;
			let orderShippingFees = 0;
			const orderStores = new Set();

			// Each order will have 1-5 items
			const numItems = randomBetween(1, 5);
			const orderProducts = randomPickMultiple(products, numItems);

			const currentOrderGroups = [];

			for (const product of orderProducts) {
				const productVariants = variants.filter(
					(v) => v.productId === product.id
				);
				if (productVariants.length === 0) continue;

				const variant = randomPick(productVariants);
				const variantSizes = sizes.filter(
					(s) => s.productVariantId === variant.id
				);
				if (variantSizes.length === 0) continue;

				const size = randomPick(variantSizes);
				const quantity = randomBetween(1, 3);
				const itemPrice = size.price * (1 - size.discount / 100);
				const shippingFee = randomFloat(0, 8.0, 2);
				const totalPrice = itemPrice * quantity;

				orderSubTotal += totalPrice;
				orderShippingFees += shippingFee;
				orderStores.add(product.storeId);

				// Find or create order group for this store
				let orderGroup = currentOrderGroups.find(
					(og) => og.storeId === product.storeId
				);
				if (!orderGroup) {
					const orderGroupId = generateId();
					const store = stores.find((s) => s.id === product.storeId);
					const groupCoupon =
						randomBetween(1, 10) <= 3
							? randomPick(coupons.filter((c) => c.storeId === product.storeId))
							: null;

					orderGroup = {
						id: orderGroupId,
						status: randomPick([
							"Pending",
							"Confirmed",
							"Processing",
							"Shipped",
							"Delivered",
						]),
						shippingService: store
							? store.defaultShippingService
							: "Spedizione Standard",
						shippingDeliveryMin: store ? store.defaultDeliveryTimeMin : 3,
						shippingDeliveryMax: store ? store.defaultDeliveryTimeMax : 7,
						shippingFees: 0,
						subTotal: 0,
						total: 0,
						orderId: orderId,
						storeId: product.storeId,
						couponId: groupCoupon ? groupCoupon.id : null,
						createdAt: orderDate,
						updatedAt: new Date(),
					};

					currentOrderGroups.push(orderGroup);
				}

				// Update order group totals
				orderGroup.subTotal += totalPrice;
				orderGroup.shippingFees += shippingFee;
				orderGroup.total = orderGroup.subTotal + orderGroup.shippingFees;

				// Create order item
				const orderItem = {
					id: generateId(),
					quantity: quantity,
					createdAt: orderDate,
					updatedAt: new Date(),
					image: variant.variantImage,
					name: `${product.name} - ${variant.variantName}`,
					orderGroupId: orderGroup.id,
					price: itemPrice,
					productId: product.id,
					productSlug: product.slug,
					shippingFee: shippingFee,
					size: size.size,
					sizeId: size.id,
					sku: generateSKUForCartItem(
						product.name,
						variant.variantName,
						size.size
					),
					status: randomPick(["Pending", "Processing", "Shipped", "Delivered"]),
					totalPrice: totalPrice,
					variantId: variant.id,
					variantSlug: variant.slug,
				};

				orderItems.push(orderItem);
			}

			// Add order groups to main array
			orderGroups.push(...currentOrderGroups);

			const orderTotal = orderSubTotal + orderShippingFees;

			// Create main order
			const order = {
				id: orderId,
				userId: customer.id,
				createdAt: orderDate,
				updatedAt: new Date(),
				orderStatus: orderStatus,
				paymentMethod: paymentMethod,
				paymentStatus: paymentStatus,
				shippingAddressId: shippingAddress.id,
				shippingFees: orderShippingFees,
				subTotal: orderSubTotal,
				total: orderTotal,
			};

			orders.push(order);

			// Create payment details if order is paid
			if (paymentStatus === "Paid") {
				const paymentDetail = {
					id: generateId(),
					paymentInetntId: `pi_${Math.random().toString(36).substring(2, 15)}`,
					paymentMethod: paymentMethod,
					status: "succeeded",
					amount: orderTotal,
					currency: "EUR",
					orderId: orderId,
					userId: customer.id,
					createdAt: orderDate,
					updatedAt: new Date(),
				};

				paymentDetails.push(paymentDetail);
			}
		}

		// Insert all order-related data
		console.log("📦 Inserting orders...");
		await prisma.order.createMany({
			data: orders,
			skipDuplicates: true,
		});

		console.log("📋 Inserting order groups...");
		const chunkSize = 30;
		for (let i = 0; i < orderGroups.length; i += chunkSize) {
			const chunk = orderGroups.slice(i, i + chunkSize);
			await prisma.orderGroup.createMany({
				data: chunk,
				skipDuplicates: true,
			});
		}

		console.log("🛍️ Inserting order items...");
		for (let i = 0; i < orderItems.length; i += chunkSize) {
			const chunk = orderItems.slice(i, i + chunkSize);
			await prisma.orderItem.createMany({
				data: chunk,
				skipDuplicates: true,
			});
		}

		console.log("💳 Inserting payment details...");
		if (paymentDetails.length > 0) {
			await prisma.paymentDetails.createMany({
				data: paymentDetails,
				skipDuplicates: true,
			});
		}

		console.log(
			`✅ Seeded ${orders.length} orders with ${orderGroups.length} order groups and ${orderItems.length} items`
		);
		return { orders, orderGroups, orderItems, paymentDetails };
	} catch (error) {
		console.error("❌ Error seeding orders:", error);
		throw error;
	}
}

async function seedReviews() {
	console.log("⭐ Seeding product reviews...");

	try {
		const customers = await prisma.user.findMany({ where: { role: "USER" } });
		const products = await prisma.product.findMany();
		const variants = await prisma.productVariant.findMany();
		const sizes = await prisma.size.findMany();
		const colors = await prisma.color.findMany();

		if (customers.length === 0 || products.length === 0) {
			throw new Error(
				"Customers or products not found. Please seed them first."
			);
		}

		const reviews = [];
		const reviewImages = [];

		// Create reviews for about 40% of products
		const reviewedProducts = randomPickMultiple(
			products,
			Math.floor(products.length * 0.4)
		);

		for (const product of reviewedProducts) {
			// Each product will get 1-8 reviews
			const numReviews = randomBetween(1, 8);
			const productVariants = variants.filter(
				(v) => v.productId === product.id
			);
			const productColors = colors.filter((c) =>
				productVariants.some((v) => v.id === c.productVariantId)
			);

			for (let i = 0; i < numReviews; i++) {
				const customer = randomPick(customers);
				const variant = randomPick(productVariants);
				const variantSizes = sizes.filter(
					(s) => s.productVariantId === variant.id
				);
				const size = randomPick(variantSizes);
				const color = randomPick(productColors);

				if (!variant || !size || !color) continue;

				const rating = randomFloat(3.0, 5.0, 1); // Ratings between 3.0 and 5.0
				const reviewDate = new Date(
					Date.now() - randomBetween(1, 180) * 24 * 60 * 60 * 1000
				); // Last 6 months

				const review = {
					id: generateId(),
					rating: rating,
					userId: customer.id,
					productId: product.id,
					createdAt: reviewDate,
					updatedAt: reviewDate,
					color: color.name,
					likes: randomBetween(0, 25),
					quantity: randomBetween(1, 3).toString(),
					review: generateReviewText(),
					size: size.size,
					variant: variant.variantName,
				};

				reviews.push(review);

				// Some reviews will have images (30% chance)
				if (randomBetween(1, 10) <= 3) {
					const numImages = randomBetween(1, 3);

					for (let j = 0; j < numImages; j++) {
						const reviewImage = {
							id: generateId(),
							url: generateImageUrl("review", `${review.id}-${j + 1}`),
							alt: `Foto recensione di ${customer.name}`,
							reviewId: review.id,
							createdAt: reviewDate,
							updatedAt: reviewDate,
						};

						reviewImages.push(reviewImage);
					}
				}
			}
		}

		// Insert reviews
		console.log("💬 Inserting reviews...");
		const chunkSize = 30;
		for (let i = 0; i < reviews.length; i += chunkSize) {
			const chunk = reviews.slice(i, i + chunkSize);
			await prisma.review.createMany({
				data: chunk,
				skipDuplicates: true,
			});
		}

		// Insert review images
		if (reviewImages.length > 0) {
			console.log("📸 Inserting review images...");
			for (let i = 0; i < reviewImages.length; i += chunkSize) {
				const chunk = reviewImages.slice(i, i + chunkSize);
				await prisma.reviewImage.createMany({
					data: chunk,
					skipDuplicates: true,
				});
			}
		}

		console.log(
			`✅ Seeded ${reviews.length} reviews with ${reviewImages.length} review images`
		);
		return { reviews, reviewImages };
	} catch (error) {
		console.error("❌ Error seeding reviews:", error);
		throw error;
	}
}

async function seedWishlists() {
	console.log("❤️ Seeding wishlists...");

	try {
		const customers = await prisma.user.findMany({ where: { role: "USER" } });
		const products = await prisma.product.findMany();
		const variants = await prisma.productVariant.findMany();
		const sizes = await prisma.size.findMany();

		if (customers.length === 0 || products.length === 0) {
			throw new Error(
				"Customers or products not found. Please seed them first."
			);
		}

		const wishlists = [];

		// About 60% of customers will have wishlist items
		const customersWithWishlists = randomPickMultiple(
			customers,
			Math.floor(customers.length * 0.6)
		);

		for (const customer of customersWithWishlists) {
			// Each customer will have 3-12 items in wishlist
			const numItems = randomBetween(3, 12);
			const customerProducts = randomPickMultiple(products, numItems);

			for (const product of customerProducts) {
				const productVariants = variants.filter(
					(v) => v.productId === product.id
				);
				const variant = randomPick(productVariants);

				if (!variant) continue;

				const variantSizes = sizes.filter(
					(s) => s.productVariantId === variant.id
				);
				const size =
					randomBetween(1, 10) <= 7 ? randomPick(variantSizes) : null; // 70% chance of having a specific size

				const wishlistItem = {
					id: generateId(),
					userId: customer.id,
					productId: product.id,
					variantId: variant.id,
					sizeId: size ? size.id : null,
					createdAt: new Date(
						Date.now() - randomBetween(1, 60) * 24 * 60 * 60 * 1000
					), // Last 60 days
					updatedAt: new Date(),
				};

				wishlists.push(wishlistItem);
			}
		}

		// Insert wishlists
		const chunkSize = 50;
		for (let i = 0; i < wishlists.length; i += chunkSize) {
			const chunk = wishlists.slice(i, i + chunkSize);
			await prisma.wishlist.createMany({
				data: chunk,
				skipDuplicates: true,
			});
		}

		console.log(`✅ Seeded ${wishlists.length} wishlist items`);
		return wishlists;
	} catch (error) {
		console.error("❌ Error seeding wishlists:", error);
		throw error;
	}
}

async function seedOrdersAndReviews() {
	console.log("🚀 Starting orders and reviews seeding...");

	try {
		const orderData = await seedOrders();
		const reviewData = await seedReviews();
		const wishlists = await seedWishlists();

		console.log("✅ Orders and reviews seeding completed successfully!");

		return {
			orders: orderData.orders,
			orderGroups: orderData.orderGroups,
			orderItems: orderData.orderItems,
			paymentDetails: orderData.paymentDetails,
			reviews: reviewData.reviews,
			reviewImages: reviewData.reviewImages,
			wishlists,
		};
	} catch (error) {
		console.error("❌ Orders and reviews seeding failed:", error);
		throw error;
	}
}

export {
	seedOrders,
	seedReviews,
	seedWishlists,
	seedOrdersAndReviews,
};
