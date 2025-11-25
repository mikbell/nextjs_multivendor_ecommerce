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
import { ArrowUpDown, MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export type Product = {
	id: string;
	name: string;
	slug: string;
	brand: string;
	category: string;
	subCategory: string;
	variants: number;
	stock: number;
	price: number;
	sales: number;
	views: number;
	rating: number;
	reviews: number;
	isActive: boolean;
	createdAt: Date;
};

export const columns: ColumnDef<Product>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Nome
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const product = row.original;
			return (
				<div className="flex flex-col">
					<span className="font-medium">{product.name}</span>
					<span className="text-sm text-muted-foreground">
						{product.brand}
					</span>
				</div>
			);
		},
	},
	{
		accessorKey: "category",
		header: "Categoria",
		cell: ({ row }) => {
			const product = row.original;
			return (
				<div className="flex flex-col">
					<span className="text-sm">{product.category}</span>
					<span className="text-xs text-muted-foreground">
						{product.subCategory}
					</span>
				</div>
			);
		},
	},
	{
		accessorKey: "variants",
		header: "Varianti",
		cell: ({ row }) => {
			return <span>{row.getValue("variants")}</span>;
		},
	},
	{
		accessorKey: "stock",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Stock
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const stock = row.getValue("stock") as number;
			return (
				<Badge variant={stock > 0 ? "default" : "destructive"}>
					{stock}
				</Badge>
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
			const price = parseFloat(row.getValue("price"));
			const formatted = new Intl.NumberFormat("it-IT", {
				style: "currency",
				currency: "EUR",
			}).format(price);

			return <span className="font-medium">{formatted}</span>;
		},
	},
	{
		accessorKey: "sales",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Vendite
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "views",
		header: "Visualizzazioni",
	},
	{
		accessorKey: "rating",
		header: "Rating",
		cell: ({ row }) => {
			const product = row.original;
			return (
				<div className="flex flex-col">
					<span className="font-medium">{product.rating.toFixed(1)}</span>
					<span className="text-xs text-muted-foreground">
						({product.reviews} recensioni)
					</span>
				</div>
			);
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
	{
		id: "actions",
		cell: ({ row }) => {
			const product = row.original;

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
						<DropdownMenuItem asChild>
							<Link href={`/products/${product.slug}`}>
								<Eye className="mr-2 h-4 w-4" />
								Visualizza
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href={`/dashboard/seller/products/${product.id}/edit`}>
								<Edit className="mr-2 h-4 w-4" />
								Modifica
							</Link>
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
