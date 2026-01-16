import { getReports } from '@/lib/report-actions';
import ReportsGrid from './ReportsGrid';

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
    const reports = await getReports();
    const serializedReports = JSON.parse(JSON.stringify(reports));

    return <ReportsGrid initialReports={serializedReports} />;
}
