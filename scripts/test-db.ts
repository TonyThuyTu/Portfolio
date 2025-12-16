import prisma from '../lib/prisma';

async function main() {
  
  try {

    await prisma.$queryRaw`SELECT 1`;

    console.log('Database connected successfully!');
    
  } catch (error) {
    
    console.error('Database connected failed:', error);

  } finally {

    await prisma.$disconnect();

  }

}

main();

