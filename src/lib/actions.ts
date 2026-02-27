'use server';

import { prisma } from '@/lib/prisma';
import { Employee, EmployeeStatus, Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import QRCode from 'qrcode';
import { signJWT } from '@/lib/auth'; // Using JWT logic for QR tokens too? Or separate? 
// Reuse helper but maybe different secret? For simplicity same secret.



export async function getEmployees() {
    try {
        return await prisma.employee.findMany({
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        return [];
    }
}

export async function searchEmployees(query: string) {
    if (!query) return [];
    try {
        const results = await prisma.employee.findMany({
            where: {
                OR: [
                    { firstName: { contains: query } },
                    { lastName: { contains: query } },
                    { designation: { contains: query } },
                ],
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                department: true,
                designation: true,
                photoUrl: true,
                status: true,
            },
        });

        // Audit Logging
        try {
            const { cookies } = await import('next/headers');
            const { verifyJWT } = await import('@/lib/auth');
            const { logSearch } = await import('@/lib/log-actions');

            const cookieStore = await cookies();
            const tokenCookie = cookieStore.get('token');
            if (tokenCookie) {
                const payload = await verifyJWT(tokenCookie.value);
                if (payload && payload.userId) {
                    await logSearch(payload.userId as string, query, results.length);
                }
            }
        } catch (logError) {
            console.error("Failed to write SearchLog", logError);
        }

        return results;
    } catch (error) {
        return [];
    }
}

export async function getEmployeeByToken(token: string) {
    try {
        const qrRecord = await prisma.employeeQR.findUnique({
            where: { token },
            include: { employee: true }
        });
        return qrRecord?.employee || null;
    } catch (error) {
        return null; // Return null on error
    }
}
