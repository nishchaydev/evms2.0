'use server';

import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';

// Fetch all reports
import { getSession } from './auth-actions';

// Fetch reports with RBAC
export async function getReports() {
    try {
        const session = await getSession();
        if (!session || !session.userId) return [];

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { role: { select: { name: true } }, department: true }
        });

        if (!user) return [];

        let whereClause: any = {};

        // RBAC: If not SUPER_ADMIN, restrict by Department
        if (user.role.name !== 'SUPER_ADMIN') {
            if (!user.department) return []; // Security: No dept = No access
            whereClause = {
                OR: [
                    { employee: { department: user.department } },
                    { department: user.department }
                ]
            };
        }

        const reports = await prisma.report.findMany({
            where: whereClause,
            include: {
                employee: {
                    select: {
                        firstName: true,
                        lastName: true,
                        department: true,
                    }
                },
                images: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return reports;
    } catch (error) {
        console.error('Error fetching reports:', error);
        return [];
    }
}

// Fetch single report by ID
export async function getReportById(id: string) {
    try {
        const report = await prisma.report.findUnique({
            where: { id },
            include: {
                employee: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                },
                images: true
            }
        });
        return report;
    } catch (error) {
        console.error('Error fetching report:', error);
        return null;
    }
}

// Update report status
export async function updateReportStatus(id: string, status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED') {
    try {
        await prisma.report.update({
            where: { id },
            data: { status }
        });
        revalidatePath('/super-admin/reports');
        revalidatePath(`/public/report/${id}`);
        return { success: true };
    } catch (error) {
        console.error('Error updating report status:', error);
        return { success: false, error: 'Failed to update status' };
    }
}

import { writeFile } from 'fs/promises';
import { join } from 'path';

import { ReportSchema } from './validations';

// Create a new report
export async function createReport(formData: FormData) {
    try {
        const rawData = {
            description: formData.get('description') as string,
            category: formData.get('category') as string,
            location: formData.get('location') as string,
            employeeId: formData.get('employeeId') as string,
            department: formData.get('department') as string,
        };

        // Zod Validation
        const validationResult = ReportSchema.safeParse({
            ...rawData,
            department: rawData.department || null,
            employeeId: rawData.employeeId || null
        });

        if (!validationResult.success) {
            return { success: false, error: validationResult.error.issues[0].message };
        }

        const { description, category, location, employeeId } = rawData;
        const photo = formData.get('photo') as File | null;

        let imagePath = null;

        if (photo && photo.size > 0) {
            try {
                const buffer = Buffer.from(await photo.arrayBuffer());
                // Sanitize filename
                const safeName = photo.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
                const filename = `${Date.now()}-${safeName}`;
                const uploadDir = join(process.cwd(), 'public', 'uploads');

                // Ensure directory exists (redundant if mkdir run, but safe)
                // await mkdir(uploadDir, { recursive: true }); 

                await writeFile(join(uploadDir, filename), buffer);
                imagePath = `/uploads/${filename}`;
            } catch (fileError) {
                console.error('File upload failed:', fileError);
                // Continue report creation without image? Or fail? 
                // Let's continue but log it.
            }
        }

        // Intelligent Auto-Triage Logic
        let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';
        const textToAnalyze = (description + ' ' + category).toLowerCase();

        if (textToAnalyze.match(/fire|accident|danger|urgent|spark|collapse|life/)) {
            priority = 'CRITICAL';
        } else if (textToAnalyze.match(/water|electricity|broken|block|garbage|sewage/)) {
            priority = 'HIGH';
        } else if (textToAnalyze.match(/pothole|street|light|park/)) {
            priority = 'MEDIUM';
        }

        const report = await prisma.report.create({
            data: {
                description,
                category,
                location,
                employeeId: employeeId || null,
                department: employeeId ? null : (formData.get('department') as string || null),
                status: 'PENDING',
                priority, // Auto-assigned priority
                images: imagePath ? {
                    create: {
                        url: imagePath
                    }
                } : undefined
            }
        });

        revalidatePath('/super-admin/reports');
        revalidatePath('/admin/reports');
        return { success: true, reportId: report.id };
    } catch (error) {
        console.error('Error creating report:', error);
        return { success: false, error: 'Failed to create report' };
    }

}

// Analytics Aggregation for Charts
export async function getDashboardAnalytics() {
    try {
        // 1. Reports by Status (Pie Chart)
        const statusData = await prisma.report.groupBy({
            by: ['status'],
            _count: {
                status: true
            }
        });

        // 2. Reports by Department (Bar Chart)
        const deptData = await prisma.report.groupBy({
            by: ['department'],
            _count: {
                department: true
            }
        });

        // 3. Reports by Priority (Donut/Bar)
        const priorityData = await prisma.report.groupBy({
            by: ['priority'],
            _count: {
                priority: true
            }
        });

        return {
            statusCounts: statusData.map(item => ({ name: item.status, value: item._count.status })),
            deptCounts: deptData.map(item => ({ name: item.department || 'General', value: item._count.department })),
            priorityCounts: priorityData.map(item => ({ name: item.priority, value: item._count.priority }))
        };

    } catch (error) {
        console.error('Analytics Error:', error);
        return {
            statusCounts: [],
            deptCounts: [],
            priorityCounts: []
        };
    }
}

// Check for duplicates
export async function checkDuplicateReports(category: string, lat: number, lng: number) {
    try {
        // 1. Fetch active reports of same category
        const activeReports = await prisma.report.findMany({
            where: {
                category,
                status: { not: 'RESOLVED' },
                location: { not: null }
            },
            select: { id: true, location: true, description: true, createdAt: true }
        });

        // 2. Filter by distance (Haversine Formula) - 50 meters
        const DUPLICATE_RADIUS_METERS = 50;

        const duplicates = activeReports.filter(report => {
            if (!report.location) return false;
            const parts = report.location.split(',');
            if (parts.length < 2) return false;

            const rLat = parseFloat(parts[0].trim());
            const rLng = parseFloat(parts[1].trim());

            if (isNaN(rLat) || isNaN(rLng)) return false;

            const R = 6371e3; // Earth radius in meters
            const φ1 = lat * Math.PI / 180; // φ, λ in radians
            const φ2 = rLat * Math.PI / 180;
            const Δφ = (rLat - lat) * Math.PI / 180;
            const Δλ = (rLng - lng) * Math.PI / 180;

            const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const d = R * c;

            return d < DUPLICATE_RADIUS_METERS;
        });

        return duplicates;

    } catch (error) {
        console.error('Duplicate Check Error:', error);
        return [];
    }
}
