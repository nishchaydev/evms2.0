'use server';

import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { logAudit } from './audit-actions';

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                role: {
                    include: { permissions: true }
                }
            }
        });

        // Flatten for UI
        return users.map(u => ({
            id: u.id,
            name: u.name,
            username: u.username,
            role: u.role.name,
            isActive: u.isActive,
            permissions: u.role.permissions.map(p => p.name),
            department: u.department,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt
        }));
    } catch (error) {
        console.error('Get Users Error:', error);
        return [];
    }
}

export async function createUser(formData: FormData) {
    const name = formData.get('name') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const roleName = formData.get('role') as string;
    const department = formData.get('department') as string | null;

    try {
        const hashedPassword = await hash(password, 10);

        const role = await prisma.role.findUnique({ where: { name: roleName } });
        if (!role) throw new Error('Invalid Role');

        await prisma.user.create({
            data: {
                name,
                username,
                password: hashedPassword,
                roleId: role.id,
                department,
                isActive: true
            }
        });

        revalidatePath('/super-admin');
        await logAudit('CREATE_USER', `Created user ${name} (${username}) with role ${roleName}`);
        return { success: true };
    } catch (error) {
        console.error("Create User Error:", error);
        return { success: false, error: 'Failed to create user' };
    }
}

export async function toggleUserStatus(userId: string, currentStatus: boolean) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { isActive: !currentStatus }
        });
        revalidatePath('/super-admin');
        await logAudit('UPDATE_USER_STATUS', `Changed status of user ${userId} to ${!currentStatus ? 'Active' : 'Inactive'}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update status' };
    }
}

export async function updateUserRole(userId: string, newRoleName: string) {
    try {
        const role = await prisma.role.findUnique({ where: { name: newRoleName } });
        if (!role) throw new Error('Invalid Role');

        await prisma.user.update({
            where: { id: userId },
            data: { roleId: role.id }
        });
        revalidatePath('/super-admin');
        await logAudit('UPDATE_USER_ROLE', `Updated role of user ${userId} to ${newRoleName}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update role' };
    }
}
