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
import { ArrowUpDown, MoreHorizontal, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type ShippingRate = {
	id: string;
	country: string;
	countryCode: string;
	shippingService: string;
	shippingFeePerItem: number;
	shippingFeeForAdditionalItem: number;
	shippingFeePerKg: number;
	shippingFeeFixed: number;
	deliveryTimeMin: number;
	deliveryTimeMax: number;
	returnPolicy: string;
	createdAt: Date;
	updatedAt: Date;
};

export const columns: ColumnDef<ShippingRate>[] = [
	{
		accessorKey: "country",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Paese
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const rate = row.original;
			return (
				<div className="flex items-center gap-2">
					<span className="text-2xl">{getFlagEmoji(rate.countryCode)}</span>
					<span className="font-medium">{rate.country}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "shippingService",
		header: "Servizio",
		cell: ({ row }) => {
			return (
				<Badge variant="outline">{row.getValue("shippingService")}</Badge>
			);
		},
	},
	{
		accessorKey: "deliveryTimeMin",
		header: "Tempo Consegna",
		cell: ({ row }) => {
			const rate = row.original;
			return (
				<span className="text-sm">
					{rate.deliveryTimeMin}-{rate.deliveryTimeMax} giorni
				</span>
			);
		},
	},
	{
		id: "shippingFees",
		header: "Tariffe",
		cell: ({ row }) => {
			const rate = row.original;
			return (
				<div className="flex flex-col text-sm">
					{rate.shippingFeeFixed > 0 && (
						<span>
							Fissa: <strong>€{rate.shippingFeeFixed.toFixed(2)}</strong>
						</span>
					)}
					{rate.shippingFeePerItem > 0 && (
						<span>
							Per articolo:{" "}
							<strong>€{rate.shippingFeePerItem.toFixed(2)}</strong>
						</span>
					)}
					{rate.shippingFeeForAdditionalItem > 0 && (
						<span className="text-muted-foreground">
							Aggiuntivo:{" "}
							€{rate.shippingFeeForAdditionalItem.toFixed(2)}
						</span>
					)}
					{rate.shippingFeePerKg > 0 && (
						<span>
							Per kg: <strong>€{rate.shippingFeePerKg.toFixed(2)}</strong>
						</span>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "returnPolicy",
		header: "Politica di Reso",
		cell: ({ row }) => {
			const policy = row.getValue("returnPolicy") as string;
			return (
				<span className="text-sm text-muted-foreground">
					{policy.length > 30 ? `${policy.substring(0, 30)}...` : policy}
				</span>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const rate = row.original;

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
						<DropdownMenuItem>
							<Edit className="mr-2 h-4 w-4" />
							Modifica
						</DropdownMenuItem>
						<DropdownMenuSeparator />
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

function getFlagEmoji(countryCode: string): string {
	const codePoints = countryCode
		.toUpperCase()
		.split("")
		.map((char) => 127397 + char.charCodeAt(0));
	return String.fromCodePoint(...codePoints);
}
