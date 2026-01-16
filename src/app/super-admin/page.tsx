import {
    Box,
    Typography,
    Alert
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

// Server Action
import { getUsers } from '@/lib/user-actions';
import UserManagementTable from './components/UserManagementTable';
import AddUserButton from './components/AddUserButton';

export const dynamic = 'force-dynamic'; // Ensure real-time data

export default async function SuperAdminDashboard() {
    const users = await getUsers();

    return (
        <Box sx={{ maxWidth: 'lg', mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>

            {/* Header */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'start' }, gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>Manage Users & Roles</Typography>
                    <Typography variant="body1" color="text.secondary">Oversee system access for admins and officers.</Typography>
                </Box>
                <AddUserButton />
            </Box>

            {/* Interactive User Table */}
            <UserManagementTable users={users} />

            {/* Security Note */}
            <Alert severity="warning" icon={<LockIcon fontSize="inherit" />} sx={{ borderRadius: 2, bgcolor: 'warning.light', color: 'warning.dark' }}>
                <Typography variant="subtitle2" fontWeight="bold">Secure System Warning</Typography>
                <Typography variant="caption">Unauthorized access or modification of user roles is a punishable offense. All actions on this page are logged.</Typography>
            </Alert>

        </Box>
    );
}
