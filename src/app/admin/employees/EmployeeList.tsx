'use client';

import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Chip,
    IconButton,
    InputAdornment,
    TextField,

    CircularProgress,
    Alert,
    Pagination,
    Stack
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getEmployees } from '@/lib/employee-actions';

interface Employee {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    department: string;
    designation: string;
    status: string;
    contactNumber?: string | null;
}

interface EmployeeListProps {
    initialEmployees: Employee[];
    initialMeta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export default function EmployeeList({ initialEmployees, initialMeta }: EmployeeListProps) {
    const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
    const [meta, setMeta] = useState(initialMeta);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    // Filters
    const [filterDept, setFilterDept] = useState('');
    const [filterDesignation, setFilterDesignation] = useState('');

    const fetchEmployees = async (page: number, currentFilters: { department?: string, designation?: string }) => {
        setLoading(true);
        try {
            const { data, meta: newMeta } = await getEmployees(page, meta.limit, currentFilters);
            setEmployees(data as any);
            setMeta(newMeta);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        fetchEmployees(value, { department: filterDept, designation: filterDesignation });
    };

    const handleFilterApply = () => {
        fetchEmployees(1, { department: filterDept, designation: filterDesignation });
    };

    const handleFilterClear = () => {
        setFilterDept('');
        setFilterDesignation('');
        fetchEmployees(1, {});
    };

    const filteredEmployees = employees.filter(emp =>
        (emp.firstName?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (emp.lastName?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (emp.employeeCode?.toLowerCase() || '').includes(search.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'success';
            case 'INACTIVE': return 'error';
            case 'ON_LEAVE': return 'warning';
            default: return 'default';
        }
    };

    const departments = [
        "IT Department", "Revenue", "Health", "Urban Development", "Police", "Education", "Public Works"
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 4 } }}>
                <Box sx={{ maxWidth: 'xl', mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>

                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="h4" fontWeight="bold" sx={{ background: 'linear-gradient(45deg, #2563eb, #7c3aed)', backgroundClip: 'text', textFillColor: 'transparent', width: 'fit-content' }}>
                                Employee Management
                            </Typography>
                            <Typography variant="body1" color="text.secondary">View, search, and manage all registered employees.</Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<PersonAddIcon />}
                            component={Link}
                            href="/admin/employees/add"
                            sx={{ borderRadius: 3, px: 3, py: 1, background: 'linear-gradient(45deg, #2563eb 30%, #7c3aed 90%)', boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.4)' }}
                        >
                            Add New Employee
                        </Button>
                    </Box>

                    {/* Search & Filter Bar */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 4,
                            border: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            flexWrap: 'wrap',
                            bgcolor: 'rgba(255, 255, 255, 0.5)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <TextField
                            placeholder="Search by name or ID..."
                            size="small"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                            }}
                        />

                        {/* Filters */}
                        <TextField
                            select
                            label="Department"
                            size="small"
                            value={filterDept}
                            onChange={(e) => setFilterDept(e.target.value)}
                            sx={{ minWidth: 150 }}
                            SelectProps={{ native: true }}
                            InputLabelProps={{ shrink: true }}
                        >
                            <option value="">All Depts</option>
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </TextField>

                        <TextField
                            placeholder="Designation..."
                            size="small"
                            value={filterDesignation}
                            onChange={(e) => setFilterDesignation(e.target.value)}
                            sx={{ minWidth: 150 }}
                        />

                        <Button variant="contained" onClick={handleFilterApply} sx={{ borderRadius: 3, px: 3 }}>Apply</Button>
                        {(filterDept || filterDesignation) && (
                            <Button variant="text" onClick={handleFilterClear} sx={{ borderRadius: 3 }}>Clear</Button>
                        )}


                        <Button variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider', color: 'text.secondary', px: 3, ml: 'auto' }} onClick={() => {
                            const headers = ['ID', 'First Name', 'Last Name', 'Employee Code', 'Department', 'Designation', 'Status'];
                            const csvContent = [
                                headers.join(','),
                                ...filteredEmployees.map(emp => [
                                    emp.id,
                                    `"${emp.firstName}"`,
                                    `"${emp.lastName}"`,
                                    `"${emp.employeeCode}"`,
                                    `"${emp.department}"`,
                                    `"${emp.designation}"`,
                                    emp.status
                                ].join(','))
                            ].join('\n');

                            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            const link = document.createElement('a');
                            if (link.download !== undefined) {
                                const url = URL.createObjectURL(blob);
                                link.setAttribute('href', url);
                                link.setAttribute('download', 'employees_export.csv');
                                link.style.visibility = 'hidden';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }
                        }}>Export CSV</Button>
                    </Paper>

                    {/* Employees Table */}
                    <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', bgcolor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px)' }}>
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Basic Info</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Designation & Dept</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Mobile</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', py: 2 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        // Skeleton Loading
                                        Array.from(new Array(5)).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell colSpan={5} sx={{ py: 3 }}>
                                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                        <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'action.hover' }} />
                                                        <Box sx={{ flex: 1, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : filteredEmployees.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, opacity: 0.6 }}>
                                                    <SearchIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                                                    <Typography variant="h6" color="text.secondary">No employees found</Typography>
                                                    <Typography variant="body2" color="text.secondary">Try adjusting your search terms or filters</Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredEmployees.map((employee) => (
                                            <TableRow
                                                key={employee.id}
                                                hover
                                                sx={{
                                                    transition: 'all 0.2s',
                                                    '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.04)' }
                                                }}
                                            >
                                                <TableCell sx={{ py: 2 }}>
                                                    <Box component={Link} href={`/admin/employees/${employee.id}`} sx={{ display: 'flex', alignItems: 'center', gap: 2, textDecoration: 'none', color: 'inherit' }}>
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: 'primary.soft',
                                                                color: 'primary.main',
                                                                fontWeight: 'bold',
                                                                border: '2px solid',
                                                                borderColor: 'background.paper',
                                                                boxShadow: 1
                                                            }}
                                                        >
                                                            {employee.firstName?.[0]}{employee.lastName?.[0]}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: 'text.primary' }}>
                                                                {employee.firstName} {employee.lastName}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', letterSpacing: 0.5 }}>
                                                                {employee.employeeCode}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="medium" textTransform="capitalize" sx={{ color: 'text.primary' }}>{employee.designation}</Typography>
                                                    <Chip
                                                        label={employee.department}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ mt: 0.5, height: 20, fontSize: '0.7rem', borderColor: 'divider' }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={employee.status}
                                                        size="small"
                                                        color={getStatusColor(employee.status) as any}
                                                        variant="filled"
                                                        sx={{ fontWeight: 600, borderRadius: 1.5 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                                                        {employee.contactNumber || 'N/A'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                        <IconButton
                                                            size="small"
                                                            component={Link}
                                                            href={`/admin/employees/${employee.id}/edit`}
                                                            sx={{
                                                                bgcolor: 'action.hover',
                                                                '&:hover': { bgcolor: 'primary.main', color: 'white' },
                                                                transition: 'all 0.2s'
                                                            }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            sx={{
                                                                bgcolor: 'error.lighter', // Verify if this exists or use action.hover
                                                                '&:hover': { bgcolor: 'error.main', color: 'white' },
                                                                transition: 'all 0.2s'
                                                            }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                </Box>

                {/* Pagination */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Stack spacing={2}>
                        <Pagination
                            count={meta.totalPages}
                            page={meta.page}
                            onChange={handlePageChange}
                            color="primary"
                            size="large"
                            disabled={loading}
                            shape="rounded"
                        />
                        <Typography variant="caption" textAlign="center" color="text.secondary">
                            Showing {employees.length} of {meta.total} employees
                        </Typography>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}
