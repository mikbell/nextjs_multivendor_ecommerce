"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export type InventoryItem = {
	id: string;
	productId: string;
	productName: string;
	productSlug: string;
	variantId: string;
	variantName: string;
	variantSlug: string;
	sku: string;
	size: string;
	quantity: number;
	price: number;
	discount: number;
	finalPrice: number;
	isActive: boolean;
};

const getStockVariant = (
	quantity: number
): "default" | "secondary" | "destructive" => {
	if (quantity === 0) return "destructive";
	if (quantity <= 10) return "secondary";
	return "default";
};

const getStockLabel = (quantity: number): string => {
	if (quantity === 0) return "Esaurito";
	if (quantity <= 10) return "Stock Basso";
	return "Disponibile";
};

export const columns: ColumnDef<InventoryItem>[] = [
	{
		accessorKey: "productName",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Prodotto
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const item = row.original;
			return (
				<div className="flex flex-col">
					<Link
						href={`/product/${item.productSlug}/${item.variantSlug}`}
						className="font-medium hover:underline"
					>
						{item.productName}
					</Link>
					<span className="text-sm text-muted-foreground">
						{item.variantName}
					</span>
				</div>
			);
		},
	},
	{
		accessorKey: "sku",
		header: "SKU",
		cell: ({ row }) => {
			return (
				<span className="font-mono text-sm">{row.getValue("sku")}</span>
			);
		},
	},
	{
		accessorKey: "size",
		header: "Taglia",
		cell: ({ row }) => {
			return <Badge variant="outline">{row.getValue("size")}</Badge>;
		},
	},
	{
		accessorKey: "quantity",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Quantità
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const quantity = row.getValue("quantity") as number;
			return (
				<div className="flex items-center gap-2">
					<span className="font-medium">{quantity}</span>
					<Badge variant={getStockVariant(quantity)}>
						{getStockLabel(quantity)}
					</Badge>
				</div>
			);
		},
	},
	{
		accessorKey: "price",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Prezzo
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const item = row.original;
			const price = parseFloat(row.getValue("price"));
			const formatted = new Intl.NumberFormat("it-IT", {
				style: "currency",
				currency: "EUR",
			}).format(price);

			return (
				<div className="flex flex-col">
					<span className={item.discount > 0 ? "line-through text-sm text-muted-foreground" : "font-medium"}>
						{formatted}
					</span>
					{item.discount > 0 && (
						<span className="font-medium text-green-600">
							€{item.finalPrice.toFixed(2)}
						</span>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "discount",
		header: "Sconto",
		cell: ({ row }) => {
			const discount = row.getValue("discount") as number;
			return discount > 0 ? (
				<Badge variant="secondary">{discount}%</Badge>
			) : (
				<span className="text-muted-foreground">-</span>
			);
		},
	},
	{
		id: "totalValue",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Valore Totale
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const item = row.original;
			const totalValue = item.finalPrice * item.quantity;
			const formatted = new Intl.NumberFormat("it-IT", {
				style: "currency",
				currency: "EUR",
			}).format(totalValue);

			return <span className="font-medium">{formatted}</span>;
		},
	},
	{
		accessorKey: "isActive",
		header: "Stato",
		cell: ({ row }) => {
			const isActive = row.getValue("isActive") as boolean;
			return (
				<Badge variant={isActive ? "default" : "secondary"}>
					{isActive ? "Attivo" : "Inattivo"}
				</Badge>
			);
		},
	},
];
