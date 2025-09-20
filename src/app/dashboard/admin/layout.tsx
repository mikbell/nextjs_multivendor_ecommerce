import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";

export default async function AdminDashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await currentUser();
	if (!user || user.privateMetadata.role !== "ADMIN") {
		redirect("/");
	}
	return (
		<div className="w-full h-screen flex">
			{/* Sidebar */}
			<Sidebar />

			{/* Main content column */}
			<div className="flex flex-1 flex-col h-full overflow-hidden">
				{/* Header */}
				<Header />
				{/* Scrollable content area */}
				<div className="flex-1 overflow-auto p-4">{children}</div>
			</div>
		</div>
	);
}
