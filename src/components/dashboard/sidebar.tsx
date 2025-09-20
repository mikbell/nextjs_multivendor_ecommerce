import { currentUser } from "@clerk/nextjs/server";
import { FC } from "react";
import { Logo } from "@/components/shared/logo";
import { UserInfo } from "@/components/dashboard/user-info";
import NavAdmin from "./nav-admin";
import { adminDashboardSidebarOptions } from "@/constants/data";

interface SidebarProps {
	isAdmin?: boolean;
}

const Sidebar: FC<SidebarProps> = async ({ isAdmin }) => {
	const user = await currentUser();

	return (
		<div className="h-full border-r bg-background flex flex-col">
			{/* Top section (non-scrollable) */}
			<div className="p-4 border-b">
				<Logo />
				{user && <UserInfo user={user} />}
			</div>

			{/* Scrollable nav section */}
			<NavAdmin menuLinks={adminDashboardSidebarOptions} />
		</div>
	);
};

export default Sidebar;
