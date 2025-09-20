import type { DashboardSidebarMenuInterface } from "@/lib/types";

export const adminDashboardSidebarOptions: DashboardSidebarMenuInterface[] = [
	{
		label: "Dashboard",
		icon: "dashboard",
		link: "/dashboard/admin",
	},
	{
		label: "Negozi",
		icon: "stores",
		link: "/dashboard/admin/stores",
	},
	{
		label: "Ordini",
		icon: "orders",
		link: "/dashboard/admin/orders",
	},
	{
		label: "Categorie",
		icon: "categories",
		link: "/dashboard/admin/categories",
	},
	{
		label: "Sotto-categorie",
		icon: "categories",
		link: "/dashboard/admin/subcategories",
	},
	{
		label: "Coupon",
		icon: "coupons",
		link: "/dashboard/admin/coupons",
	},
	{
		label: "Impostazioni",
		icon: "settings",
		link: "/dashboard/admin/settings",
	},
	{
		label: "Logout",
		icon: "logout",
		link: "/dashboard/admin/logout",
	},
];
