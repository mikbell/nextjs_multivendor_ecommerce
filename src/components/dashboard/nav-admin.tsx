"use client";

import type { DashboardSidebarMenuInterface } from "@/lib/types";
import { icons } from "@/constants/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function NavAdmin({
	menuLinks,
}: {
	menuLinks: DashboardSidebarMenuInterface[];
}) {
	const pathname = usePathname();
	return (
		<div className="flex-1 overflow-auto p-4">
			<nav className="space-y-2 text-sm text-muted-foreground">
				<div className="font-medium text-foreground mb-2">Menu</div>

				{menuLinks.map((link, index) => {
					let icon;
					const iconSearch = icons.find((icon) => icon.value === link.icon);
					if (iconSearch) {
						icon = <iconSearch.path />;
					}

					return (
						<Link
							key={index}
							href={link.link}
							className={cn(
								"flex items-center gap-2 w-full h-12 cursor-pointer hover:bg-accent hover:text-accent-foreground px-2",
								pathname === link.link ? "bg-accent text-accent-foreground" : ""
							)}>
							{icon}
							<span className="font-semibold">{link.label}</span>
						</Link>
					);
				})}
			</nav>
		</div>
	);
}
