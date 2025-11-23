"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal, Eye, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { $Enums } from "@prisma/client";

export type Order = {
	id: string;
	orderId: string;
	orderNumber: string;
	customer: string;
	customerEmail: string;
	items: number;
	products: {
		name: string;
		variant: string;
		quantity: number;
		price: number;
	}[];
	shippingAddress: {
		address: string;
		country: string;
	};
	shippingService: string;
	deliveryTime: string;
	subTotal: number;
	shippingFees: number;
	total: number;
	coupon: {
		code: string;
		discount: number;
	} | null;
	status: $Enums.OrderGroupStatus;
	paymentStatus: $Enums.PaymentStatus;
	paymentMethod: $Enums.PaymentMethod | null;
	createdAt: Date;
};

const getStatusVariant = (
	status: $Enums.OrderGroupStatus
): "default" | "secondary" | "destructive" | "outline" => {
	switch (status) {
		case "Delivered":
			return "default";
		case "Pending":
		case "Confirmed":
			return "secondary";
		case "Processing":
		case "Shipped":
		case "OutforDelivery":
			return "outline";
		case "Cancelled":
		case "Failed":
		case "Returned":
			return "destructive";
		default:
			return "secondary";
	}
};

const getPaymentStatusVariant = (
	status: $Enums.PaymentStatus
): "default" | "secondary" | "destructive" => {
	switch (status) {
		case "Paid":
			return "default";
		case "Pending":
			return "secondary";
		default:
			return "destructive";
	}
};

export const columns: ColumnDef<Order>[] = [
	{
		accessorKey: "orderNumber",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Ordine
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<div className="flex flex-col">
					<span className="font-medium">#{row.getValue("orderNumber")}</span>
					<span className="text-xs text-muted-foreground">
						{new Date(row.original.createdAt).toLocaleDateString("it-IT")}
					</span>
				</div>
			);
		},
	},
	{
		accessorKey: "customer",
		header: "Cliente",
		cell: ({ row }) => {
			const order = row.original;
			return (
				<div className="flex flex-col">
					<span className="font-medium">{order.customer}</span>
					<span className="text-xs text-muted-foreground">
						{order.customerEmail}
					</span>
				</div>
			);
		},
	},
	{
		accessorKey: "items",
		header: "Articoli",
		cell: ({ row }) => {
			const order = row.original;
			return (
				<div className="flex items-center gap-2">
					<Package className="h-4 w-4 text-muted-foreground" />
					<span>{order.items}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "total",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Totale
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const total = parseFloat(row.getValue("total"));
			const formatted = new Intl.NumberFormat("it-IT", {
				style: "currency",
				currency: "EUR",
			}).format(total);

			return <span className="font-medium">{formatted}</span>;
		},
	},
	{
		accessorKey: "status",
		header: "Stato Ordine",
		cell: ({ row }) => {
			const status = row.getValue("status") as $Enums.OrderGroupStatus;
			return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
		},
	},
	{
		accessorKey: "paymentStatus",
		header: "Pagamento",
		cell: ({ row }) => {
			const order = row.original;
			return (
				<div className="flex flex-col gap-1">
					<Badge variant={getPaymentStatusVariant(order.paymentStatus)}>
						{order.paymentStatus}
					</Badge>
					{order.paymentMethod && (
						<span className="text-xs text-muted-foreground">
							{order.paymentMethod}
						</span>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "shippingService",
		header: "Spedizione",
		cell: ({ row }) => {
			const order = row.original;
			return (
				<div className="flex flex-col">
					<span className="text-sm">{order.shippingService}</span>
					<span className="text-xs text-muted-foreground">
						{order.deliveryTime}
					</span>
				</div>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const order = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Apri menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Azioni</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() =>
								navigator.clipboard.writeText(order.orderNumber)
							}
						>
							Copia ID ordine
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Eye className="mr-2 h-4 w-4" />
							Visualizza dettagli
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Package className="mr-2 h-4 w-4" />
							Aggiorna stato
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
