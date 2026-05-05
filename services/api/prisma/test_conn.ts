import prisma from '../src/config/database';

async function main() {
  console.log('Testing connection...');
  try {
    const count = await prisma.user.count();
    console.log('User count:', count);
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

main().finally(() => prisma.$disconnect());
