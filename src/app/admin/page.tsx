import { getDashboardStats, getRecentActivity } from '@/lib/dashboard-actions';
import { getReports, getDashboardAnalytics } from '@/lib/report-actions';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    const stats = await getDashboardStats();
    let activities = await getRecentActivity();
    const reports = await getReports(); // Fetch reports for Map
    const analytics = await getDashboardAnalytics();

    // Safety: ensure activities is array
    if (!Array.isArray(activities)) activities = [];

    const serializedActivities = JSON.parse(JSON.stringify(activities));
    const serializedReports = JSON.parse(JSON.stringify(reports));

    return <DashboardClient initialStats={stats} initialActivities={serializedActivities} initialReports={serializedReports} initialAnalytics={analytics} />;
}
