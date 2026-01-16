import { getEmployees } from '@/lib/employee-actions';
import EmployeeList from '@/app/admin/employees/EmployeeList';

export const dynamic = 'force-dynamic';

export default async function SuperAdminEmployeesPage() {
    // Super Admin sees ALL employees (RBAC handled in getEmployees)
    const { data: employees, meta } = await getEmployees(1, 10);

    const serializedEmployees = JSON.parse(JSON.stringify(employees));

    return (
        <EmployeeList
            initialEmployees={serializedEmployees}
            initialMeta={meta}
        />
    );
}
