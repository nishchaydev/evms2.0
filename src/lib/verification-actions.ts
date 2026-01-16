'use server';

import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { verifyJWT } from './auth';

export async function getPendingEmployees() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        let userDepartment: string | null = null;
        let userRole: string | null = null;

        if (token) {
            const payload = await verifyJWT(token);
            if (payload) {
                userRole = payload.role as string;
                if (userRole !== 'SUPER_ADMIN') {
                    userDepartment = payload.department as string;
                    if (!userDepartment) return []; // Access Denied
                }
            }
        }

        const whereClause = {
            status: 'PENDING',
            ...(userDepartment ? { department: userDepartment } : {})
        };

        const pendingEmployees = await prisma.employee.findMany({
            where: whereClause as any,
            orderBy: { createdAt: 'desc' }
        });
        return pendingEmployees;
    } catch (error) {
        console.error('Error fetching pending employees:', error);
        return [];
    }
}

export async function getVerifiedEmployees() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        let userDepartment: string | null = null;
        let userRole: string | null = null;

        if (token) {
            const payload = await verifyJWT(token);
            if (payload) {
                userRole = payload.role as string;
                if (userRole !== 'SUPER_ADMIN') {
                    userDepartment = payload.department as string;
                    if (!userDepartment) return { verified: 0, pending: 0, rejected: 0 };
                }
            }
        }

        const baseWhere = userDepartment ? { department: userDepartment } : {};

        const verified = await prisma.employee.count({ where: { ...baseWhere, status: 'ACTIVE' } });
        const pending = await prisma.employee.count({ where: { ...baseWhere, status: 'PENDING' } });
        const rejected = await prisma.employee.count({ where: { ...baseWhere, status: 'SUSPENDED' } });

        return { verified, pending, rejected };
    } catch (error) {
        console.error('Error fetching verification stats:', error);
        return { verified: 0, pending: 0, rejected: 0 };
    }
}

export async function approveEmployee(id: string) {
    try {
        await prisma.employee.update({
            where: { id },
            data: { status: 'ACTIVE' }
        });
        revalidatePath('/super-admin/verifications');
        revalidatePath('/admin/verifications');
        return { success: true };
    } catch (error) {
        console.error('Error approving employee:', error);
        return { success: false, message: 'Failed to approve employee.' };
    }
}

export async function rejectEmployee(id: string) {
    try {
        // Option 1: Delete
        // await prisma.employee.delete({ where: { id } });
        // Option 2: Mark SUSPENDED or REJECTED (if enum added)
        // Let's use SUSPENDED as "Rejected" for now to keep record or delete.
        // If we want to clean up, delete is better for "New Request" rejection.
        // Let's Delete for now as it's a "Request".
        await prisma.employee.delete({ where: { id } });

        revalidatePath('/super-admin/verifications');
        revalidatePath('/admin/verifications');
        return { success: true };
    } catch (error) {
        console.error('Error rejecting employee:', error);
        return { success: false, message: 'Failed to reject employee.' };
    }
}
