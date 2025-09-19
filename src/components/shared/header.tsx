import {
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
	UserButton,
} from "@clerk/nextjs";
import { Button } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";

export function Header() {
	return (
		<header className="flex justify-between items-center p-4 gap-4 h-16">
			<Logo />

			<div className="flex items-center gap-4">
				<SignedOut>
					<SignInButton>
						<Button variant="ghost">Accedi</Button>
					</SignInButton>
					<SignUpButton>
						<Button>Registrati</Button>
					</SignUpButton>
				</SignedOut>
				<SignedIn>
					<UserButton />
				</SignedIn>
				<ThemeToggle />
			</div>
		</header>
	);
}
