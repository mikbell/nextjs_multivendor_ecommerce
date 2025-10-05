const { PrismaClient } = require('@prisma/client');
const { clerkClient } = require('@clerk/nextjs/server');
require('dotenv').config();

const prisma = new PrismaClient();

async function syncClerkUsers() {
  try {
    console.log('🔄 Starting Clerk users synchronization...');
    
    // Verifica connessione database
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // Ottieni tutti gli utenti da Clerk
    const clerk = await clerkClient();
    const clerkUsers = await clerk.users.getUserList();
    
    console.log(`📋 Found ${clerkUsers.data.length} users in Clerk`);
    
    if (clerkUsers.data.length === 0) {
      console.log('⚠️  No users found in Clerk');
      return;
    }
    
    // Sincronizza ogni utente
    for (const clerkUser of clerkUsers.data) {
      try {
        const userId = clerkUser.id;
        const userName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Unknown User';
        const userEmail = clerkUser.emailAddresses?.[0]?.emailAddress;
        const userPicture = clerkUser.imageUrl || '';
        
        if (!userEmail) {
          console.log(`⚠️  Skipping user ${userId} - no email found`);
          continue;
        }
        
        // Upsert user nel database
        const dbUser = await prisma.user.upsert({
          where: { email: userEmail },
          update: {
            name: userName,
            email: userEmail,
            picture: userPicture,
            updatedAt: new Date(),
          },
          create: {
            id: userId,
            name: userName,
            email: userEmail,
            picture: userPicture,
            role: 'ADMIN', // Impostiamo come ADMIN per permettere l'accesso alla dashboard
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        
        // Aggiorna i metadati in Clerk con il ruolo
        await clerk.users.updateUserMetadata(userId, {
          privateMetadata: {
            role: dbUser.role,
          },
        });
        
        console.log(`✅ Synced user: ${userEmail} (${dbUser.role})`);
        
      } catch (error) {
        console.error(`❌ Error syncing user ${clerkUser.id}:`, error.message);
      }
    }
    
    // Verifica finale
    const finalUserCount = await prisma.user.count();
    console.log(`🎉 Synchronization complete! Total users in database: ${finalUserCount}`);
    
  } catch (error) {
    console.error('❌ Error during synchronization:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Esegui la sincronizzazione
syncClerkUsers();