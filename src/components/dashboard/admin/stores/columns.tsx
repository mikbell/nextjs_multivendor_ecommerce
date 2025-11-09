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
import { MoreHorizontal, Trash, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { updateStoreStatus, deleteStore } from "@/queries/store";

type Store = {
	id: string;
	name: string;
	slug: string;
	description: string;
	email: string;
	phone: string;
	logo: string;
	cover: string;
	url: string;
	featured: boolean;
	status: "PENDING" | "ACTIVE" | "BANNED" | "DISABLED";
	averageRating: number;
	numReviews: number;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
};

function ActionsCell({ store }: { store: Store }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const onViewPublic = () => {
		window.open(`/stores/${store.url}`, "_blank");
	};

	const onViewDetails = () => {
		router.push(`/dashboard/admin/stores/${store.id}`);
	};

	const onDelete = async () => {
		try {
			setIsLoading(true);
			await deleteStore(store.id);
			toast.success("Negozio eliminato con successo");
			router.refresh();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Errore durante l'eliminazione del negozio"
			);
		} finally {
			setIsLoading(false);
		}
	};

	const onApprove = async () => {
		try {
			setIsLoading(true);
			await updateStoreStatus(store.id, "ACTIVE");
			toast.success("Negozio approvato con successo");
			router.refresh();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Errore durante l'approvazione del negozio"
			);
		} finally {
			setIsLoading(false);
		}
	};

	const onBan = async () => {
		try {
			setIsLoading(true);
			await updateStoreStatus(store.id, "BANNED");
			toast.success("Negozio bannato con successo");
			router.refresh();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Errore durante il ban del negozio"
			);
		} finally {
			setIsLoading(false);
		}
	};

	const onDisable = async () => {
		try {
			setIsLoading(true);
			await updateStoreStatus(store.id, "DISABLED");
			toast.success("Negozio disabilitato con successo");
			router.refresh();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Errore durante la disabilitazione del negozio"
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
						onClick={onViewDetails}
						icon={<Eye className="h-4 w-4" />}>
						Dettagli Negozio
					</DropdownMenuItem>
					<DropdownMenuItem onClick={onViewPublic}>
						Visualizza Pubblico
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					{store.status === "PENDING" && (
						<DropdownMenuItem onClick={onApprove} disabled={isLoading}>
							Approva
						</DropdownMenuItem>
					)}
					{store.status !== "BANNED" && (
						<DropdownMenuItem
							onClick={onBan}
							destructive
							disabled={isLoading}>
							Banna
						</DropdownMenuItem>
					)}
					{store.status !== "DISABLED" && (
						<DropdownMenuItem onClick={onDisable} disabled={isLoading}>
							Disabilita
						</DropdownMenuItem>
					)}
					{store.status === "DISABLED" && (
						<DropdownMenuItem onClick={onApprove} disabled={isLoading}>
							Riabilita
						</DropdownMenuItem>
					)}
					<DropdownMenuSeparator />
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

export const columns: ColumnDef<Store>[] = [
	{
		accessorKey: "logo",
		header: "Logo",
		cell: ({ row }) => {
			const logo = row.original.logo;
			const name = row.original.name;
			return (
				<div className="flex items-center">
					<Image
						src={logo}
						alt={name}
						width={40}
						height={40}
						className="rounded-md object-cover"
					/>
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
		cell: ({ row }) => {
			const store = row.original;
			return (
				<Button
					variant="link"
					className="px-0 h-auto font-normal"
					onClick={() => {
						window.location.href = `/dashboard/admin/stores/${store.id}`;
					}}>
					{store.name}
				</Button>
			);
		},
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "status",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				className="px-0 font-medium">
				Stato
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			const status = row.original.status;
			const statusConfig = {
				PENDING: { label: "In Attesa", variant: "secondary" as const },
				ACTIVE: { label: "Attivo", variant: "default" as const },
				BANNED: { label: "Bannato", variant: "destructive" as const },
				DISABLED: { label: "Disabilitato", variant: "outline" as const },
			};
			const config = statusConfig[status];
			return (
				<Badge variant={config.variant} className="whitespace-nowrap">
					{config.label}
				</Badge>
			);
		},
	},
	{
		accessorKey: "featured",
		header: "In Evidenza",
		cell: ({ row }) => {
			const isFeatured = row.original.featured;
			return (
				<Badge variant={isFeatured ? "default" : "secondary"}>
					{isFeatured ? "Sì" : "No"}
				</Badge>
			);
		},
	},
	{
		accessorKey: "averageRating",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				className="px-0 font-medium">
				Rating
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			const rating = row.original.averageRating;
			const numReviews = row.original.numReviews;
			return (
				<div className="flex items-center gap-1">
					<span className="font-medium">{rating.toFixed(1)}</span>
					<span className="text-xs text-muted-foreground">
						({numReviews})
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
				Data Creazione
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			const date = new Date(row.original.createdAt);
			return date.toLocaleDateString("it-IT");
		},
	},
	{
		id: "actions",
		header: "Azioni",
		cell: ({ row }) => <ActionsCell store={row.original} />,
	},
];
