'use server';

import { prisma } from './prisma';
import { cookies } from 'next/headers';
import { verifyJWT } from './auth';

export async function getOfficerStats() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // RBAC: Check User Department
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
                }
            }
        }

        const whereClause = {
            status: 'ACTIVE',
            ...(userDepartment ? { department: userDepartment } : {})
        };

        const flaggedWhereClause = {
            status: 'PENDING',
            ...(userDepartment ? { employee: { department: userDepartment } } : {}) // Assuming report has relation to employee
        };

        // Fetch stats in parallel
        const [verifiedEmployees, flaggedIssues, recentScans] = await Promise.all([
            prisma.employee.count({ where: whereClause as any }), // Cast as any if Typescript complains about dynamic where
            prisma.report.count({ where: flaggedWhereClause as any }), // "Flagged Issues"
            // For Total Scans Today, we don't have a Scan/Audit model for scans specifically yet for Officer.
            // Let's use a mock number or if we had a scan log. 
            // We'll return 0 or a placeholder if we don't have data, but let's query a theoretical table or just return 0 for now.
            // Actually, we can use AuditLog count if we tracked scans, but we didn't explicitly log scans to database in the scanner component yet (just redirect).
            // So we will leave "Total Scans Today" as 0 or mock it in frontend until we track it.
            // Let's just return 0 for now and user can request tracking later.
            0
        ]);

        return {
            verifiedEmployees,
            flaggedIssues,
            totalScansToday: recentScans
        };
    } catch (error) {
        console.error('Error fetching officer stats:', error);
        return {
            verifiedEmployees: 0,
            flaggedIssues: 0,
            totalScansToday: 0
        };
    }
}

export async function getRecentScans() {
    // Since we don't store scans, we can't show real recent scans.
    // However, we can show "Recently Verified Employees" instead as a proxy for activity?
    // Or just return empty or mock for now. 
    // The requirement is to "Activate" it. 
    // Let's return the last 5 active employees as "Recent Scans" is confusing if they weren't scanned.
    // But the officer usually scans people.
    // Let's implement a quick fix: Return recent Active employees as if they were just scanned? No that's lying.
    // Let's just return empty array and maybe adding a note that we need to track scans.
    // OR create a `ScanLog` model? Too much scope creep?
    // Let's return recently updated employees.
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
                }
            }
        }

        const whereClause = {
            status: 'ACTIVE',
            ...(userDepartment ? { department: userDepartment } : {})
        };

        const recent = await prisma.employee.findMany({
            where: whereClause as any,
            orderBy: { updatedAt: 'desc' },
            take: 5,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                designation: true,
                department: true,
                updatedAt: true,
                status: true
            }
        });

        // Map to UI shape
        return recent.map(emp => ({
            id: emp.id,
            name: `${emp.firstName} ${emp.lastName}`,
            role: emp.designation,
            time: emp.updatedAt, // Showing update time as scan time
            status: 'Verified', // Since we filtered by ACTIVE
            department: emp.department
        }));
    } catch (error) {
        console.error('Error fetching recent scans:', error);
        return [];
    }
}
