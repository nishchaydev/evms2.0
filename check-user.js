const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
    try {
        const user = await prisma.user.findUnique({
            where: { username: 'superadmin' },
            include: { role: true }
        });
        console.log('Found user:', user);
    } catch (e) {
        console.error('Error checking user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkUser();
