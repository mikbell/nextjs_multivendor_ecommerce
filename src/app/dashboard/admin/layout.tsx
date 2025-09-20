import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "@/components/ui/resizable";

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
		<div className="w-full h-screen">
			<ResizablePanelGroup direction="horizontal" className="h-full">
				<ResizablePanel defaultSize={12} minSize={5} maxSize={35}>
					<Sidebar />
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={78} minSize={50}>
					<div className="flex flex-col h-full overflow-hidden">
						{/* Header */}
						<Header />
						{/* Content */}
						<div className="flex-1 overflow-auto p-4 pt-24">{children}</div>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
