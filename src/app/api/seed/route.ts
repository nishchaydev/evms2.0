import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (secret !== 'initial-setup') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Check if Super Admin exists
        const existingAdmin = await prisma.user.findFirst({
            where: { username: 'superadmin' },
        });

        if (existingAdmin) {
            return NextResponse.json({ message: 'Super Admin already exists' });
        }

        // Find Role
        const superAdminRole = await prisma.role.findUnique({
            where: { name: 'SUPER_ADMIN' }
        });

        if (!superAdminRole) {
            return NextResponse.json({ error: 'SUPER_ADMIN role not found. Please run seed script.' }, { status: 500 });
        }

        // Create Super Admin
        const hashedPassword = await hashPassword('admin123'); // Default password
        const admin = await prisma.user.create({
            data: {
                username: 'superadmin',
                password: hashedPassword,
                name: 'System Super Admin',
                roleId: superAdminRole.id,
                isActive: true
            },
        });

        return NextResponse.json({ message: 'Super Admin created successfully', adminId: admin.id });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
