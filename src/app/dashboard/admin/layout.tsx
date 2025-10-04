import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/shared/sidebar";
import Header from "@/components/dashboard/shared/header";

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
		<div className="min-h-screen bg-background">
			<div className="w-full h-screen flex">
				{/* Sidebar */}
				<Sidebar isAdmin />

				{/* Main content column */}
				<div className="flex flex-1 flex-col h-full overflow-hidden">
					{/* Header */}
					<Header />
					{/* Scrollable content area with proper spacing */}
					<main className="flex-1 overflow-auto p-6 bg-background">
						<div className="max-w-7xl mx-auto">
							{children}
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}
