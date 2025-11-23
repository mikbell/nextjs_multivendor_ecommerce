import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
	"/api/stripe-webhook(.*)",
	"/api/webhooks(.*)",
]);

export default clerkMiddleware((auth, req) => {
	// Public routes are accessible without authentication
	if (!isPublicRoute(req)) {
		// All other routes will have auth available but not required
		// Protected routes should check auth in their handlers
	}
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
