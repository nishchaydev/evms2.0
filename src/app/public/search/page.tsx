'use client';

import {
    Box,
    Button,
    Container,
    Typography,
    Paper,
    Grid,
    TextField,
    MenuItem,
    InputAdornment,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Link from 'next/link';
import { useState } from 'react';
import { searchEmployees } from '@/lib/search-actions';
import { useRouter } from 'next/navigation';
import { DEPARTMENTS, DESIGNATIONS } from '@/lib/constants';
import PageTransition from '@/components/ui/PageTransition';
import GlassCard from '@/components/ui/GlassCard';

// Interface for search results
interface EmployeeResult {
    id: string;
    firstName: string;
    lastName: string;
    employeeCode: string;
    department: string;
    designation: string;
    status: string;
    qr?: { token: string };
}

export default function PublicSearchPage() {
    // Optional: Filter or sort these if needed, or just use them directly
    const departments = DEPARTMENTS;
    const roles = DESIGNATIONS;

    const [query, setQuery] = useState('');
    const [department, setDepartment] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<EmployeeResult[] | null>(null);
    const router = useRouter();

    const handleSearch = async () => {
        setLoading(true);
        try {
            const data = await searchEmployees(query, department, role);
            setResults(data as any);
        } catch (error) {
            console.error(error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (token?: string) => {
        if (token) {
            router.push(`/verify/${token}`);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', color: 'text.primary' }}>

            {/* Top Navigation */}
            <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 1100, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', px: { xs: 2, md: 5 }, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box component={Link} href="/" sx={{ display: 'flex', alignItems: 'center', gap: 2, textDecoration: 'none', color: 'inherit' }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <AccountBalanceIcon sx={{ fontSize: 20 }} />
                    </Box>
                    <Typography variant="subtitle1" fontWeight="bold">IMC Verification Portal</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Button component={Link} href="/login" variant="contained" size="small" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
                        Officer Login
                    </Button>
                </Box>
            </Box>

            {/* Main Content */}
            <Container maxWidth="md" sx={{ flex: 1, py: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', gap: 4 }}>

                <PageTransition>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {/* Page Heading */}
                        <Box sx={{ textAlign: { xs: 'center', md: 'left' }, px: { xs: 1, md: 2 } }}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>Public Employee Verification</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: { xs: 'auto', md: 0 } }}>
                                Search to verify whether an employee is legitimate. Access the official Nagar Nigam database to ensure transparency and trust.
                            </Typography>
                        </Box>

                        {/* Search Card */}
                        <GlassCard sx={{ p: { xs: 2, md: 4 } }}>
                            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                                {/* Search Input */}
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Search Employee</Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter Name or Employee ID (e.g., NN-2024-890)"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon color="action" />
                                                </InputAdornment>
                                            ),
                                            sx: { borderRadius: 2, bgcolor: 'background.default' }
                                        }}
                                        variant="outlined"
                                    />
                                </Box>

                                {/* Filters Row */}
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Department</Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value)}
                                            variant="outlined"
                                            InputProps={{ sx: { borderRadius: 2, bgcolor: 'background.default' } }}
                                        >
                                            <MenuItem value="">Any Department</MenuItem>
                                            {departments.map((dept) => <MenuItem key={dept} value={dept}>{dept}</MenuItem>)}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Role</Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            variant="outlined"
                                            InputProps={{ sx: { borderRadius: 2, bgcolor: 'background.default' } }}
                                        >
                                            <MenuItem value="">Any Role</MenuItem>
                                            {roles.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                                        </TextField>
                                    </Grid>
                                </Grid>

                                {/* Action Button */}
                                <Box sx={{ display: 'flex', justifyContent: { xs: 'stretch', md: 'flex-end' }, pt: 1 }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                                        onClick={handleSearch}
                                        disabled={loading}
                                        sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: 700, textTransform: 'none' }}
                                    >
                                        {loading ? 'Searching...' : 'Search Records'}
                                    </Button>
                                </Box>

                            </Box>
                        </GlassCard>

                        {/* Results Section */}
                        {results && (
                            <Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ px: 1 }}>Search Results ({results.length})</Typography>
                                {results.length === 0 ? (
                                    <Box sx={{ py: 6, px: 2, textAlign: 'center', border: '2px dashed', borderColor: 'divider', borderRadius: 3, bgcolor: 'rgba(255,255,255,0.5)' }}>
                                        <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'action.hover', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                            <ManageSearchIcon sx={{ fontSize: 32, color: 'text.secondary' }} />
                                        </Box>
                                        <Typography variant="h6" fontWeight="500" gutterBottom>No employees found</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                                            We couldn't find any match for your search criteria. Please try checking the spelling or Employee ID.
                                        </Typography>
                                    </Box>
                                ) : (
                                    <GlassCard sx={{ overflow: 'hidden', p: 0 }}>
                                        <TableContainer>
                                            <Table>
                                                <TableHead sx={{ bgcolor: 'action.hover' }}>
                                                    <TableRow>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Employee Name</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {results.map((emp) => (
                                                        <TableRow
                                                            key={emp.id}
                                                            hover
                                                            onClick={() => handleRowClick(emp.qr?.token)}
                                                            sx={{ cursor: emp.qr?.token ? 'pointer' : 'default' }}
                                                        >
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                    <Avatar sx={{ bgcolor: 'primary.main' }}>{emp.firstName?.[0]}{emp.lastName?.[0]}</Avatar>
                                                                    <Box>
                                                                        <Typography variant="subtitle2" fontWeight="bold">{emp.firstName} {emp.lastName}</Typography>
                                                                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>{emp.employeeCode}</Typography>
                                                                    </Box>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2">{emp.designation}</Typography>
                                                                <Typography variant="caption" color="text.secondary">{emp.department}</Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip label={emp.status} size="small" color={emp.status === 'ACTIVE' ? 'success' : 'default'} />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </GlassCard>
                                )}
                            </Box>
                        )}

                        {/* Info Cards (Only show if no results yet) */}
                        {!results && (
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <GlassCard sx={{ p: 2.5, display: 'flex', gap: 2, alignItems: 'flex-start' }} hoverEffect={false}>
                                        <Box sx={{ p: 1, borderRadius: 1, bgcolor: '#eff6ff', color: 'primary.main' }}>
                                            <VerifiedUserIcon />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold">Official Verification</Typography>
                                            <Typography variant="body2" color="text.secondary">All data is sourced directly from the official government personnel registry for accuracy.</Typography>
                                        </Box>
                                    </GlassCard>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <GlassCard sx={{ p: 2.5, display: 'flex', gap: 2, alignItems: 'flex-start' }} hoverEffect={false}>
                                        <Box sx={{ p: 1, borderRadius: 1, bgcolor: '#eff6ff', color: 'primary.main' }}>
                                            <ReportProblemIcon />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold">Report Issues</Typography>
                                            <Typography variant="body2" color="text.secondary">If you suspect fraudulent activity or cannot find an employee, please contact the helpdesk.</Typography>
                                        </Box>
                                    </GlassCard>
                                </Grid>
                            </Grid>
                        )}
                    </Box>
                </PageTransition>

            </Container>

            {/* Footer */}
            <Box component="footer" sx={{ mt: 'auto', borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper', py: 3, px: { xs: 2, md: 5 } }}>
                <Box sx={{ maxWidth: 960, mx: 'auto', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        © 2024 Nagar Nigam (IMC). All rights reserved.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Typography component={Link} href="#" variant="body2" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Privacy Policy</Typography>
                        <Typography component={Link} href="#" variant="body2" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>Terms of Service</Typography>
                    </Box>
                </Box>
            </Box>

        </Box>
    );
}
