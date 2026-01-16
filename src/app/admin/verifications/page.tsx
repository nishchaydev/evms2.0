'use client';

import {
    Box,
    Typography,
    Paper,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Tabs,
    Tab,
    Avatar,
    Tooltip
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState, useEffect } from 'react';

export default function AdminVerificationsPage() {
    const [pendingEmployees, setPendingEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ verified: 0, pending: 0, rejected: 0 });
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const fetchData = async () => {
        setLoading(true);
        // Dynamically import server actions to avoid build issues if mixed
        const { getPendingEmployees, getVerifiedEmployees } = await import('@/lib/verification-actions');

        const [pending, statsData] = await Promise.all([
            getPendingEmployees(),
            getVerifiedEmployees()
        ]);

        setPendingEmployees(pending);
        setStats(statsData);
        setLoading(false);
    };

    const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
        const { approveEmployee, rejectEmployee } = await import('@/lib/verification-actions');
        if (action === 'APPROVE') await approveEmployee(id);
        else await rejectEmployee(id);
        fetchData(); // Refresh
    };

    // Initial load
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh', bgcolor: 'background.default' }}>
            <Box sx={{ maxWidth: 'xl', mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>

                {/* Header */}
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>Verification Requests</Typography>
                    <Typography variant="body1" color="text.secondary">Review and approve new employee registrations for your department.</Typography>
                </Box>

                {/* KPI Cards */}
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Paper elevation={0} sx={{ flex: 1, minWidth: 200, p: 2.5, borderRadius: 3, border: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main', width: 48, height: 48 }}>
                            <PendingIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight="bold">{stats.pending}</Typography>
                            <Typography variant="body2" color="text.secondary">Pending Review</Typography>
                        </Box>
                    </Paper>
                    <Paper elevation={0} sx={{ flex: 1, minWidth: 200, p: 2.5, borderRadius: 3, border: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'success.light', color: 'success.main', width: 48, height: 48 }}>
                            <VerifiedIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight="bold">{stats.verified}</Typography>
                            <Typography variant="body2" color="text.secondary">Verified Total</Typography>
                        </Box>
                    </Paper>
                    <Paper elevation={0} sx={{ flex: 1, minWidth: 200, p: 2.5, borderRadius: 3, border: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'error.light', color: 'error.main', width: 48, height: 48 }}>
                            <CancelIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight="bold">{stats.rejected}</Typography>
                            <Typography variant="body2" color="text.secondary">Rejected/Suspended</Typography>
                        </Box>
                    </Paper>
                </Box>

                {/* Main Content */}
                <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', overflow: 'hidden' }}>

                    {/* Toolbar */}
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Tabs value={tabValue} onChange={handleTabChange} sx={{ minHeight: 'auto' }}>
                            <Tab label="Pending" sx={{ fontWeight: 600, textTransform: 'none' }} />
                        </Tabs>

                        <Box sx={{ display: 'flex', gap: 2, flex: 1, justifyContent: 'flex-end' }}>
                            <Button onClick={() => fetchData()} variant="outlined" startIcon={<FilterListIcon />} sx={{ borderRadius: 2 }}>Refresh</Button>
                        </Box>
                    </Box>

                    {/* Table */}
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ bgcolor: 'action.hover' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Employee</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Dept & Role</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Request Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}>Loading...</TableCell></TableRow>
                                ) : pendingEmployees.length === 0 ? (
                                    <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>No pending verification requests.</TableCell></TableRow>
                                ) : (
                                    pendingEmployees.map((emp) => (
                                        <TableRow hover key={emp.id}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar>{emp.firstName.charAt(0)}</Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight="bold">{emp.firstName} {emp.lastName}</Typography>
                                                        <Typography variant="caption" color="text.secondary">Code: {emp.employeeCode}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{emp.department}</Typography>
                                                <Typography variant="caption" color="text.secondary">{emp.designation}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{new Date(emp.createdAt).toLocaleDateString()}</Typography>
                                                <Typography variant="caption" color="text.secondary">{new Date(emp.createdAt).toLocaleTimeString()}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label="New Registration" size="small" color="primary" variant="outlined" sx={{ bgcolor: 'primary.50' }} />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Approve">
                                                    <IconButton color="success" size="small" onClick={() => handleAction(emp.id, 'APPROVE')}><CheckCircleIcon /></IconButton>
                                                </Tooltip>
                                                <Tooltip title="Reject">
                                                    <IconButton color="error" size="small" onClick={() => handleAction(emp.id, 'REJECT')}><CancelIcon /></IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

            </Box>
        </Box>
    );
}
