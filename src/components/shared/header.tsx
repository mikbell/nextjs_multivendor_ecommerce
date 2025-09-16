import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

export function Header() {
	return (
		<header className="flex justify-end items-center p-4 gap-4 h-16">
			<SignedOut>
				<SignInButton />
				<SignUpButton>
					<Button>Sign Up</Button>
				</SignUpButton>
			</SignedOut>
			<SignedIn>
				<UserButton />
			</SignedIn>
		</header>
	);
}
