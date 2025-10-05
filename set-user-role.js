require('dotenv').config();
const { createClerkClient } = require('@clerk/clerk-sdk-node');

// Inizializza Clerk Client
const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});

async function setUserRole() {
  try {
    console.log('🔄 Recupero lista utenti...');
    
    // Recupera tutti gli utenti
    const users = await clerk.users.getUserList();
    
    // L'API restituisce direttamente un array di utenti
    const userList = Array.isArray(users) ? users : users.data || [];
    
    console.log(`📊 Risposta API: ${userList.length} utenti trovati`);
    
    if (userList.length === 0) {
      console.log('❌ Nessun utente trovato');
      return;
    }
    
    console.log(`\n📋 Utenti registrati:`);
    userList.forEach((user, index) => {
      console.log(`${index + 1}. ${user.emailAddresses[0]?.emailAddress} - ID: ${user.id}`);
      console.log(`   Ruolo attuale: ${user.privateMetadata?.role || 'NON IMPOSTATO'}`);
    });
    
    console.log('\n✅ Tutti gli utenti hanno già ruoli assegnati!');
    
    // Se c'è solo un utente, imposta automaticamente il ruolo ADMIN
    if (userList.length === 1) {
      const user = userList[0];
      console.log(`\n🔧 Impostando ruolo ADMIN per ${user.emailAddresses[0]?.emailAddress}...`);
      
      await clerk.users.updateUser(user.id, {
        privateMetadata: {
          ...user.privateMetadata,
          role: 'ADMIN'
        }
      });
      
      console.log('✅ Ruolo ADMIN impostato con successo!');
      
      // Verifica l'aggiornamento
      const updatedUser = await clerk.users.getUser(user.id);
      console.log(`✓ Verifica: Ruolo attuale = ${updatedUser.privateMetadata?.role}`);
      
    } else {
      console.log(`\n📝 Per impostare un ruolo, modifica questo script e specifica l'ID utente.`);
      console.log('Esempio per impostare ADMIN:');
      console.log(`await clerk.users.updateUser('USER_ID_QUI', {
        privateMetadata: { role: 'ADMIN' }
      });`);
    }
    
  } catch (error) {
    console.error('❌ Errore:', error.message);
    
    if (error.status === 401) {
      console.log('\n💡 Suggerimento: Controlla che CLERK_SECRET_KEY sia impostato correttamente in .env');
    }
  }
}

// Funzione per impostare un ruolo specifico a un utente specifico
async function setSpecificUserRole(userId, role) {
  try {
    console.log(`🔧 Impostando ruolo ${role} per utente ${userId}...`);
    
    await clerk.users.updateUser(userId, {
      privateMetadata: { role }
    });
    
    console.log(`✅ Ruolo ${role} impostato con successo!`);
    
    // Verifica
    const user = await clerk.users.getUser(userId);
    console.log(`✓ Verifica: ${user.emailAddresses[0]?.emailAddress} - Ruolo: ${user.privateMetadata?.role}`);
    
  } catch (error) {
    console.error('❌ Errore:', error.message);
  }
}

// Se vengono passati parametri da linea di comando
const args = process.argv.slice(2);
if (args.length >= 2) {
  const [userId, role] = args;
  if (['ADMIN', 'SELLER', 'USER'].includes(role.toUpperCase())) {
    setSpecificUserRole(userId, role.toUpperCase());
  } else {
    console.log('❌ Ruolo non valido. Usa: ADMIN, SELLER, o USER');
  }
} else {
  setUserRole();
}

console.log('\n📖 Uso dello script:');
console.log('- Lista utenti: node set-user-role.js');
console.log('- Imposta ruolo: node set-user-role.js USER_ID ADMIN');
console.log('- Ruoli disponibili: ADMIN, SELLER, USER');