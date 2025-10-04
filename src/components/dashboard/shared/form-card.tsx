import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FormCardProps {
	title: string;
	description?: string;
	children: ReactNode;
	className?: string;
	loading?: boolean;
}

export const FormCard = ({
	title,
	description,
	children,
	className,
	loading = false
}: FormCardProps) => {
	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<CardTitle className="text-xl">{title}</CardTitle>
				{description && (
					<CardDescription>{description}</CardDescription>
				)}
			</CardHeader>
			<CardContent className={cn(loading && "opacity-50 pointer-events-none")}>
				{children}
			</CardContent>
		</Card>
	);
};