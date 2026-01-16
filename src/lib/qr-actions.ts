'use server';

import { prisma } from './prisma';

export async function getQRData() {
    try {
        const employees = await prisma.employee.findMany({
            where: { status: 'ACTIVE' },
            select: {
                id: true,
                employeeCode: true,
                firstName: true,
                lastName: true,
                department: true,
                designation: true,
                photoUrl: true,
                qr: {
                    select: { token: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Flatten token
        return employees.map(e => ({
            ...e,
            qrToken: e.qr?.token || 'PENDING'
        }));
    } catch (error) {
        console.error('Error fetching QR data:', error);
        return [];
    }
}
