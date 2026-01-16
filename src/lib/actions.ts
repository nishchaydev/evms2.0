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
        return await prisma.employee.findMany({
            where: {
                OR: [
                    { firstName: { contains: query } }, // Case insensitive usually depends on DB collation (SQLite is sensitive by default unless configured)
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
                // Public fields only? Search usually returns basic info
            },
        });
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
