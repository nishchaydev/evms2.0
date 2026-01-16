'use client';

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Chip,
    Button,
    Select,
    MenuItem,
    Box,
    Typography,
    IconButton,
    Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { toggleUserStatus, updateUserRole } from '@/lib/user-actions';
import { useTransition, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Checkbox, FormControlLabel, FormGroup, CircularProgress
} from '@mui/material';
import { getAllPermissions, getUserPermissions, updateUserPermissions } from '@/lib/permission-actions';

interface User {
    id: string;
    name: string;
    username: string;
    role: string;
    department?: string | null;
    isActive?: boolean | null;
}

export default function UserManagementTable({ users }: { users: User[] }) {
    const [isPending, startTransition] = useTransition();

    const handleRoleChange = (userId: string, newRole: string) => {
        startTransition(async () => {
            const res = await updateUserRole(userId, newRole);
            // Handle toast/alert if needed
        });
    };

    const handleStatusToggle = (userId: string, currentStatus: boolean) => {
        startTransition(async () => {
            const res = await toggleUserStatus(userId, currentStatus);
        });
    };

    const roles = ['SUPER_ADMIN', 'ADMIN', 'COMMISSIONER', 'HOD', 'MANAGER', 'OFFICER'];

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [allPermissions, setAllPermissions] = useState<any[]>([]);
    const [userPermissions, setUserPermissions] = useState<string[]>([]);
    const [loadingPerms, setLoadingPerms] = useState(false);

    const handleEditClick = async (userId: string) => {
        setSelectedUserId(userId);
        setEditDialogOpen(true);
        setLoadingPerms(true);

        // Fetch data
        const [all, userPerms] = await Promise.all([
            getAllPermissions(),
            getUserPermissions(userId)
        ]);

        setAllPermissions(all);
        setUserPermissions(userPerms.map((p: any) => p.id));
        setLoadingPerms(false);
    };

    const handlePermissionToggle = (permId: string) => {
        setUserPermissions(prev =>
            prev.includes(permId)
                ? prev.filter(id => id !== permId)
                : [...prev, permId]
        );
    };

    const handleSavePermissions = async () => {
        if (selectedUserId) {
            await updateUserPermissions(selectedUserId, userPermissions);
            setEditDialogOpen(false);
            // Optionally fetch users again or rely on revalidatePath
        }
    };

    return (
        <>
            <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>User</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Role</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Department</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ width: 32, height: 32, fontSize: 13, fontWeight: 'bold', bgcolor: 'primary.light', color: 'primary.main' }}>
                                                {user.name.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" fontWeight="bold">{user.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">@{user.username}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            size="small"
                                            value={roles.includes(user.role) ? user.role : ''}
                                            disabled={user.role === 'SUPER_ADMIN' || isPending}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            sx={{ minWidth: 120, height: 32, fontSize: 13, borderRadius: 1.5, bgcolor: 'background.paper' }}
                                        >
                                            <MenuItem value="ADMIN">Admin</MenuItem>
                                            <MenuItem value="COMMISSIONER">Commissioner</MenuItem>
                                            <MenuItem value="HOD">HOD</MenuItem>
                                            <MenuItem value="MANAGER">Manager</MenuItem>
                                            <MenuItem value="OFFICER">Officer</MenuItem>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        {user.department ? (
                                            <Typography variant="caption" sx={{ bgcolor: 'action.hover', px: 1, py: 0.5, borderRadius: 1, fontWeight: 'medium' }}>
                                                {user.department}
                                            </Typography>
                                        ) : (
                                            <Typography variant="caption" color="text.disabled">-</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.isActive ? "Active" : "Disabled"}
                                            size="small"
                                            color={user.isActive ? "success" : "default"}
                                            onClick={() => user.role !== 'SUPER_ADMIN' && handleStatusToggle(user.id, user.isActive || false)}
                                            sx={{ borderRadius: 1.5, height: 24, fontSize: 12, fontWeight: 600, cursor: user.role === 'SUPER_ADMIN' ? 'default' : 'pointer' }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" disabled={user.role === 'SUPER_ADMIN'} onClick={() => handleEditClick(user.id)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {users.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <Typography color="text.secondary" py={4}>No users found. Create one above.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Edit Permissions Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit User Permissions</DialogTitle>
                <DialogContent dividers>
                    {loadingPerms ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>
                    ) : (
                        <FormGroup>
                            {allPermissions.map((perm) => (
                                <FormControlLabel
                                    key={perm.id}
                                    control={
                                        <Checkbox
                                            checked={userPermissions.includes(perm.id)}
                                            onChange={() => handlePermissionToggle(perm.id)}
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body2" fontWeight="bold">{perm.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{perm.description}</Typography>
                                        </Box>
                                    }
                                />
                            ))}
                        </FormGroup>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSavePermissions} variant="contained" disabled={loadingPerms}>Save Changes</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

