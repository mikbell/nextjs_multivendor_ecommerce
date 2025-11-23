import type { DashboardSidebarMenuInterface } from "@/lib/types";

export const adminDashboardSidebarOptions: DashboardSidebarMenuInterface[] = [
	{
		label: "Dashboard",
		icon: "dashboard",
		link: "",
	},
	{
		label: "Negozi",
		icon: "stores",
		link: "stores",
	},
	{
		label: "Ordini",
		icon: "orders",
		link: "orders",
	},
	{
		label: "Categorie",
		icon: "categories",
		link: "categories",
	},
	{
		label: "Sotto-categorie",
		icon: "categories",
		link: "subCategories",
	},
	{
		label: "Coupon",
		icon: "coupons",
		link: "coupons",
	},
	{
		label: "Impostazioni",
		icon: "settings",
		link: "settings",
	},
];

export const sellerDashboardSidebarOptions: DashboardSidebarMenuInterface[] = [
	{
		label: "Dashboard",
		icon: "dashboard",
		link: "",
	},
	{
		label: "Prodotti",
		icon: "products",
		link: "products",
	},
	{
		label: "Ordini",
		icon: "orders",
		link: "orders",
	},
	{
		label: "Inventario",
		icon: "inventory",
		link: "inventory",
	},
	{
		label: "Coupon",
		icon: "coupons",
		link: "coupons",
	},
	{
		label: "Spedizioni",
		icon: "shipping",
		link: "shipping",
	},
];
