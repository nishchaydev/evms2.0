'use server';

import { prisma } from './prisma';

export async function searchEmployees(query: string, department?: string, role?: string) {
    try {
        if (!query && !department && !role) return [];

        const employees = await prisma.employee.findMany({
            where: {
                AND: [
                    { status: 'ACTIVE' },
                    // Smart Search: Each term must match at least one field
                    ...(query ? query.trim().split(/\s+/).map(term => ({
                        OR: [
                            { firstName: { contains: term, mode: 'insensitive' as const } },
                            { lastName: { contains: term, mode: 'insensitive' as const } },
                            { employeeCode: { contains: term, mode: 'insensitive' as const } },
                            { department: { contains: term, mode: 'insensitive' as const } },
                            { designation: { contains: term, mode: 'insensitive' as const } },
                        ]
                    })) : []),
                    department ? { department: { contains: department, mode: 'insensitive' as const } } : {},
                    role ? { designation: { contains: role, mode: 'insensitive' as const } } : {}
                ]
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                employeeCode: true,
                department: true,
                designation: true,
                photoUrl: true,
                status: true,
                joiningDate: true,
                qr: { select: { token: true } }
            }
        });
        return employees;
    } catch (error) {
        console.error('Search Error:', error);
        return [];
    }
}
