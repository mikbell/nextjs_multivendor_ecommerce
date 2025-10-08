import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
	const user = await currentUser();
	if (!user?.privateMetadata?.role) {
		redirect("/");
	}
	if (user?.privateMetadata.role === "ADMIN") {
		redirect("/dashboard/admin");
	}
	if (user?.privateMetadata.role === "SELLER") {
		redirect("/dashboard/seller");
	}
	if (user?.privateMetadata.role === "USER") {
		// Gli utenti normali vedono una dashboard semplice
		return (
			<div className="min-h-screen bg-background p-6">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl font-bold mb-6">Dashboard Utente</h1>
					<div className="grid gap-6">
						<div className="bg-accent p-6 rounded-lg shadow">
							<h2 className="text-xl font-semibold mb-4">Benvenuto!</h2>
							<p>Questa è la tua dashboard personale.</p>
							<p>Al momento non puoi fare assolutamente niente :)</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return <div>Dashboard</div>;
}
