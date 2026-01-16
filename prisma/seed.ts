import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await hash('admin123', 12)

    // 1. Create Permissions
    const perms = ['VIEW_EMPLOYEE', 'ADD_EMPLOYEE', 'EDIT_EMPLOYEE', 'DELETE_EMPLOYEE', 'MANAGE_USERS', 'VIEW_REPORTS', 'RESOLVE_REPORTS'];
    for (const p of perms) {
        await prisma.permission.upsert({
            where: { name: p },
            update: {},
            create: { name: p, description: `Permission to ${p.toLowerCase().replace('_', ' ')}` }
        });
    }

    // 2. Create Roles
    const superAdminRole = await prisma.role.upsert({
        where: { name: 'SUPER_ADMIN' },
        update: {},
        create: {
            name: 'SUPER_ADMIN',
            description: 'Full System Access',
            permissions: { connect: perms.map(p => ({ name: p })) }
        }
    });

    const adminRole = await prisma.role.upsert({
        where: { name: 'ADMIN' },
        update: {},
        create: {
            name: 'ADMIN',
            description: 'Department Administrator',
            permissions: { connect: [{ name: 'VIEW_EMPLOYEE' }, { name: 'ADD_EMPLOYEE' }, { name: 'EDIT_EMPLOYEE' }, { name: 'VIEW_REPORTS' }] }
        }
    });

    const officerRole = await prisma.role.upsert({
        where: { name: 'OFFICER' },
        update: {},
        create: {
            name: 'OFFICER',
            description: 'Field Officer',
            permissions: { connect: [{ name: 'VIEW_EMPLOYEE' }] }
        }
    });

    // 3. Create Super Admin User
    const superAdmin = await prisma.user.upsert({
        where: { username: 'superadmin' },
        update: {},
        create: {
            username: 'superadmin',
            name: 'Super Admin',
            password,
            roleId: superAdminRole.id,
            isActive: true
        },
    })
    console.log({ superAdmin })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
