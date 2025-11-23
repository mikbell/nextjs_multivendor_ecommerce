import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SellerStoreDashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await currentUser();
	if (!user || user.privateMetadata.role !== "SELLER") {
		redirect("/");
	}

	return <>{children}</>;
}
