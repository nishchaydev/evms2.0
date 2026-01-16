'use server';

import { prisma } from './prisma';

export async function getDashboardStats() {
    try {
        const [totalEmployees, activeEmployees, pendingReports] = await Promise.all([
            prisma.employee.count(),
            prisma.employee.count({ where: { status: 'ACTIVE' } }),
            prisma.report.count({ where: { status: 'PENDING' } })
        ]);

        // "QR Generated" - we don't have a separate table for this, but every employee has a QR token.
        // So we can assume total employees = total QRs generated for now, or track separately if needed.
        // Let's use total employees count as "QR Generated" proxy or if we had a specific "qrPrinted" flag.
        // For now, let's just use total employees count.
        const qrGenerated = totalEmployees;

        return {
            totalEmployees,
            activeEmployees,
            qrGenerated,
            pendingReports,
            barChartData: await getEmployeesByDepartment(),
            pieChartData: await getReportsByStatus()
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
            totalEmployees: 0,
            activeEmployees: 0,
            qrGenerated: 0,
            pendingReports: 0,
            barChartData: [],
            pieChartData: []
        };
    }
}

async function getEmployeesByDepartment() {
    try {
        const data = await prisma.employee.groupBy({
            by: ['department'],
            _count: { id: true }
        });
        return data.map(d => ({ name: d.department, value: d._count.id }));
    } catch { return []; }
}

async function getReportsByStatus() {
    try {
        const data = await prisma.report.groupBy({
            by: ['status'],
            _count: { id: true }
        });
        return data.map(d => ({ name: d.status, value: d._count.id }));
    } catch { return []; }
}

export async function getRecentActivity() {
    try {
        const logs = await prisma.auditLog.findMany({
            take: 10,
            orderBy: { timestamp: 'desc' },
            include: {
                user: {
                    select: { name: true, role: { select: { name: true } } }
                }
            }
        });

        return logs.map(log => ({
            id: log.id,
            type: log.action.replace(/_/g, ' '), // CREATE_USER -> CREATE USER
            name: log.user?.name || 'System',
            desc: log.details || 'No details',
            status: 'COMPLETED', // Audit logs are always past actions
            time: log.timestamp,
            color: 'info' // Default color
        }));
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        return [];
    }
}
