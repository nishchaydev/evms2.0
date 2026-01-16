'use client';

import {
    Box,
    Typography,
    Button,
    Paper,
    TextField,
    MenuItem,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    InputAdornment,
    Breadcrumbs,
    Link as MuiLink,
    Avatar,
    IconButton,
    Container,
    CircularProgress
} from '@mui/material';
import Link from 'next/link';
import { DEPARTMENTS, DESIGNATIONS } from '@/lib/constants';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MenuIcon from '@mui/icons-material/Menu';
import { getEmployees } from '@/lib/employee-actions';
import { useEffect, useState } from 'react';

// Define Interface (matching what getEmployees returns approximately)
interface Employee {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    department: string;
    designation: string;
    status: string;
    email: string;
}

export default function OfficerSearchPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [departmentDetails, setDepartmentDetails] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await getEmployees();
                setEmployees(data as any);
            } catch (error) {
                console.error("Failed to fetch employees", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch =
            (emp.firstName?.toLowerCase() || '').includes(search.toLowerCase()) ||
            (emp.lastName?.toLowerCase() || '').includes(search.toLowerCase()) ||
            (emp.employeeCode?.toLowerCase() || '').includes(search.toLowerCase());

        const matchesDept = departmentDetails ? emp.department === departmentDetails : true;

        return matchesSearch && matchesDept;
    });

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>

            {/* Header */}
            <Box component="header" sx={{ px: { xs: 2, md: 5 }, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, zIndex: 100 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ p: 1, bgcolor: 'primary.light', color: 'primary.main', borderRadius: 1 }}>
                        <AccountBalanceIcon />
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>Digital Employee Verification System</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">Nagar Nigam (IMC)</Typography>
                    </Box>
                </Box>
                {/* Actions Grid */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, alignItems: 'center' }}>
                    <Button component={Link} href="/officer" color="inherit">Dashboard</Button>
                    <Button component={Link} href="#" color="primary" sx={{ fontWeight: 'bold' }}>Employee Management</Button>
                    <Button component={Link} href="#" color="inherit">Reports</Button>
                    <Button component={Link} href="#" color="inherit">Settings</Button>

                    <Box sx={{ pl: 3, borderLeft: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="subtitle2" fontWeight="bold">Admin User</Typography>
                            <Typography variant="caption" color="text.secondary">System Administrator</Typography>
                        </Box>
                        <Avatar sx={{ width: 40, height: 40 }}>AD</Avatar>
                    </Box>
                </Box>
                <IconButton sx={{ display: { md: 'none' } }}><MenuIcon /></IconButton>
            </Box>

            {/* Main Content */}
            <Box component="main" sx={{ flex: 1, px: { xs: 2, md: 5 }, py: 4, maxWidth: '1400px', mx: 'auto', width: '100%' }}>

                {/* Breadcrumb */}
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
                    <MuiLink component={Link} href="/officer" underline="hover" color="inherit" sx={{ display: 'flex', alignItems: 'center' }}>
                        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Home
                    </MuiLink>
                    <Typography color="text.secondary">Employee Management</Typography>
                    <Typography color="text.primary" fontWeight="bold">Officer Search</Typography>
                </Breadcrumbs>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>Officer Search</Typography>
                    <Typography variant="body1" color="text.secondary">Locate internal employee records, view current status, and verify designation details within the Nagar Nigam database.</Typography>
                </Box>

                {/* Search Filter Card */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: 1, borderColor: 'divider', mb: 4 }}>
                    <Grid container spacing={3} alignItems="flex-end">
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Search Query</Typography>
                            <TextField
                                fullWidth
                                placeholder="Search by Employee ID, Name, or Department Code"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                                    sx: { borderRadius: 2 }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Department</Typography>
                            <TextField
                                select
                                fullWidth
                                value={departmentDetails}
                                onChange={(e) => setDepartmentDetails(e.target.value)}
                                size="small"
                                InputProps={{ sx: { borderRadius: 2 } }}
                            >
                                <MenuItem value="">All Departments</MenuItem>
                                {DEPARTMENTS.map((dept) => (
                                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Designation</Typography>
                            <TextField
                                select
                                fullWidth
                                defaultValue=""
                                size="small"
                                InputProps={{ sx: { borderRadius: 2 } }}
                            >
                                <MenuItem value="">All Designations</MenuItem>
                                {DESIGNATIONS.map((desig) => (
                                    <MenuItem key={desig} value={desig}>{desig}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Employment Status</Typography>
                            <TextField select fullWidth defaultValue="" size="small" InputProps={{ sx: { borderRadius: 2 } }}>
                                <MenuItem value="">All Statuses</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="suspended">Suspended</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button variant="contained" fullWidth sx={{ borderRadius: 2, height: 40 }} startIcon={<SearchIcon />}>Search</Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    sx={{ borderRadius: 2, height: 40 }}
                                    onClick={() => { setSearch(''); setDepartmentDetails(''); }}
                                >
                                    Reset
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Results Table */}
                <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', overflow: 'hidden' }}>
                    <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" fontWeight="bold">Search Results <Chip label={`${filteredEmployees.length} Records`} size="small" sx={{ ml: 1, bgcolor: 'action.hover', fontWeight: 'bold' }} /></Typography>
                        <Button variant="outlined" size="small" startIcon={<DownloadIcon />} color="inherit" sx={{ borderRadius: 1 }}>Export CSV</Button>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ bgcolor: 'background.default' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>EMPLOYEE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>ID & DESIGNATION</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>DEPARTMENT</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>STATUS</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>ACTION</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}><CircularProgress /></TableCell>
                                    </TableRow>
                                ) : filteredEmployees.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                            <Typography color="text.secondary">No employees found matching your criteria.</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredEmployees.map((emp) => (
                                        <TableRow key={emp.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                                                        {emp.firstName?.[0]}{emp.lastName?.[0]}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="bold">{emp.firstName} {emp.lastName}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{emp.email}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{emp.employeeCode}</Typography>
                                                <Typography variant="caption" color="text.secondary" textTransform="capitalize">{emp.designation}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={emp.department} size="small" color="default" variant="outlined" sx={{ textTransform: 'capitalize' }} />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={emp.status}
                                                    size="small"
                                                    color={emp.status === 'ACTIVE' ? 'success' : 'error'}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    size="small"
                                                    endIcon={<ArrowForwardIcon />}
                                                    component={Link}
                                                    href={`/officer/verify/${emp.id}`}
                                                >
                                                    Verify
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

            </Box>

            {/* Footer */}
            <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', bgcolor: 'white', py: 3, mt: 'auto' }}>
                <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary', fontSize: 13 }}>
                    <Typography variant="caption">© 2023 Nagar Nigam. All rights reserved.</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Link href="#">Privacy Policy</Link>
                        <Link href="#">Terms of Service</Link>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
