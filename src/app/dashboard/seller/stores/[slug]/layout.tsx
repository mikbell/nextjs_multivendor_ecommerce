import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/shared/sidebar";
import Header from "@/components/dashboard/shared/header";
import { db } from "@/lib/db";

export default async function SellerStoreDashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await currentUser();
	if (!user || user.privateMetadata.role !== "SELLER") {
		redirect("/");
	}

    const stores = await db.store.findMany({
        where: {
            userId: user.id,
        },
        select: {
            id: true,
            name: true,
            slug: true,
        },
    });

	return (
		<div className="w-full h-screen flex">
			{/* Sidebar */}
			<Sidebar stores={stores} />

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
