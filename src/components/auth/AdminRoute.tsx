import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface AdminRouteProps {
	children: React.ReactNode;
}

export default async function AdminRoute({ children }: AdminRouteProps) {
	const user = await currentUser();
	
	// Check if user is authenticated
	if (!user) {
		redirect("/sign-in");
	}
	
	// Check if user has admin role
	const userRole = user.privateMetadata?.role as string | undefined;
	if (userRole !== "ADMIN") {
		console.log(`[AUTH] Access denied to admin route for user ${user.id} with role ${userRole}`);
		redirect("/dashboard");
	}
	
	console.log(`[AUTH] Admin access granted to user ${user.id}`);
	return <>{children}</>;
}