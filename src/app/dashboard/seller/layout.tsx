import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/shared/sidebar";
import Header from "@/components/dashboard/shared/header";
import { db } from "@/lib/db";

export default async function SellerDashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await currentUser();

	if (!user) {
		redirect("/");
	}

	// Verifica che l'utente abbia il ruolo seller o admin
	const userRole = user.privateMetadata.role as string;
	if (userRole !== "SELLER" && userRole !== "ADMIN") {
		redirect("/");
	}

	// Recupera i negozi dell'utente per la sidebar
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
		<div className="min-h-screen bg-background">
			<div className="w-full h-screen flex">
				{/* Sidebar */}
				<Sidebar stores={stores} />

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
