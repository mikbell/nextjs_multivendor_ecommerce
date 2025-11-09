"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Trash } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { deleteCoupon, toggleCouponStatus } from "@/queries/coupon";
import Image from "next/image";

type CouponWithRelations = {
	id: string;
	code: string;
	startDate: string;
	endDate: string;
	discount: number;
	storeId: string;
	isActive: boolean;
	usageLimit: number | null;
	usageCount: number;
	createdAt: Date;
	store: {
		id: string;
		name: string;
		logo: string;
		url: string;
	};
	_count: {
		users: number;
		orderGroups: number;
	};
};

function ActionsCell({ coupon }: { coupon: CouponWithRelations }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const onDelete = async () => {
		try {
			setIsLoading(true);
			await deleteCoupon(coupon.id);
			toast.success("Coupon eliminato con successo");
			router.refresh();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Errore durante l'eliminazione del coupon"
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex justify-end">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 p-0"
						disabled={isLoading}>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuItem
						onClick={onDelete}
						icon={<Trash className="h-4 w-4" />}
						destructive
						disabled={isLoading}>
						Elimina
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

function ActiveToggle({ coupon }: { coupon: CouponWithRelations }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const onToggle = async (checked: boolean) => {
		try {
			setIsLoading(true);
			await toggleCouponStatus(coupon.id, checked);
			toast.success(
				checked ? "Coupon attivato" : "Coupon disattivato"
			);
			router.refresh();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Errore durante l'aggiornamento del coupon"
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Switch
			checked={coupon.isActive}
			onCheckedChange={onToggle}
			disabled={isLoading}
		/>
	);
}

export const columns: ColumnDef<CouponWithRelations>[] = [
	{
		accessorKey: "code",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				className="px-0 font-medium">
				Codice
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			const code = row.original.code;
			return (
				<span className="font-mono font-medium uppercase">{code}</span>
			);
		},
	},
	{
		accessorKey: "store.name",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				className="px-0 font-medium">
				Negozio
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			const store = row.original.store;
			return (
				<div className="flex items-center gap-2">
					<div className="relative h-8 w-8 overflow-hidden rounded-md">
						<Image
							src={store.logo}
							alt={store.name}
							fill
							className="object-cover"
						/>
					</div>
					<span className="font-medium">{store.name}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "discount",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				className="px-0 font-medium">
				Sconto
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			const discount = row.original.discount;
			return (
				<Badge variant="default" className="font-medium">
					{discount}%
				</Badge>
			);
		},
	},
	{
		accessorKey: "startDate",
		header: "Data Inizio",
		cell: ({ row }) => {
			const date = new Date(row.original.startDate);
			return (
				<span className="text-sm">{date.toLocaleDateString("it-IT")}</span>
			);
		},
	},
	{
		accessorKey: "endDate",
		header: "Data Fine",
		cell: ({ row }) => {
			const date = new Date(row.original.endDate);
			const now = new Date();
			const isExpired = date < now;
			return (
				<div className="flex flex-col">
					<span className="text-sm">{date.toLocaleDateString("it-IT")}</span>
					{isExpired && (
						<Badge variant="destructive" className="mt-1 w-fit text-xs">
							Scaduto
						</Badge>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "usageCount",
		header: "Utilizzo",
		cell: ({ row }) => {
			const usageCount = row.original.usageCount;
			const usageLimit = row.original.usageLimit;
			const orderGroups = row.original._count.orderGroups;
			
			return (
				<div className="flex flex-col">
					<span className="font-medium">
						{usageCount}
						{usageLimit ? ` / ${usageLimit}` : ""}
					</span>
					<span className="text-xs text-muted-foreground">
						{orderGroups} ordini
					</span>
				</div>
			);
		},
	},
	{
		accessorKey: "isActive",
		header: "Attivo",
		cell: ({ row }) => <ActiveToggle coupon={row.original} />,
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				className="px-0 font-medium">
				Data Creazione
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			const date = new Date(row.original.createdAt);
			return (
				<span className="text-sm">{date.toLocaleDateString("it-IT")}</span>
			);
		},
	},
	{
		id: "actions",
		header: "Azioni",
		cell: ({ row }) => <ActionsCell coupon={row.original} />,
	},
];
