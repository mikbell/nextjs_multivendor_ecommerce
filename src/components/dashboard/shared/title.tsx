import { cn } from "@/lib/utils";

interface TitleProps {
	title: string;
	subtitle?: string;
	className?: string;
	centered?: boolean;
}

export const Title = ({
	title,
	subtitle,
	className,
	centered = true
}: TitleProps) => {
	return (
		<div className={cn(
			"mb-6",
			centered && "text-center",
			className
		)}>
			<h1 className="text-2xl font-bold text-foreground">{title}</h1>
			{subtitle && (
				<p className="text-muted-foreground mt-2">{subtitle}</p>
			)}
		</div>
	);
};