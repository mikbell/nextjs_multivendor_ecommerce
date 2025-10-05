import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Define protected routes
const protectedRoutes = createRouteMatcher([
	"/dashboard",
	"/dashboard/(.*)",
	"/api/admin/(.*)",
	"/api/seller/(.*)",
]);

// Define admin routes
const adminRoutes = createRouteMatcher([
	"/dashboard/admin/(.*)",
	"/api/admin/(.*)",
]);

// Define seller routes
const sellerRoutes = createRouteMatcher([
	"/dashboard/seller/(.*)",
	"/api/seller/(.*)",
]);

// Security headers
function addSecurityHeaders(response: NextResponse): NextResponse {
	// Content Security Policy
	response.headers.set(
		'Content-Security-Policy',
		"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com https://*.clerk.accounts.dev; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.clerk.com https://*.clerk.accounts.dev; frame-src https://clerk.com https://*.clerk.accounts.dev;"
	);
	
	// Other security headers
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-XSS-Protection', '1; mode=block');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	
	// HSTS (only in production)
	if (process.env.NODE_ENV === 'production') {
		response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
	}
	
	return response;
}

// Log suspicious activity
function logSuspiciousActivity(request: NextRequest, reason: string): void {
	const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
		request.headers.get('x-real-ip') || 
		request.ip || 'unknown';
	
	console.warn(`[SECURITY] Suspicious activity from ${ip}: ${reason}`, {
		url: request.url,
		userAgent: request.headers.get('user-agent'),
		timestamp: new Date().toISOString(),
	});
}

export default clerkMiddleware(async (auth, request: NextRequest) => {
	const { pathname } = request.nextUrl;
	
	// Check for suspicious patterns
	if (pathname.includes('../') || pathname.includes('..\\') || pathname.includes('%2e%2e')) {
		logSuspiciousActivity(request, 'Path traversal attempt');
		return new NextResponse('Forbidden', { status: 403 });
	}
	
	// Basic SQL injection detection in query parameters
	const searchParams = request.nextUrl.searchParams;
	for (const [key, value] of searchParams.entries()) {
		if (/(union|select|insert|update|delete|drop|create|alter|exec|script)/i.test(value)) {
			logSuspiciousActivity(request, `Potential SQL injection in parameter: ${key}`);
			return new NextResponse('Bad Request', { status: 400 });
		}
	}
	
	// Authentication check for protected routes
	if (protectedRoutes(request)) {
		try {
			const { userId, sessionClaims } = await auth.protect();
			
			// NOTE: Role-based access control is now handled in individual pages
			// due to Edge Runtime limitations with clerkClient
			console.log(`[DEBUG] User ${userId} accessing protected route ${pathname}`);
			
			// Basic authentication check only
			if (adminRoutes(request) || sellerRoutes(request)) {
				console.log('[DEBUG] Protected route - authentication verified');
			}
		} catch (error) {
			// Authentication failed, redirect to sign-in
			return NextResponse.redirect(new URL('/sign-in', request.url));
		}
	}
	
	// Create response with security headers
	const response = NextResponse.next();
	return addSecurityHeaders(response);
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
