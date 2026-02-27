
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding administrative user...');

    // 1. Ensure Roles exist
    const roles = [
        { name: 'SUPER_ADMIN', description: 'Full system access' },
        { name: 'ADMIN', description: 'Administrative access' },
        { name: 'OFFICER', description: 'Basic operational access' }
    ];

    for (const roleData of roles) {
        await prisma.role.upsert({
            where: { name: roleData.name },
            update: {},
            create: roleData,
        });
    }

    const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });

    if (!adminRole) {
        throw new Error('Failed to create/find ADMIN role');
    }

    // 2. Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {
            password: hashedPassword,
            roleId: adminRole.id,
            isActive: true
        },
        create: {
            username: 'admin',
            password: hashedPassword,
            name: 'System Administrator',
            roleId: adminRole.id,
            isActive: true,
        },
    });

    console.log(`Admin user created/updated: ${adminUser.username}`);
    console.log('Credentials: admin / admin123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
