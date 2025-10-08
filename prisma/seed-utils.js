import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Generate CUID-like IDs
function generateId() {
	const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
	let result = "c";
	for (let i = 0; i < 24; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

// Generate random number between min and max (inclusive)
function randomBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate random float between min and max
function randomFloat(min, max, decimals = 2) {
	return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

// Pick random element from array
function randomPick(array) {
	return array[Math.floor(Math.random() * array.length)];
}

// Pick random elements from array (unique)
function randomPickMultiple(array, count) {
	const shuffled = [...array].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
}

// Generate slug from text
function generateSlug(text) {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9\s-]/g, "")
		.trim()
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

// Generate fake URLs for images
function generateImageUrl(category = "product", id = null) {
	const baseUrl = "https://picsum.photos";
	const width = category === "logo" ? 200 : category === "cover" ? 800 : 600;
	const height = category === "logo" ? 200 : category === "cover" ? 400 : 400;
	const seed = id || Math.floor(Math.random() * 1000);
	return `${baseUrl}/${width}/${height}?random=${seed}`;
}

// Italian product names
const productNames = [
	"Giacca Elegante",
	"Pantalone Classico",
	"Camicia Business",
	"Scarpe Derby",
	"Borsa in Pelle",
	"Orologio Vintage",
	"Occhiali da Sole",
	"Cappotto Invernale",
	"Maglietta Casual",
	"Jeans Slim Fit",
	"Sneakers Urbane",
	"Zaino Viaggio",
	"Sciarpa di Seta",
	"Guanti in Pelle",
	"Cravatta Seta",
	"Cintura Classica",
	"Felpa con Cappuccio",
	"Shorts Estivi",
	"Sandali Estivi",
	"Cappello Panama",
	"Vestito Elegante",
	"Gonna Midi",
	"Blusa Floreale",
	"Tacchi Alti",
	"Orecchini Dorati",
	"Collana Perle",
	"Braccialetto Argento",
	"Anello Solitario",
];

// Italian brand names
const brands = [
	"Milano Fashion",
	"Venezia Style",
	"Roma Elegance",
	"Firenze Design",
	"Napoli Luxury",
	"Torino Classic",
	"Bologna Trends",
	"Palermo Mode",
	"Genova Collection",
	"Verona Couture",
	"Padova Fashion",
	"Brescia Style",
];

// Category and subcategory data
const categoriesData = [
	{
		name: "Abbigliamento Uomo",
		description:
			"Collezione completa di abbigliamento maschile di alta qualità",
		subcategories: ["Camicie", "Pantaloni", "Giacche", "Magliette", "Jeans"],
	},
	{
		name: "Abbigliamento Donna",
		description: "Elegante collezione femminile per ogni occasione",
		subcategories: ["Vestiti", "Gonne", "Bluse", "Pantaloni", "Giacche"],
	},
	{
		name: "Scarpe",
		description: "Calzature di qualità per uomo e donna",
		subcategories: [
			"Scarpe Eleganti",
			"Sneakers",
			"Sandali",
			"Stivali",
			"Scarpe Sportive",
		],
	},
	{
		name: "Accessori",
		description: "Accessori di moda e complementi per il look perfetto",
		subcategories: ["Borse", "Cinture", "Orologi", "Occhiali", "Gioielli"],
	},
	{
		name: "Sport e Tempo Libero",
		description: "Abbigliamento e attrezzature per lo sport e il tempo libero",
		subcategories: [
			"Abbigliamento Sportivo",
			"Scarpe Sportive",
			"Attrezzature",
			"Outdoor",
			"Fitness",
		],
	},
];

// Store names and descriptions
const storeNames = [
	"Boutique Milano",
	"Fashion House Roma",
	"Style Corner Venezia",
	"Trendy Firenze",
	"Eleganza Napoli",
	"Modern Style Torino",
	"Chic Boutique Bologna",
	"Fashion Lab Genova",
	"Style Studio Verona",
	"Urban Fashion Padova",
	"Luxury Store Brescia",
	"Fashion Hub Palermo",
];

// Italian first and last names
const firstNames = [
	"Marco",
	"Giulia",
	"Francesco",
	"Chiara",
	"Alessandro",
	"Federica",
	"Andrea",
	"Valentina",
	"Matteo",
	"Francesca",
	"Davide",
	"Sara",
	"Simone",
	"Elisa",
	"Luca",
	"Martina",
	"Stefano",
	"Alessia",
	"Giuseppe",
	"Ilaria",
	"Antonio",
	"Silvia",
	"Roberto",
	"Monica",
	"Paolo",
	"Laura",
	"Giovanni",
	"Elena",
	"Michele",
	"Anna",
];

const lastNames = [
	"Rossi",
	"Ferrari",
	"Esposito",
	"Bianchi",
	"Romano",
	"Colombo",
	"Ricci",
	"Marino",
	"Greco",
	"Bruno",
	"Gallo",
	"Conti",
	"De Luca",
	"Mancini",
	"Costa",
	"Giordano",
	"Rizzo",
	"Lombardi",
	"Moretti",
	"Barbieri",
	"Fontana",
	"Santoro",
	"Mariani",
	"Rinaldi",
	"Caruso",
	"Ferrara",
	"Galli",
	"Martini",
	"Leone",
	"Longo",
];

// Product descriptions in Italian
function generateProductDescription() {
	const descriptions = [
		"Prodotto di alta qualità realizzato con materiali pregiati. Design moderno e funzionale perfetto per ogni occasione.",
		"Articolo elegante che unisce stile e comfort. Ideale per chi cerca qualità e raffinatezza nei dettagli.",
		"Capo versatile e di tendenza, perfetto per completare il tuo guardaroba con un tocco di classe.",
		"Design italiano contemporaneo che riflette l'eccellenza del made in Italy. Comfort e stile in un unico prodotto.",
		"Realizzato con cura artigianale, questo articolo rappresenta l'equilibrio perfetto tra tradizione e innovazione.",
		"Prodotto dalle linee pulite e moderne, ideale per chi ama distinguersi con eleganza e personalità.",
		"Articolo di tendenza che combina funzionalità e design. Perfetto per l'uso quotidiano e le occasioni speciali.",
		"Capo dall'anima contemporanea che esprime carattere e raffinatezza. Un must-have per il guardaroba moderno.",
	];
	return randomPick(descriptions);
}

// Sizes for different categories
const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const shoeSizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];
const accessorySizes = ["Unica", "S", "M", "L"];

// Colors in Italian
const colors = [
	"Nero",
	"Bianco",
	"Grigio",
	"Blu",
	"Rosso",
	"Verde",
	"Giallo",
	"Rosa",
	"Marrone",
	"Beige",
	"Viola",
	"Arancione",
	"Azzurro",
	"Bordeaux",
	"Navy",
];

// Generate review text
function generateReviewText() {
	const reviews = [
		"Prodotto eccellente, molto soddisfatto dell'acquisto. Qualità superiore alle aspettative.",
		"Bellissimo articolo, proprio come descritto. Spedizione veloce e imballaggio perfetto.",
		"Molto contento, il prodotto rispecchia perfettamente le foto. Consigliato!",
		"Ottima qualità dei materiali e fattura impeccabile. Lo ricomprerei sicuramente.",
		"Fantastico! Perfetto per le mie esigenze, design moderno e comfort eccezionale.",
		"Prodotto di qualità, arrivato nei tempi previsti. Venditore affidabile.",
		"Molto bello e ben fatto. Corrispondente alla descrizione, sono pienamente soddisfatto.",
		"Eccellente rapporto qualità-prezzo. Prodotto che consiglio vivamente.",
		"Articolo perfetto, materiali di prima scelta. Acquisto che rifarei ad occhi chiusi.",
		"Davvero bello, mi piace molto. Spedizione rapida e prodotto ben imballato.",
	];
	return randomPick(reviews);
}

// Italian cities
const cities = [
	"Milano",
	"Roma",
	"Napoli",
	"Torino",
	"Palermo",
	"Genova",
	"Bologna",
	"Firenze",
	"Venezia",
	"Verona",
	"Padova",
	"Brescia",
	"Modena",
	"Parma",
	"Reggio Emilia",
	"Catania",
];

// Generate address
function generateAddress() {
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
		address1: `${randomPick(streets)} ${randomBetween(1, 200)}`,
		city: randomPick(cities),
		state: "IT",
		zip_code: `${randomBetween(10000, 99999)}`,
	};
}

export {
	generateId,
	randomBetween,
	randomFloat,
	randomPick,
	randomPickMultiple,
	generateSlug,
	generateImageUrl,
	productNames,
	brands,
	categoriesData,
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
	generateAddress,
	prisma,
};
