"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

type OrderWithRelations = {
	id: string;
	userId: string;
	orderStatus: string;
	paymentMethod: string | null;
	paymentStatus: string;
	shippingFees: number;
	subTotal: number;
	total: number;
	createdAt: Date;
	user: {
		id: string;
		name: string;
		email: string;
	};
	shippingAddress: {
		firstName: string;
		lastName: string;
		city: string;
		state: string;
		countryId: string;
	};
	orderGroups: Array<{
		id: string;
		status: string;
		store: {
			id: string;
			name: string;
		};
		_count: {
			items: number;
		};
	}>;
	_count: {
		orderGroups: number;
	};
};

function ActionsCell({ order }: { order: OrderWithRelations }) {
	const router = useRouter();

	const onViewDetails = () => {
		router.push(`/dashboard/admin/orders/${order.id}`);
	};

	return (
		<div className="flex justify-end">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" className="h-8 w-8 p-0">
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuItem
						onClick={onViewDetails}
						icon={<Eye className="h-4 w-4" />}>
						Dettagli Ordine
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

const getOrderStatusConfig = (status: string) => {
	const configs: Record<
		string,
		{ label: string; variant: "default" | "secondary" | "destructive" | "outline" }
	> = {
		Pending: { label: "In Attesa", variant: "secondary" },
		Confirmed: { label: "Confermato", variant: "default" },
		Processing: { label: "In Elaborazione", variant: "default" },
		Shipped: { label: "Spedito", variant: "default" },
		OutforDelivery: { label: "In Consegna", variant: "default" },
		Delivered: { label: "Consegnato", variant: "default" },
		Cancelled: { label: "Annullato", variant: "destructive" },
		Failed: { label: "Fallito", variant: "destructive" },
		Refunded: { label: "Rimborsato", variant: "outline" },
		Returned: { label: "Restituito", variant: "outline" },
		PartiallyShipped: { label: "Parzialmente Spedito", variant: "secondary" },
		OnHold: { label: "In Attesa", variant: "outline" },
	};
	return configs[status] || { label: status, variant: "secondary" as const };
};

const getPaymentStatusConfig = (status: string) => {
	const configs: Record<
		string,
		{ label: string; variant: "default" | "secondary" | "destructive" | "outline" }
	> = {
		Pending: { label: "In Attesa", variant: "secondary" },
		Paid: { label: "Pagato", variant: "default" },
		Failed: { label: "Fallito", variant: "destructive" },
		Declined: { label: "Rifiutato", variant: "destructive" },
		Cancelled: { label: "Annullato", variant: "destructive" },
		Refunded: { label: "Rimborsato", variant: "outline" },
		PartiallyRefunded: { label: "Parzialmente Rimborsato", variant: "outline" },
		Chargeback: { label: "Chargeback", variant: "destructive" },
	};
	return configs[status] || { label: status, variant: "secondary" as const };
};

export const columns: ColumnDef<OrderWithRelations>[] = [
	{
		accessorKey: "id",
		header: "ID Ordine",
		cell: ({ row }) => {
			const id = row.original.id;
			return (
				<Button
					variant="link"
					className="px-0 h-auto font-mono text-xs"
					onClick={() => {
						window.location.href = `/dashboard/admin/orders/${id}`;
					}}>
					{id.substring(0, 8)}...
				</Button>
			);
		},
	},
	{
		accessorKey: "user.name",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				className="px-0 font-medium">
				Cliente
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			const user = row.original.user;
			return (
				<div className="flex flex-col">
					<span className="font-medium">{user.name}</span>
					<span className="text-xs text-muted-foreground">{user.email}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "orderStatus",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				className="px-0 font-medium">
				Stato Ordine
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			const status = row.original.orderStatus;
			const config = getOrderStatusConfig(status);
			return (
				<Badge variant={config.variant} className="whitespace-nowrap">
					{config.label}
				</Badge>
			);
		},
	},
	{
		accessorKey: "paymentStatus",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				className="px-0 font-medium">
				Stato Pagamento
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			const status = row.original.paymentStatus;
			const config = getPaymentStatusConfig(status);
			return (
				<Badge variant={config.variant} className="whitespace-nowrap">
					{config.label}
				</Badge>
			);
		},
	},
	{
		accessorKey: "total",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				className="px-0 font-medium">
				Totale
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			const total = row.original.total;
			return (
				<span className="font-medium">€{total.toFixed(2)}</span>
			);
		},
	},
	{
		accessorKey: "_count.orderGroups",
		header: "Negozi",
		cell: ({ row }) => {
			const count = row.original._count.orderGroups;
			const totalItems = row.original.orderGroups.reduce(
				(sum, group) => sum + group._count.items,
				0
			);
			return (
				<div className="flex flex-col">
					<span className="font-medium">{count} negozi</span>
					<span className="text-xs text-muted-foreground">
						{totalItems} articoli
					</span>
				</div>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				className="px-0 font-medium">
				Data Ordine
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			const date = new Date(row.original.createdAt);
			return (
				<div className="flex flex-col">
					<span className="font-medium">{date.toLocaleDateString("it-IT")}</span>
					<span className="text-xs text-muted-foreground">
						{date.toLocaleTimeString("it-IT", {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>
				</div>
			);
		},
	},
	{
		id: "actions",
		header: "Azioni",
		cell: ({ row }) => <ActionsCell order={row.original} />,
	},
];
