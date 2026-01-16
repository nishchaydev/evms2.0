import EmployeeForm from './EmployeeForm';
import { createEmployee } from '@/lib/employee-actions';

export const metadata = {
    title: 'Add New Employee | Admin Portal',
    description: 'Register a new employee into the system.'
};

export const dynamic = 'force-dynamic';

export default function AddEmployeePage() {
    return <EmployeeForm onSubmit={createEmployee} />;
}
