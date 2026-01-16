import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // Ensure it runs every time

export async function GET(request: Request) {
    try {
        // Optional: Add Authorization check here (e.g. CRON_SECRET)
        // const authHeader = request.headers.get('authorization');
        // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        //     return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        // }

        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Find Pending reports older than 24 hours
        const overdueReports = await prisma.report.updateMany({
            where: {
                status: 'PENDING',
                createdAt: {
                    lt: twentyFourHoursAgo
                },
                priority: {
                    not: 'CRITICAL'
                }
            },
            data: {
                priority: 'CRITICAL'
            }
        });

        console.log(`[CRON] Escalated ${overdueReports.count} reports.`);

        return NextResponse.json({
            success: true,
            escalatedCount: overdueReports.count,
            message: `Escalated ${overdueReports.count} overdue reports to CRITICAL.`
        });

    } catch (error) {
        console.error('Cron Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
