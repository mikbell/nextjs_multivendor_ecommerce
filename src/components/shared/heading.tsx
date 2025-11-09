import React from "react";

export default function Heading({
	children,
	level = 1,
	className = "",
}: {
	children: React.ReactNode;
	level?: 1 | 2 | 3 | 4 | 5 | 6;
	className?: string;
}) {
	const HeadingTag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

	const combinedClasses = `text-3xl md:text-4xl font-bold tracking-tight mb-4 ${className}`;

	return React.createElement(
		HeadingTag,
		{ className: combinedClasses },
		children
	);
}
