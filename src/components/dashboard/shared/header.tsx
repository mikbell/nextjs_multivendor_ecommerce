"use client";

import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function Header() {
    return (
        <header className="sticky top-0 z-20 p-4 bg-background/80 backdrop-blur-md flex gap-4 items-center border-b">
            <div className="flex items-center gap-2 ml-auto">
                <UserButton />
                <ThemeToggle />
            </div>
        </header>
    );
}
