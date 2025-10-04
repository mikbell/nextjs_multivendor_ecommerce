import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
	size?: "sm" | "md" | "lg";
	className?: string;
	text?: string;
}

const LoadingSpinner = ({ size = "md", className, text }: LoadingProps) => {
	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-6 w-6",
		lg: "h-8 w-8",
	};

	return (
		<div className={cn("flex items-center justify-center gap-2", className)}>
			<Loader2 className={cn("animate-spin", sizeClasses[size])} />
			{text && <span className="text-sm text-muted-foreground">{text}</span>}
		</div>
	);
};

interface PageLoadingProps {
	text?: string;
	className?: string;
}

const PageLoading = ({ text = "Caricamento...", className }: PageLoadingProps) => {
	return (
		<div className={cn("flex items-center justify-center min-h-[200px]", className)}>
			<div className="text-center space-y-4">
				<LoadingSpinner size="lg" />
				<p className="text-muted-foreground">{text}</p>
			</div>
		</div>
	);
};

export { LoadingSpinner, PageLoading };