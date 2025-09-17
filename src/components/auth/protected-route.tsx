"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
	redirectTo?: string;
}

export function ProtectedRoute({ 
	children, 
	fallback,
	redirectTo = "/sign-in" 
}: ProtectedRouteProps) {
	const { isLoaded, isSignedIn } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (isLoaded && !isSignedIn) {
			router.push(redirectTo);
		}
	}, [isLoaded, isSignedIn, router, redirectTo]);

	if (!isLoaded) {
		return (
			fallback || (
				<div className="flex h-screen items-center justify-center">
					<Loader2 className="h-8 w-8 animate-spin" />
				</div>
			)
		);
	}

	if (!isSignedIn) {
		return null;
	}

	return <>{children}</>;
}

interface AdminRouteProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export function AdminRoute({ children, fallback }: AdminRouteProps) {
	// Qui dovresti implementare la logica per verificare se l'utente è admin
	// Puoi usare il hook personalizzato o verificare i metadati dell'utente
	
	return (
		<ProtectedRoute fallback={fallback}>
			{children}
		</ProtectedRoute>
	);
}

interface SellerRouteProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export function SellerRoute({ children, fallback }: SellerRouteProps) {
	// Qui dovresti implementare la logica per verificare se l'utente è venditore
	
	return (
		<ProtectedRoute fallback={fallback}>
			{children}
		</ProtectedRoute>
	);
}
