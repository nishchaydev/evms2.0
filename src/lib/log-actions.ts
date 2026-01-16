'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getScanLogs() {
    try {
        const logs = await prisma.scanLog.findMany({
            include: {
                scanner: {
                    select: { name: true, role: { select: { name: true } } }
                },
                employee: {
                    select: { firstName: true, lastName: true, employeeCode: true }
                }
            },
            orderBy: { scannedAt: 'desc' }
        });
        return logs;
    } catch (error) {
        console.error('Error fetching scan logs:', error);
        return [];
    }
}

export async function getSearchLogs() {
    try {
        const logs = await prisma.searchLog.findMany({
            include: {
                user: {
                    select: { name: true, role: { select: { name: true } } }
                }
            },
            orderBy: { timestamp: 'desc' }
        });
        return logs;
    } catch (error) {
        console.error('Error fetching search logs:', error);
        return [];
    }
}

export async function logScan(scannerId: string, employeeId: string, status: 'SUCCESS' | 'FAILED', details?: string) {
    try {
        await prisma.scanLog.create({
            data: {
                scannerId,
                employeeId,
                status,
                details
            }
        });
        revalidatePath('/super-admin/reports');
    } catch (error) {
        console.error("Failed to log scan:", error);
    }
}

export async function logSearch(userId: string, query: string, resultsCount: number) {
    try {
        await prisma.searchLog.create({
            data: {
                userId,
                query,
                resultsCount
            }
        });
        revalidatePath('/super-admin/reports');
    } catch (error) {
        console.error("Failed to log search:", error);
    }
}
