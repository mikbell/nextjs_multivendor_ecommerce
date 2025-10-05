import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface SellerRouteProps {
	children: React.ReactNode;
}

export default async function SellerRoute({ children }: SellerRouteProps) {
	const user = await currentUser();
	
	// Check if user is authenticated
	if (!user) {
		redirect("/sign-in");
	}
	
	// Check if user has seller or admin role
	const userRole = user.privateMetadata?.role as string | undefined;
	if (userRole !== "SELLER" && userRole !== "ADMIN") {
		console.log(`[AUTH] Access denied to seller route for user ${user.id} with role ${userRole}`);
		redirect("/dashboard");
	}
	
	console.log(`[AUTH] Seller access granted to user ${user.id} with role ${userRole}`);
	return <>{children}</>;
}