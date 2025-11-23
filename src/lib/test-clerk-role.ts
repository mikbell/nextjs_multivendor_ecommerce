/**
 * Script di test per verificare il sistema di ruoli Clerk
 *
 * Questo file contiene funzioni di utilità per testare
 * che i ruoli vengano impostati correttamente in Clerk
 */

import { setUserRole, getUserRole } from "./clerk-utils";

/**
 * Test completo del sistema di ruoli
 * @param userId - L'ID utente Clerk da testare
 */
export async function testUserRoleSystem(userId: string) {
	console.log("🧪 Inizio test sistema ruoli Clerk");
	console.log(`📋 Testing user: ${userId}`);

	// Test 1: Verifica ruolo corrente
	console.log("\n1️⃣ Verifica ruolo corrente...");
	const currentRole = await getUserRole(userId);
	console.log(`   Ruolo attuale: ${currentRole || "NESSUNO"}`);

	// Test 2: Imposta ruolo USER
	console.log("\n2️⃣ Imposta ruolo USER...");
	const setUserResult = await setUserRole(userId, "USER");
	if (setUserResult.success) {
		console.log("   ✅ Ruolo USER impostato con successo");
		const verifyUser = await getUserRole(userId);
		console.log(`   Verifica: ${verifyUser}`);
	} else {
		console.log("   ❌ Errore nell'impostazione del ruolo USER");
	}

	// Test 3: Aggiorna a SELLER
	console.log("\n3️⃣ Aggiorna a SELLER...");
	const setSellerResult = await setUserRole(userId, "SELLER");
	if (setSellerResult.success) {
		console.log("   ✅ Ruolo SELLER impostato con successo");
		const verifySeller = await getUserRole(userId);
		console.log(`   Verifica: ${verifySeller}`);
	} else {
		console.log("   ❌ Errore nell'impostazione del ruolo SELLER");
	}

	// Test 4: Ripristina a USER
	console.log("\n4️⃣ Ripristina a USER...");
	const restoreResult = await setUserRole(userId, "USER");
	if (restoreResult.success) {
		console.log("   ✅ Ruolo USER ripristinato");
		const verifyRestore = await getUserRole(userId);
		console.log(`   Verifica finale: ${verifyRestore}`);
	} else {
		console.log("   ❌ Errore nel ripristino del ruolo USER");
	}

	console.log("\n✅ Test completato!");

	return {
		passed: setUserResult.success && setSellerResult.success && restoreResult.success,
		finalRole: await getUserRole(userId),
	};
}

/**
 * Verifica rapida del ruolo di un utente
 * @param userId - L'ID utente Clerk
 */
export async function quickRoleCheck(userId: string) {
	const role = await getUserRole(userId);
	console.log(`User ${userId} has role: ${role || "NONE"}`);
	return role;
}

/**
 * Esempio di utilizzo:
 *
 * import { testUserRoleSystem, quickRoleCheck } from '@/lib/test-clerk-role';
 *
 * // Verifica rapida
 * await quickRoleCheck('user_xxxxxxxxxxxxx');
 *
 * // Test completo
 * await testUserRoleSystem('user_xxxxxxxxxxxxx');
 */
