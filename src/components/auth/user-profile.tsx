"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, ShoppingBag } from "lucide-react";

interface UserProfileProps {
	showFullProfile?: boolean;
}

export function UserProfile({ showFullProfile = false }: UserProfileProps) {
	const { user, isLoaded } = useUser();

	if (!isLoaded) {
		return (
			<div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
		);
	}

	if (!user) {
		return null;
	}

	if (showFullProfile) {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="relative h-8 w-8 rounded-full">
						<Avatar className="h-8 w-8">
							<AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
							<AvatarFallback>
								{user.firstName?.[0]}{user.lastName?.[0]}
							</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">
								{user.fullName}
							</p>
							<p className="text-xs leading-none text-muted-foreground">
								{user.primaryEmailAddress?.emailAddress}
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<User className="mr-2 h-4 w-4" />
						<span>Profilo</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<ShoppingBag className="mr-2 h-4 w-4" />
						<span>I miei ordini</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Settings className="mr-2 h-4 w-4" />
						<span>Impostazioni</span>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Esci</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}

	// Usa il componente UserButton di Clerk per una gestione semplice
	return (
		<UserButton
			appearance={{
				elements: {
					avatarBox: "h-8 w-8",
				},
			}}
		/>
	);
}
