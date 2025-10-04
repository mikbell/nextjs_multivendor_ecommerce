import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function SellerDashboardPage() {
	const user = await currentUser();
	if (!user) {
		return redirect("/");
	}

	const stores = await db.store.findMany({
		where: {
			userId: user.id,
		},
	});

	if (!stores || stores.length === 0) {
		return redirect("/dashboard/seller/stores/new");
	}

	return redirect(`/dashboard/seller/stores/${stores[0]?.slug}`);
}
