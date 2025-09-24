import { db } from "@/lib/db";
import StoreDetails from "@/components/dashboard/seller/forms/store-details";
import { redirect } from "next/navigation";

export default async function SellerStoreSettingsPage({
	params,
}: {
	params: { slug: string };
}) {
	const storeDetails = await db.store.findUnique({
		where: {
			slug: params.slug,
		},
	});
	if (!storeDetails) {
		return redirect(`/dashboard/seller/stores`);
	}
	return (
		<div>
			<StoreDetails data={storeDetails} />
		</div>
	);
}
