import {
	Boxes,
	LayoutDashboard,
	Store,
	Users,
	Settings,
	LogOut,
	ChartColumnStacked,
	TicketPercent,
} from "lucide-react";

export const icons = [
	{
		label: "Dashboard",
		value: "dashboard",
		path: LayoutDashboard,
	},

	{
		label: "Negozi",
		value: "stores",
		path: Store,
	},
	{
		label: "Ordini",
		value: "orders",
		path: Boxes,
	},
	{
		label: "Products",
		value: "products",
		path: Boxes,
	},
	{
		label: "Categorie",
		value: "categories",
		path: ChartColumnStacked,
	},
	{
		label: "Sotto-categorie",
		value: "subCategories",
		path: ChartColumnStacked,
	},
	{
		label: "Coupon",
		value: "coupons",
		path: TicketPercent,
	},

	{
		label: "Utenti",
		value: "users",
		path: Users,
	},
	{
		label: "Impostazioni",
		value: "settings",
		path: Settings,
	},

	{
		label: "Logout",
		value: "logout",
		path: LogOut,
	},
];
