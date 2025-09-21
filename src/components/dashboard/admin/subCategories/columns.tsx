"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubCategoryWithCategoryType } from "@/lib/types";

function ActionsCell({ id }: { id: string }) {
	const router = useRouter();
	const [deleting, setDeleting] = useState(false);

	const onEdit = () => {
		router.push(`/dashboard/admin/categories/${id}`);
	};

	const onDelete = async () => {
		try {
			setDeleting(true);
			const res = await fetch(`/api/categories/${id}`, {
				method: "DELETE",
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data?.error || "Errore durante l'eliminazione.");
			}
			router.refresh();
		} catch (e) {
			console.error(e);
		} finally {
			setDeleting(false);
		}
	};

	return (
		<div className="flex justify-end">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" className="h-8 w-8 p-0">
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-40">
					<DropdownMenuItem
						onClick={onEdit}
						icon={<Pencil className="h-4 w-4" />}>
						Modifica
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={onDelete}
						icon={<Trash className="h-4 w-4" />}
						destructive
						loading={deleting}>
						Elimina
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export const columns: ColumnDef<SubCategoryWithCategoryType>[] = [
	{
		accessorKey: "image",
		header: "Immagine",
		cell: ({ row }) => {
			const image = row.original.image as string | null;
			const name = row.original.name as string | undefined;
			const fallback = (name?.[0] ?? "?").toUpperCase();
			return (
				<div className="flex items-center">
					{image ? (
						<Image
							src={image}
							alt={name ?? "Categoria"}
							width={50}
							height={50}
						/>
					) : (
						<div>{fallback}</div>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "name",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				className="px-0 font-medium">
				Nome
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
	},
	{
		accessorKey: "slug",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				className="px-0 font-medium">
				Slug
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
	},
	{
		accessorKey: "category.name",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				className="px-0 font-medium">
				Categoria
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
	},
	{
		id: "actions",
		header: "Azioni",
		cell: ({ row }) => <ActionsCell id={row.original.id} />,
	},
];
