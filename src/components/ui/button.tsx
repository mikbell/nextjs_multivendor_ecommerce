import type * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-hidden focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative overflow-hidden",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground shadow-2xs hover:bg-primary/90 hover:shadow-xs active:scale-[0.98]",
				destructive:
					"bg-destructive text-white shadow-2xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 hover:shadow-xs active:scale-[0.98]",
				outline:
					"border bg-background shadow-2xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 hover:shadow-xs active:scale-[0.98]",
				secondary:
					"bg-secondary text-secondary-foreground shadow-2xs hover:bg-secondary/80 hover:shadow-xs active:scale-[0.98]",
				ghost:
					"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 active:scale-[0.98]",
				link: "text-primary underline-offset-4 hover:underline active:scale-[0.98]",
				gradient:
					"bg-linear-to-r from-primary to-primary/80 text-primary-foreground shadow-2xs hover:from-primary/90 hover:to-primary/70 hover:shadow-xs active:scale-[0.98]",
				success:
					"bg-green-600 text-white shadow-2xs hover:bg-green-700 hover:shadow-xs active:scale-[0.98] dark:bg-green-700 dark:hover:bg-green-800",
				warning:
					"bg-yellow-500 text-white shadow-2xs hover:bg-yellow-600 hover:shadow-xs active:scale-[0.98] dark:bg-yellow-600 dark:hover:bg-yellow-700",
				info: "bg-blue-500 text-white shadow-2xs hover:bg-blue-600 hover:shadow-xs active:scale-[0.98] dark:bg-blue-600 dark:hover:bg-blue-700",
			},
			size: {
				xs: "h-7 rounded px-2.5 text-xs has-[>svg]:px-2",
				sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				xl: "h-12 rounded-lg px-8 text-base has-[>svg]:px-6",
				icon: "size-9",
				"icon-sm": "size-8",
				"icon-lg": "size-10",
				"icon-xl": "size-12",
			},
			loading: {
				true: "cursor-not-allowed",
				false: "",
			},
			fullWidth: {
				true: "w-full",
				false: "",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
			loading: false,
			fullWidth: false,
		},
	}
);

const LoadingSpinner = ({ className }: { className?: string }) => (
	<svg
		className={cn("animate-spin", className)}
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24">
		<circle
			className="opacity-25"
			cx="12"
			cy="12"
			r="10"
			stroke="currentColor"
			strokeWidth="4"
		/>
		<path
			className="opacity-75"
			fill="currentColor"
			d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
		/>
	</svg>
);

interface ButtonProps
	extends React.ComponentProps<"button">,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	loading?: boolean;
	loadingText?: string;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
}

function Button({
	className,
	variant,
	size,
	asChild = false,
	loading = false,
	loadingText,
	leftIcon,
	rightIcon,
	children,
	disabled,
	fullWidth,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot : "button";

	const isDisabled = disabled || loading;

	return (
		<Comp
			data-slot="button"
			className={cn(
				buttonVariants({ variant, size, loading, fullWidth, className })
			)}
			disabled={isDisabled}
			{...props}>
			{loading && <LoadingSpinner className="size-4" />}

			{!loading && leftIcon && leftIcon}

			{loading && loadingText ? loadingText : children}

			{!loading && rightIcon && rightIcon}
		</Comp>
	);
}

export { Button, buttonVariants, type ButtonProps };
