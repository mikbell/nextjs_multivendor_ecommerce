import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

interface SellerOrdersPageProps {
	params: Promise<{ slug: string }>;
}

export default async function SellerOrdersPage({
	params,
}: SellerOrdersPageProps) {
	const user = await currentUser();
	if (!user || user.privateMetadata.role !== "SELLER") {
		redirect("/");
	}

	const { slug } = await params;

	const store = await db.store.findUnique({
		where: { slug, userId: user.id },
		include: {
			orderGroups: {
				include: {
					order: {
						include: {
							shippingAddress: {
								include: {
									country: true,
								},
							},
							user: true,
						},
					},
					items: {
						include: {
							product: true,
							productVariant: true,
						},
					},
					coupon: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			},
		},
	});

	if (!store) {
		redirect("/dashboard/seller/stores");
	}

	const ordersData = store.orderGroups.map((orderGroup) => ({
		id: orderGroup.id,
		orderId: orderGroup.orderId,
		orderNumber: orderGroup.order.id.slice(0, 8),
		customer: orderGroup.order.user.name,
		customerEmail: orderGroup.order.user.email,
		items: orderGroup.items.length,
		products: orderGroup.items.map((item) => ({
			name: item.product.name,
			variant: item.variantSlug,
			quantity: item.quantity,
			price: item.price,
		})),
		shippingAddress: {
			address: `${orderGroup.order.shippingAddress.address1}, ${orderGroup.order.shippingAddress.city}, ${orderGroup.order.shippingAddress.state}`,
			country: orderGroup.order.shippingAddress.country.name,
		},
		shippingService: orderGroup.shippingService,
		deliveryTime: `${orderGroup.shippingDeliveryMin}-${orderGroup.shippingDeliveryMax} giorni`,
		subTotal: orderGroup.subTotal,
		shippingFees: orderGroup.shippingFees,
		total: orderGroup.total,
		coupon: orderGroup.coupon
			? {
					code: orderGroup.coupon.code,
					discount: orderGroup.coupon.discount,
				}
			: null,
		status: orderGroup.status,
		paymentStatus: orderGroup.order.paymentStatus,
		paymentMethod: orderGroup.order.paymentMethod,
		createdAt: orderGroup.createdAt,
	}));

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Ordini</h1>
				<p className="text-muted-foreground">
					Gestisci gli ordini del tuo negozio
				</p>
			</div>

			<DataTable columns={columns} data={ordersData} searchKey="orderNumber" />
		</div>
	);
}
