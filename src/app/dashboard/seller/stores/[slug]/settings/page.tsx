import { db } from "@/lib/db";
import StoreDetails from "@/components/dashboard/seller/forms/store-details";
import { redirect } from "next/navigation";
import { StoreFormSchema } from "@/lib/schemas";
import * as z from "zod";

export default async function SellerStoreSettingsPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const storeDetails = await db.store.findUnique({
		where: {
			slug: slug,
		},
	});
	if (!storeDetails) {
		return redirect(`/dashboard/seller/stores`);
	}
	// Narrow and sanitize nullable fields (null -> undefined) to match StoreDetails expected type
	const data: Partial<z.input<typeof StoreFormSchema>> & { id?: string } = {
		id: storeDetails.id,
		name: storeDetails.name,
		description: storeDetails.description ?? undefined,
		logo: storeDetails.logo ?? undefined,
		cover: storeDetails.cover ?? undefined,
		email: storeDetails.email ?? undefined,
		phone: storeDetails.phone ?? undefined,
		slug: storeDetails.slug ?? undefined,
		featured: storeDetails.featured ?? undefined,
		returnPolicy: storeDetails.returnPolicy ?? undefined,
		defaultShippingService: storeDetails.defaultShippingService ?? undefined,
		defaultShippingFee: storeDetails.defaultShippingFeePerKg ?? undefined,
		defaultDeliveryTimeMin: storeDetails.defaultDeliveryTimeMin ?? undefined,
		defaultDeliveryTimeMax: storeDetails.defaultDeliveryTimeMax ?? undefined,
	};

	return <StoreDetails data={data} />;
}
