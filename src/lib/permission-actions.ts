'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getAllPermissions() {
    try {
        return await prisma.permission.findMany();
    } catch (error) {
        console.error('Error fetching permissions:', error);
        return [];
    }
}

export async function getUserPermissions(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { permissions: true }
        });
        return user?.permissions || [];
    } catch (error) {
        console.error('Error fetching user permissions:', error);
        return [];
    }
}

export async function updateUserPermissions(userId: string, permissionIds: string[]) {
    try {
        // Disconnect all existing first (simplest way to handle toggle)
        // Ideally we would diff, but set is easier
        await prisma.user.update({
            where: { id: userId },
            data: {
                permissions: {
                    set: permissionIds.map(id => ({ id }))
                }
            }
        });
        revalidatePath('/super-admin');
        return { success: true };
    } catch (error) {
        console.error('Error updating user permissions:', error);
        return { success: false, error: 'Failed' };
    }
}
