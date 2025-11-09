"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Heading from "@/components/shared/heading";

interface PageHeaderProps {
	title: string;
	subtitle?: string;
	action?: ReactNode;
	showBackButton?: boolean;
	className?: string;
}

export const PageHeader = ({
	title,
	subtitle,
	action,
	showBackButton = false,
	className
}: PageHeaderProps) => {
	const router = useRouter();

	return (
		<div className={cn("flex flex-col gap-4 mb-6", className)}>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					{showBackButton && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => router.back()}
							className="h-8 w-8 p-0"
						>
							<ArrowLeft className="h-4 w-4" />
						</Button>
					)}
					<div>
						<Heading>
							{title}
						</Heading>
						{subtitle && (
							<p className="text-muted-foreground mt-1">{subtitle}</p>
						)}
					</div>
				</div>
				{action && <div className="flex items-center gap-2">{action}</div>}
			</div>
		</div>
	);
};