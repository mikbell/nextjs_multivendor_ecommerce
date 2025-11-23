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
import { ArrowUpDown, MoreHorizontal, Edit, Trash, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type Coupon = {
	id: string;
	code: string;
	discount: number;
	startDate: string;
	endDate: string;
	usageLimit: number | null;
	usageCount: number;
	totalUsers: number;
	totalOrders: number;
	isActive: boolean;
	createdAt: Date;
};

const isExpired = (endDate: string): boolean => {
	return new Date(endDate) < new Date();
};

const isActive = (startDate: string, endDate: string, isActive: boolean): boolean => {
	const now = new Date();
	const start = new Date(startDate);
	const end = new Date(endDate);
	return isActive && now >= start && now <= end;
};

export const columns: ColumnDef<Coupon>[] = [
	{
		accessorKey: "code",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Codice
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-2">
					<span className="font-mono font-semibold">
						{row.getValue("code")}
					</span>
					<Button
						variant="ghost"
						size="sm"
						className="h-6 w-6 p-0"
						onClick={() =>
							navigator.clipboard.writeText(row.getValue("code"))
						}
					>
						<Copy className="h-3 w-3" />
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "discount",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Sconto
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const discount = row.getValue("discount") as number;
			return (
				<Badge variant="secondary" className="font-semibold">
					{discount}%
				</Badge>
			);
		},
	},
	{
		accessorKey: "startDate",
		header: "Periodo Validità",
		cell: ({ row }) => {
			const coupon = row.original;
			return (
				<div className="flex flex-col text-sm">
					<span>
						{new Date(coupon.startDate).toLocaleDateString("it-IT")}
					</span>
					<span className="text-muted-foreground">
						{new Date(coupon.endDate).toLocaleDateString("it-IT")}
					</span>
				</div>
			);
		},
	},
	{
		accessorKey: "usageCount",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Utilizzi
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const coupon = row.original;
			return (
				<div className="flex flex-col">
					<span className="font-medium">
						{coupon.usageCount}
						{coupon.usageLimit && ` / ${coupon.usageLimit}`}
					</span>
					<span className="text-xs text-muted-foreground">
						{coupon.totalOrders} ordini
					</span>
				</div>
			);
		},
	},
	{
		accessorKey: "totalUsers",
		header: "Utenti",
		cell: ({ row }) => {
			return <span className="font-medium">{row.getValue("totalUsers")}</span>;
		},
	},
	{
		accessorKey: "isActive",
		header: "Stato",
		cell: ({ row }) => {
			const coupon = row.original;
			const expired = isExpired(coupon.endDate);
			const active = isActive(coupon.startDate, coupon.endDate, coupon.isActive);
			const limitReached = coupon.usageLimit
				? coupon.usageCount >= coupon.usageLimit
				: false;

			let variant: "default" | "secondary" | "destructive" = "default";
			let label = "Attivo";

			if (!coupon.isActive) {
				variant = "secondary";
				label = "Disattivato";
			} else if (expired) {
				variant = "destructive";
				label = "Scaduto";
			} else if (limitReached) {
				variant = "secondary";
				label = "Limite Raggiunto";
			} else if (!active) {
				variant = "secondary";
				label = "Non Iniziato";
			}

			return <Badge variant={variant}>{label}</Badge>;
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const coupon = row.original;

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
							onClick={() => navigator.clipboard.writeText(coupon.code)}
						>
							<Copy className="mr-2 h-4 w-4" />
							Copia codice
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Edit className="mr-2 h-4 w-4" />
							Modifica
						</DropdownMenuItem>
						<DropdownMenuItem className="text-red-600">
							<Trash className="mr-2 h-4 w-4" />
							Elimina
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
