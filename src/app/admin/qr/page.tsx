import { getQRData } from '@/lib/qr-actions';
import QRGrid from './QRGrid';

export const dynamic = 'force-dynamic';

export default async function QRManagementPage() {
    const employees = await getQRData();
    // Serialize if needed (Prisma dates)
    const serialized = JSON.parse(JSON.stringify(employees));

    return <QRGrid initialEmployees={serialized} />;
}
