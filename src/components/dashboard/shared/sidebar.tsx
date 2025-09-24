import { currentUser } from "@clerk/nextjs/server";
import { FC } from "react";
import { Logo } from "@/components/shared/logo";
import { UserInfo } from "@/components/dashboard/shared/user-info";
import NavAdmin from "../admin/nav-admin";
import { adminDashboardSidebarOptions } from "@/constants/data";
import { Store } from "@prisma/client";
import NavSeller from "../seller/nav-seller";
import { sellerDashboardSidebarOptions } from "@/constants/data";
import StoreSwitcher from "../seller/store-switcher";

interface SidebarProps {
	isAdmin?: boolean;
	stores?: Store[];
}

const Sidebar: FC<SidebarProps> = async ({ isAdmin, stores }) => {
	const user = await currentUser();

	return (
		<div className="h-full border-r bg-background flex flex-col">
			{/* Top section (non-scrollable) */}
			<div className="p-4 border-b">
				<Logo />
				{user && <UserInfo user={user} />}
			</div>

			{!isAdmin && stores && (
				<StoreSwitcher stores={stores} />
			)}

			{/* Scrollable nav section */}
			{isAdmin ? (
				<NavAdmin menuLinks={adminDashboardSidebarOptions} />
			) : (
				<NavSeller menuLinks={sellerDashboardSidebarOptions} />
			)}
		</div>
	);
};

export default Sidebar;
