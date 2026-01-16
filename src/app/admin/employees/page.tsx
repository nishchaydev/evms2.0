import Link from 'next/link';
import { getEmployees } from '@/lib/employee-actions';
import EmployeeList from './EmployeeList';

export const dynamic = 'force-dynamic';

export default async function EmployeesPage() {
    const { data: employees, meta } = await getEmployees(1, 10); // Initial fetch, page 1, 10 items

    // Serialize
    const serializedEmployees = JSON.parse(JSON.stringify(employees));

    return <EmployeeList initialEmployees={serializedEmployees} initialMeta={meta} />;
}
