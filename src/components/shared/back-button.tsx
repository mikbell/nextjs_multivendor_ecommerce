"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
	children?: React.ReactNode;
}

export function BackButton({
	variant = "outline",
	size = "lg",
	className = "w-full",
	children = "Torna indietro",
}: BackButtonProps) {
	return (
		<Button
			variant={variant}
			size={size}
			className={className}
			onClick={() => window.history.back()}>
			<ArrowLeft className="mr-2 h-4 w-4" />
			{children}
		</Button>
	);
}
