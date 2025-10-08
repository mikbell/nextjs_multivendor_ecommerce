import { PrismaClient } from "@prisma/client";
import { seedBaseData } from "./seed-base-data.js";
import { seedUsersAndStores } from "./seed-users-stores.js";
import { seedProductsHierarchy } from "./seed-products.js";
import { seedCommerceData } from "./seed-commerce.js";
import { seedOrdersAndReviews } from "./seed-orders-reviews.js";
const prisma = new PrismaClient();

async function clearDatabase() {
	console.log("🗑️ Clearing existing data...");

	try {
		// Clear data in reverse dependency order
		await prisma.reviewImage.deleteMany({});
		await prisma.review.deleteMany({});
		await prisma.wishlist.deleteMany({});
		await prisma.paymentDetails.deleteMany({});
		await prisma.orderItem.deleteMany({});
		await prisma.orderGroup.deleteMany({});
		await prisma.order.deleteMany({});
		await prisma.cartItem.deleteMany({});
		await prisma.cart.deleteMany({});
		await prisma.question.deleteMany({});
		await prisma.freeShippingCountry.deleteMany({});
		await prisma.freeShipping.deleteMany({});
		await prisma.coupon.deleteMany({});
		await prisma.shippingRate.deleteMany({});
		await prisma.spec.deleteMany({});
		await prisma.productVariantImage.deleteMany({});
		await prisma.color.deleteMany({});
		await prisma.size.deleteMany({});
		await prisma.productVariant.deleteMany({});
		await prisma.product.deleteMany({});
		await prisma.store.deleteMany({});
		await prisma.shippingAddress.deleteMany({});
		await prisma.user.deleteMany({});
		await prisma.subCategory.deleteMany({});
		await prisma.category.deleteMany({});
		await prisma.offerTag.deleteMany({});
		await prisma.country.deleteMany({});
		await prisma.couponToUser.deleteMany({});
		await prisma.userFollowingStore.deleteMany({});

		console.log("✅ Database cleared successfully!");
	} catch (error) {
		console.error("❌ Error clearing database:", error);
		throw error;
	}
}

async function seedDatabase() {
	const startTime = Date.now();
	console.log("🌱 Starting database seeding...");
	console.log("📅 Seeding started at:", new Date().toLocaleString("it-IT"));

	try {
		// Step 1: Clear existing data
		await clearDatabase();

		// Step 2: Seed base data (countries, categories, offer tags)
		console.log("\n📊 Phase 1: Seeding base data...");
		const baseData = await seedBaseData();
		console.log(
			`✅ Phase 1 completed: ${baseData.countries.length} countries, ${baseData.categories.length} categories, ${baseData.subcategories.length} subcategories, ${baseData.offerTags.length} offer tags`
		);

		// Step 3: Seed users and stores
		console.log("\n👥 Phase 2: Seeding users and stores...");
		const userData = await seedUsersAndStores();
		console.log(
			`✅ Phase 2 completed: ${userData.users.length} users, ${userData.stores.length} stores, ${userData.addresses.length} addresses`
		);

		// Step 4: Seed products hierarchy
		console.log("\n🛍️ Phase 3: Seeding products and variants...");
		const productData = await seedProductsHierarchy();
		console.log(
			`✅ Phase 3 completed: ${productData.products.length} products, ${productData.variants.length} variants, ${productData.sizes.length} sizes, ${productData.colors.length} colors, ${productData.images.length} images, ${productData.specs.length} specs`
		);

		// Step 5: Seed commerce data
		console.log("\n🚚 Phase 4: Seeding commerce data...");
		const commerceData = await seedCommerceData();
		console.log(
			`✅ Phase 4 completed: ${commerceData.shippingRates.length} shipping rates, ${commerceData.coupons.length} coupons, ${commerceData.freeShipping.configs.length} free shipping configs, ${commerceData.questions.length} questions`
		);

		// Step 6: Seed orders and reviews
		console.log("\n🛒 Phase 5: Seeding orders and reviews...");
		const orderData = await seedOrdersAndReviews();
		console.log(
			`✅ Phase 5 completed: ${orderData.orders.length} orders, ${orderData.orderGroups.length} order groups, ${orderData.orderItems.length} order items, ${orderData.reviews.length} reviews, ${orderData.wishlists.length} wishlist items`
		);

		const endTime = Date.now();
		const duration = ((endTime - startTime) / 1000).toFixed(2);

		console.log("\n🎉 Database seeding completed successfully!");
		console.log("📅 Seeding completed at:", new Date().toLocaleString("it-IT"));
		console.log(`⏱️ Total time: ${duration} seconds`);

		// Print summary
		console.log("\n📈 Seeding Summary:");
		console.log(`   📍 Countries: ${baseData.countries.length}`);
		console.log(`   📂 Categories: ${baseData.categories.length}`);
		console.log(`   📁 Subcategories: ${baseData.subcategories.length}`);
		console.log(`   🏷️ Offer Tags: ${baseData.offerTags.length}`);
		console.log(
			`   👥 Users: ${userData.users.length} (1 admin, ${userData.users.filter((u) => u.role === "SELLER").length
			} sellers, ${userData.users.filter((u) => u.role === "USER").length
			} customers)`
		);
		console.log(`   🏪 Stores: ${userData.stores.length}`);
		console.log(`   📮 Shipping Addresses: ${userData.addresses.length}`);
		console.log(`   🛍️ Products: ${productData.products.length}`);
		console.log(`   🎨 Product Variants: ${productData.variants.length}`);
		console.log(`   📏 Sizes: ${productData.sizes.length}`);
		console.log(`   🌈 Colors: ${productData.colors.length}`);
		console.log(`   🖼️ Product Images: ${productData.images.length}`);
		console.log(`   📋 Product Specs: ${productData.specs.length}`);
		console.log(`   🚚 Shipping Rates: ${commerceData.shippingRates.length}`);
		console.log(`   🎫 Coupons: ${commerceData.coupons.length}`);
		console.log(
			`   🆓 Free Shipping Configs: ${commerceData.freeShipping.configs.length}`
		);
		console.log(`   ❓ Product Questions: ${commerceData.questions.length}`);
		console.log(`   🛒 Orders: ${orderData.orders.length}`);
		console.log(`   📦 Order Groups: ${orderData.orderGroups.length}`);
		console.log(`   🛍️ Order Items: ${orderData.orderItems.length}`);
		console.log(`   💳 Payment Details: ${orderData.paymentDetails.length}`);
		console.log(`   ⭐ Reviews: ${orderData.reviews.length}`);
		console.log(`   📸 Review Images: ${orderData.reviewImages.length}`);
		console.log(`   ❤️ Wishlist Items: ${orderData.wishlists.length}`);

		console.log("\n🚀 Your multivendor ecommerce database is ready to use!");
		console.log("\n💡 Login credentials:");
		console.log("   🔑 Admin: admin@multivendor.com");
		console.log("   🏪 Sellers: Use any seller email from the generated users");
		console.log(
			"   👤 Customers: Use any customer email from the generated users"
		);
	} catch (error) {
		console.error("\n❌ Database seeding failed:", error);
		console.error("Stack trace:", error.stack);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
	console.log("\n⚠️ Received SIGINT. Shutting down gracefully...");
	await prisma.$disconnect();
	process.exit(0);
});

process.on("SIGTERM", async () => {
	console.log("\n⚠️ Received SIGTERM. Shutting down gracefully...");
	await prisma.$disconnect();
	process.exit(0);
});

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	seedDatabase().catch((error) => {
		console.error("❌ Unhandled seeding error:", error);
		process.exit(1);
	});
}

export {
	seedDatabase,
	clearDatabase,
};
