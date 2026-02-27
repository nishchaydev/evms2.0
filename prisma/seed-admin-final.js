
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'postgresql://postgres.vzguhpifucvhurxndozm:&7BxRH9mKAw*b.W@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres'
        }
    }
});

async function main() {
    console.log('Seeding admin user...');
    try {
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
        const hashedPassword = await bcrypt.hash('admin123', 10);

        await prisma.user.upsert({
            where: { username: 'admin' },
            update: { password: hashedPassword, roleId: adminRole.id },
            create: {
                username: 'admin',
                password: hashedPassword,
                name: 'System Administrator',
                roleId: adminRole.id,
                isActive: true,
            },
        });

        console.log('SUCCESS: Admin user created: admin / admin123');
    } catch (err) {
        console.error('SEED ERROR:', err);
    }
}

main().finally(() => prisma.$disconnect());
