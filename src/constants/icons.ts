import {
	Logs,
	LayoutDashboard,
	Store,
	Users,
	Settings,
	Barcode,
	ChartColumnStacked,
	TicketPercent,
	Package,
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
		path: Logs,
	},
	{
		label: "Prodotti",
		value: "products",
		path: Barcode,
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
		label: "Inventario",
		value: "inventory",
		path: Package,
	},

	{
		label: "Spedizioni",
		value: "shipping",
		path: ChartColumnStacked,
	}
];
