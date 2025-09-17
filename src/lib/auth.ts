import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { User } from "@/generated/prisma";

/**
 * Ottiene l'utente corrente da Clerk e lo sincronizza con il database
 */
export async function getCurrentUser(): Promise<User | null> {
	try {
		const { userId } = await auth();
		
		if (!userId) {
			return null;
		}

		// Controlla se l'utente esiste nel database
		let dbUser = await prisma.user.findUnique({
			where: { id: userId },
		});

		// Se l'utente non esiste nel DB, sincronizzalo da Clerk
		if (!dbUser) {
			const clerkUser = await currentUser();
			
			if (clerkUser) {
				dbUser = await prisma.user.create({
					data: {
						id: clerkUser.id,
						email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
						firstName: clerkUser.firstName || "",
						lastName: clerkUser.lastName || "",
						picture: clerkUser.imageUrl || "",
						phone: clerkUser.phoneNumbers?.[0]?.phoneNumber || null,
					},
				});
			}
		}

		return dbUser;
	} catch (error) {
		console.error("Errore ottenendo l'utente corrente:", error);
		return null;
	}
}

/**
 * Verifica se l'utente corrente è un admin
 */
export async function isAdmin(): Promise<boolean> {
	const user = await getCurrentUser();
	return user?.role === "ADMIN";
}

/**
 * Verifica se l'utente corrente è un venditore
 */
export async function isSeller(): Promise<boolean> {
	const user = await getCurrentUser();
	return user?.role === "SELLER" || user?.role === "ADMIN";
}

/**
 * Ottiene solo l'ID dell'utente corrente
 */
export async function getCurrentUserId(): Promise<string | null> {
	const { userId } = await auth();
	return userId;
}
