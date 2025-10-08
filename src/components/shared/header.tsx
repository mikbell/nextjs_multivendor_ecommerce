"use client";

import {
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import { Button } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";
import Link from "next/link";

export function Header() {
	return (
		<header className="flex justify-between items-center p-4 gap-4 h-16">
			<Logo />

			<div className="flex items-center gap-4">
				<SignedOut>
					<Link href="sign-in">
						<Button variant="ghost">Accedi</Button>
					</Link>
					<Link href="sign-up">
						<Button>Registrati</Button>
					</Link>
				</SignedOut>
				<SignedIn>
					<Link href="/dashboard">
						<Button>Dashboard</Button>
					</Link>
					<UserButton />
				</SignedIn>
				<ThemeToggle />
			</div>
		</header>
	);
}
