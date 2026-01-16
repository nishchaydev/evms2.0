const { PrismaClient } = require('@prisma/client');

async function main() {
    console.log('Starting Prisma test...');
    try {
        const prisma = new PrismaClient(); // No args
        console.log('Instance created.');
        const users = await prisma.user.findMany();
        console.log('Users:', users);
    } catch (e) {
        console.error('Error:', e);
    }
}

main();
