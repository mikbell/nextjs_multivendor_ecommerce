const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('Checking database connection...');
    
    // Verifica connessione
    await prisma.$connect();
    console.log('✓ Database connected');
    
    // Conta utenti
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in database`);
    
    // Mostra tutti gli utenti
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    if (users.length > 0) {
      console.log('\nUsers in database:');
      users.forEach(user => {
        console.log(`- ${user.email} (${user.role}) - Created: ${user.createdAt}`);
      });
    } else {
      console.log('\nNo users found in database');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();