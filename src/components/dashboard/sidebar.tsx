import { currentUser } from "@clerk/nextjs/server";
import { FC } from "react";
import { Logo } from "@/components/shared/logo";
import { UserInfo } from "@/components/dashboard/user-info";

interface SidebarProps {
	isAdmin?: boolean;
}

const Sidebar: FC<SidebarProps> = async ({ isAdmin }) => {
	const user = await currentUser();

	return (
		<div className="h-full border-r bg-background">
			<div className="p-4">
				<Logo />
				{user && <UserInfo user={user} />}
			</div>

			<div className="h-full overflow-auto p-4">
				<nav className="space-y-2 text-sm text-muted-foreground">
					<div className="font-medium text-foreground mb-2">Menu</div>
					<ul className="space-y-1">
						<li className="rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground">
							Dashboard
						</li>
						<li className="rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground">
							Orders
						</li>
						<li className="rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground">
							Products
						</li>
						<li className="rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground">
							Settings
						</li>
					</ul>
				</nav>
			</div>
		</div>
	);
};

export default Sidebar;
