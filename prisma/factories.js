/**
 * Factories Module - Data Generation for All Models
 *
 * This module provides factory functions to generate realistic test data
 * for all Prisma models in the multivendor ecommerce application.
 */

import { customAlphabet } from "nanoid";
import {
	randomBetween,
	randomFloat,
	randomPick,
	randomPickMultiple,
	generateSlug,
	generateImageUrl,
	productNames,
	brands,
	storeNames,
	firstNames,
	lastNames,
	generateProductDescription,
	clothingSizes,
	shoeSizes,
	accessorySizes,
	colors,
	generateReviewText,
	cities,
} from "./seed-utils.js";

const generateId = customAlphabet(
	"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
	12
);

// ============= USER FACTORIES =============

/**
 * Generate a user with specified role
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} User data
 */
export function userFactory(overrides = {}) {
	const firstName = overrides.firstName || randomPick(firstNames);
	const lastName = overrides.lastName || randomPick(lastNames);
	const role = overrides.role || "USER";

	const emailPrefix = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
	const emailDomain = role === "ADMIN" ? "multivendor.com" : "example.com";

	return {
		id: generateId(),
		email: `${emailPrefix}@${emailDomain}`,
		name: `${firstName} ${lastName}`,
		picture: generateImageUrl("profile", generateId()),
		role: role,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

/**
 * Generate a shipping address
 * @param {string} userId - User ID
 * @param {string} countryId - Country ID
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Shipping address data
 */
export function shippingAddressFactory(userId, countryId, overrides = {}) {
	const firstName = randomPick(firstNames);
	const lastName = randomPick(lastNames);
	const streets = [
		"Via Roma",
		"Via Milano",
		"Via Nazionale",
		"Corso Italia",
		"Via Garibaldi",
		"Piazza Duomo",
		"Via Manzoni",
		"Via Dante",
		"Corso Venezia",
		"Via Torino",
	];

	return {
		id: generateId(),
		firstName,
		lastName,
		phone: `+39 ${randomBetween(300, 399)} ${randomBetween(1000000, 9999999)}`,
		address1: `${randomPick(streets)} ${randomBetween(1, 200)}`,
		address2: Math.random() > 0.7 ? `Interno ${randomBetween(1, 20)}` : null,
		state: "IT",
		city: randomPick(cities),
		zipCode: `${randomBetween(10000, 99999)}`,
		default: false,
		userId,
		countryId,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

// ============= STORE FACTORIES =============

/**
 * Generate a store
 * @param {string} userId - Owner user ID
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Store data
 */
export function storeFactory(userId, overrides = {}) {
	const name = overrides.name || randomPick(storeNames);
	const slug = generateSlug(name);

	return {
		id: generateId(),
		name,
		slug: `${slug}-${generateId().slice(0, 6)}`,
		description: `${name} è un negozio online specializzato in prodotti di alta qualità. Offriamo una vasta gamma di articoli selezionati con cura per soddisfare le esigenze dei nostri clienti.`,
		email: `info@${slug}.com`,
		phone: `+39 ${randomBetween(300, 399)} ${randomBetween(1000000, 9999999)}`,
		logo: generateImageUrl("logo", name),
		cover: generateImageUrl("cover", name),
		url: `/stores/${slug}`,
		featured: Math.random() > 0.7,
		status: overrides.status || (Math.random() > 0.1 ? "ACTIVE" : "PENDING"),
		averageRating: randomFloat(3.5, 5.0, 1),
		numReviews: randomBetween(10, 500),
		userId,
		returnPolicy: "Reso gratuito entro 30 giorni dall'acquisto.",
		defaultShippingService: "Spedizione Internazionale",
		defaultDeliveryTimeMin: randomBetween(3, 7),
		defaultDeliveryTimeMax: randomBetween(10, 30),
		defaultShippingFeeFixed: randomFloat(0, 10, 2),
		defaultShippingFeeForAdditionalItem: randomFloat(0, 5, 2),
		defaultShippingFeePerItem: randomFloat(0, 8, 2),
		defaultShippingFeePerKg: randomFloat(2, 15, 2),
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

// ============= CATEGORY FACTORIES =============

/**
 * Generate a category
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Category data
 */
export function categoryFactory(overrides = {}) {
	const name = overrides.name || "Categoria Test";
	const slug = generateSlug(name);

	return {
		id: generateId(),
		name,
		slug: `${slug}-${generateId().slice(0, 6)}`,
		url: `/categories/${slug}`,
		image: generateImageUrl("category"),
		description: overrides.description || `Scopri la nostra collezione di ${name.toLowerCase()}`,
		featured: overrides.featured || false,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

/**
 * Generate a subcategory
 * @param {string} categoryId - Parent category ID
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Subcategory data
 */
export function subCategoryFactory(categoryId, overrides = {}) {
	const name = overrides.name || "Sottocategoria Test";
	const slug = generateSlug(name);

	return {
		id: generateId(),
		name,
		slug: `${slug}-${generateId().slice(0, 6)}`,
		url: `/subcategories/${slug}`,
		image: generateImageUrl("subcategory"),
		description: overrides.description || `Esplora la nostra selezione di ${name.toLowerCase()}`,
		featured: overrides.featured || false,
		categoryId,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

// ============= PRODUCT FACTORIES =============

/**
 * Generate a product
 * @param {string} storeId - Store ID
 * @param {string} categoryId - Category ID
 * @param {string} subCategoryId - Subcategory ID
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Product data
 */
export function productFactory(storeId, categoryId, subCategoryId, overrides = {}) {
	const name = overrides.name || `${randomPick(productNames)} ${randomPick(brands)}`;
	const slug = generateSlug(name);

	return {
		id: generateId(),
		name,
		description: overrides.description || generateProductDescription(),
		slug: `${slug}-${generateId().slice(0, 6)}`,
		brand: overrides.brand || randomPick(brands),
		rating: randomFloat(3, 5, 1),
		numReviews: randomBetween(0, 200),
		sales: randomBetween(0, 1000),
		views: randomBetween(100, 5000),
		storeId,
		categoryId,
		subCategoryId,
		offerTagId: overrides.offerTagId || null,
		freeShippingForAllCountries: Math.random() > 0.8,
		shippingFeeMethod: randomPick(["ITEM", "WEIGHT", "FIXED"]),
		isActive: overrides.isActive !== undefined ? overrides.isActive : true,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

/**
 * Generate a product variant
 * @param {string} productId - Product ID
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Product variant data
 */
export function productVariantFactory(productId, overrides = {}) {
	const color = overrides.variantName || randomPick(colors);
	const slug = generateSlug(`${productId}-${color}`);

	return {
		id: generateId(),
		slug: `${slug}-${generateId().slice(0, 6)}`,
		variantName: color,
		variantDescription: `Variante ${color.toLowerCase()} del prodotto`,
		variantImage: generateImageUrl("variant"),
		keywords: `${color}, moda, stile, qualità`,
		sku: `SKU-${generateId().slice(0, 8).toUpperCase()}`,
		weight: randomFloat(0.1, 2.0, 2),
		isSale: Math.random() > 0.7,
		saleEndDate: Math.random() > 0.5 ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
		sales: randomBetween(0, 500),
		productId,
		isActive: true,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

/**
 * Generate a product variant image
 * @param {string} productVariantId - Product variant ID
 * @param {number} order - Image order
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Product variant image data
 */
export function productVariantImageFactory(productVariantId, order = 1, overrides = {}) {
	return {
		id: generateId(),
		url: generateImageUrl("product", generateId()),
		alt: `Immagine prodotto ${order}`,
		order,
		productVariantId,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

/**
 * Generate a size
 * @param {string} productVariantId - Product variant ID
 * @param {string} sizeName - Size name
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Size data
 */
export function sizeFactory(productVariantId, sizeName, overrides = {}) {
	const basePrice = overrides.basePrice || randomFloat(29.99, 299.99, 2);
	const discount = Math.random() > 0.6 ? randomFloat(5, 30, 0) : 0;

	return {
		id: generateId(),
		size: sizeName,
		quantity: randomBetween(0, 100),
		price: basePrice,
		discount,
		productVariantId,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

/**
 * Generate a color
 * @param {string} productVariantId - Product variant ID
 * @param {string} colorName - Color name
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Color data
 */
export function colorFactory(productVariantId, colorName, overrides = {}) {
	return {
		id: generateId(),
		name: colorName,
		productVariantId,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

/**
 * Generate a spec
 * @param {string} productId - Product ID (optional)
 * @param {string} variantId - Variant ID (optional)
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Spec data
 */
export function specFactory(productId = null, variantId = null, overrides = {}) {
	const specs = [
		{ name: "Materiale", value: randomPick(["Cotone 100%", "Poliestere", "Lana", "Seta", "Lino", "Misto"]) },
		{ name: "Lavaggio", value: randomPick(["Lavabile in lavatrice 30°", "Lavaggio a mano", "Solo lavaggio a secco"]) },
		{ name: "Paese di Origine", value: randomPick(["Italia", "Francia", "Portogallo", "Turchia"]) },
		{ name: "Stagione", value: randomPick(["Primavera/Estate", "Autunno/Inverno", "Quattro stagioni"]) },
	];

	const spec = overrides.spec || randomPick(specs);

	return {
		id: generateId(),
		name: spec.name,
		value: spec.value,
		productId,
		variantId,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

// ============= REVIEW FACTORIES =============

/**
 * Generate a review
 * @param {string} userId - User ID
 * @param {string} productId - Product ID
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Review data
 */
export function reviewFactory(userId, productId, overrides = {}) {
	return {
		id: generateId(),
		rating: randomFloat(3, 5, 1),
		review: generateReviewText(),
		likes: randomBetween(0, 50),
		color: randomPick(colors),
		quantity: "1",
		size: randomPick([...clothingSizes, ...shoeSizes]),
		variant: randomPick(colors),
		userId,
		productId,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

/**
 * Generate a review image
 * @param {string} reviewId - Review ID
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Review image data
 */
export function reviewImageFactory(reviewId, overrides = {}) {
	return {
		id: generateId(),
		url: generateImageUrl("review"),
		alt: "Immagine recensione",
		reviewId,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

// ============= ORDER FACTORIES =============

/**
 * Generate an order
 * @param {string} userId - User ID
 * @param {string} shippingAddressId - Shipping address ID
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Order data
 */
export function orderFactory(userId, shippingAddressId, overrides = {}) {
	const subTotal = overrides.subTotal || randomFloat(50, 500, 2);
	const shippingFees = overrides.shippingFees || randomFloat(5, 20, 2);
	const total = subTotal + shippingFees;

	return {
		id: generateId(),
		userId,
		orderStatus: overrides.orderStatus || randomPick(["Pending", "Confirmed", "Processing", "Shipped", "Delivered"]),
		paymentMethod: overrides.paymentMethod || randomPick(["Paypal", "Stripe"]),
		paymentStatus: overrides.paymentStatus || randomPick(["Pending", "Paid"]),
		shippingAddressId,
		shippingFees,
		subTotal,
		total,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

/**
 * Generate an order group
 * @param {string} orderId - Order ID
 * @param {string} storeId - Store ID
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Order group data
 */
export function orderGroupFactory(orderId, storeId, overrides = {}) {
	const subTotal = overrides.subTotal || randomFloat(30, 300, 2);
	const shippingFees = overrides.shippingFees || randomFloat(5, 15, 2);
	const total = subTotal + shippingFees;

	return {
		id: generateId(),
		status: overrides.status || randomPick(["Pending", "Confirmed", "Processing", "Shipped", "Delivered"]),
		shippingService: "Spedizione Standard",
		shippingDeliveryMin: randomBetween(3, 7),
		shippingDeliveryMax: randomBetween(10, 20),
		shippingFees,
		subTotal,
		total,
		orderId,
		storeId,
		couponId: overrides.couponId || null,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

/**
 * Generate an order item
 * @param {string} orderGroupId - Order group ID
 * @param {Object} productData - Product, variant, and size data
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Order item data
 */
export function orderItemFactory(orderGroupId, productData, overrides = {}) {
	const { product, variant, size } = productData;
	const quantity = overrides.quantity || randomBetween(1, 3);
	const price = size?.price || randomFloat(29.99, 199.99, 2);
	const shippingFee = overrides.shippingFee || randomFloat(0, 10, 2);
	const totalPrice = (price * quantity) + shippingFee;

	return {
		id: generateId(),
		quantity,
		image: variant?.variantImage || generateImageUrl("product"),
		name: product?.name || "Prodotto",
		price,
		shippingFee,
		size: size?.size || "M",
		sku: variant?.sku || `SKU-${generateId().slice(0, 8)}`,
		totalPrice,
		productSlug: product?.slug || "prodotto",
		variantSlug: variant?.slug || "variante",
		status: overrides.status || randomPick(["Pending", "Processing", "Shipped", "Delivered"]),
		orderGroupId,
		productId: product?.id || generateId(),
		sizeId: size?.id || generateId(),
		variantId: variant?.id || generateId(),
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

// ============= PAYMENT FACTORIES =============

/**
 * Generate payment details
 * @param {string} orderId - Order ID
 * @param {string} userId - User ID
 * @param {number} amount - Payment amount
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Payment details data
 */
export function paymentDetailsFactory(orderId, userId, amount, overrides = {}) {
	return {
		id: generateId(),
		paymentInetntId: `pi_${generateId()}`,
		paymentMethod: overrides.paymentMethod || randomPick(["Paypal", "Stripe"]),
		status: overrides.status || "Paid",
		amount,
		currency: "EUR",
		orderId,
		userId,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

// ============= CART FACTORIES =============

/**
 * Generate a cart
 * @param {string} userId - User ID
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Cart data
 */
export function cartFactory(userId, overrides = {}) {
	const subTotal = overrides.subTotal || randomFloat(50, 300, 2);
	const shippingFees = overrides.shippingFees || randomFloat(5, 15, 2);
	const total = subTotal + shippingFees;

	return {
		id: generateId(),
		userId,
		couponId: overrides.couponId || null,
		shippingFees,
		subTotal,
		total,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

/**
 * Generate a cart item
 * @param {string} cartId - Cart ID
 * @param {Object} productData - Product, variant, size, and store data
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Cart item data
 */
export function cartItemFactory(cartId, productData, overrides = {}) {
	const { product, variant, size, storeId } = productData;
	const quantity = overrides.quantity || randomBetween(1, 5);
	const price = size?.price || randomFloat(29.99, 199.99, 2);
	const shippingFee = overrides.shippingFee || randomFloat(0, 10, 2);
	const totalPrice = (price * quantity) + shippingFee;

	return {
		id: generateId(),
		productSlug: product?.slug || "prodotto",
		variantSlug: variant?.slug || "variante",
		sku: variant?.sku || `SKU-${generateId().slice(0, 8)}`,
		name: product?.name || "Prodotto",
		image: variant?.variantImage || generateImageUrl("product"),
		size: size?.size || "M",
		price,
		quantity,
		shippingFee,
		totalPrice,
		cartId,
		productId: product?.id || generateId(),
		variantId: variant?.id || generateId(),
		sizeId: size?.id || generateId(),
		storeId: storeId || generateId(),
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

// ============= WISHLIST FACTORIES =============

/**
 * Generate a wishlist item
 * @param {string} userId - User ID
 * @param {string} productId - Product ID
 * @param {string} variantId - Variant ID
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Wishlist data
 */
export function wishlistFactory(userId, productId, variantId, overrides = {}) {
	return {
		id: generateId(),
		userId,
		productId,
		variantId,
		sizeId: overrides.sizeId || null,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

// ============= SHIPPING FACTORIES =============

/**
 * Generate a shipping rate
 * @param {string} storeId - Store ID
 * @param {string} countryId - Country ID
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Shipping rate data
 */
export function shippingRateFactory(storeId, countryId, overrides = {}) {
	return {
		id: generateId(),
		shippingService: overrides.shippingService || randomPick(["Standard", "Express", "Prioritaria"]),
		shippingFeePerItem: randomFloat(3, 10, 2),
		shippingFeeForAdditionalItem: randomFloat(1, 5, 2),
		shippingFeePerKg: randomFloat(2, 15, 2),
		shippingFeeFixed: randomFloat(0, 10, 2),
		deliveryTimeMin: randomBetween(3, 7),
		deliveryTimeMax: randomBetween(10, 30),
		returnPolicy: "Reso gratuito entro 30 giorni.",
		countryId,
		storeId,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

/**
 * Generate free shipping configuration
 * @param {string} productId - Product ID
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Free shipping data
 */
export function freeShippingFactory(productId, overrides = {}) {
	return {
		id: generateId(),
		productId,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

/**
 * Generate free shipping country
 * @param {string} freeShippingId - Free shipping ID
 * @param {string} countryId - Country ID
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Free shipping country data
 */
export function freeShippingCountryFactory(freeShippingId, countryId, overrides = {}) {
	return {
		id: generateId(),
		freeShippingId,
		countryId,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

// ============= COUPON FACTORIES =============

/**
 * Generate a coupon
 * @param {string} storeId - Store ID
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Coupon data
 */
export function couponFactory(storeId, overrides = {}) {
	const code = overrides.code || `SAVE${randomBetween(10, 50)}`;
	const startDate = new Date();
	const endDate = new Date();
	endDate.setDate(endDate.getDate() + 30);

	return {
		id: generateId(),
		code,
		startDate: startDate.toISOString(),
		endDate: endDate.toISOString(),
		discount: randomBetween(5, 50),
		storeId,
		isActive: true,
		usageLimit: Math.random() > 0.5 ? randomBetween(50, 500) : null,
		usageCount: randomBetween(0, 50),
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

// ============= OTHER FACTORIES =============

/**
 * Generate an offer tag
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Offer tag data
 */
export function offerTagFactory(overrides = {}) {
	const name = overrides.name || `Offerta ${randomPick(["Speciale", "Limitata", "Esclusiva"])}`;
	const slug = generateSlug(name);

	return {
		id: generateId(),
		name,
		url: `/offers/${slug}`,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

/**
 * Generate a question
 * @param {string} productId - Product ID
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Question data
 */
export function questionFactory(productId, overrides = {}) {
	const questions = [
		{
			question: "Qual è la taglia consigliata per una persona di 175cm?",
			answer: "Per una persona di 175cm consigliamo la taglia M.",
		},
		{
			question: "Il prodotto è disponibile in altri colori?",
			answer: "Sì, il prodotto è disponibile in vari colori. Controlla le varianti disponibili.",
		},
		{
			question: "Quali sono i tempi di consegna?",
			answer: "I tempi di consegna variano da 3 a 7 giorni lavorativi.",
		},
		{
			question: "È possibile fare il reso?",
			answer: "Sì, è possibile effettuare il reso entro 30 giorni dall'acquisto.",
		},
	];

	const qa = randomPick(questions);

	return {
		id: generateId(),
		question: qa.question,
		answer: qa.answer,
		productId,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

/**
 * Generate a country
 * @param {string} name - Country name
 * @param {string} code - Country code
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Country data
 */
export function countryFactory(name, code, overrides = {}) {
	return {
		id: generateId(),
		name,
		code,
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

// ============= RELATIONSHIP FACTORIES =============

/**
 * Generate coupon to user relationship
 * @param {string} userId - User ID
 * @param {string} couponId - Coupon ID
 * @returns {Object} CouponToUser data
 */
export function couponToUserFactory(userId, couponId) {
	return {
		userId,
		couponId,
	};
}

/**
 * Generate user following store relationship
 * @param {string} userId - User ID
 * @param {string} storeId - Store ID
 * @returns {Object} UserFollowingStore data
 */
export function userFollowingStoreFactory(userId, storeId) {
	return {
		userId,
		storeId,
	};
}
