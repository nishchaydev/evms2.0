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
            <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 1100, bgcolor: 'background.paper', borderBottom: 2, borderColor: 'divider', px: { xs: 2, md: 5 }, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AccountBalanceIcon color="primary" sx={{ fontSize: 24 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Govt. of Madhya Pradesh</Typography>
                    </Box>
                </Link>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Link href="/login" style={{ textDecoration: 'none' }}>
                        <Button variant="outlined" color="primary" size="small">
                            Official Login
                        </Button>
                    </Link>
                </Box>
            </Box>

            {/* Main Content */}
            <Container maxWidth="md" sx={{ flex: 1, py: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', gap: 4 }}>

                <PageTransition>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {/* Page Heading */}
                        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                            <Typography variant="overline" color="primary">Employee Registry</Typography>
                            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>Public Verification</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
                                Search the official Nagar Nigam Indore personnel database to verify employee credentials and ensure administrative transparency.
                            </Typography>
                        </Box>

                        {/* Search Card */}
                        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, border: 2, borderColor: 'divider' }}>
                            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                                <Box>
                                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, mb: 1, display: 'block' }}>Search Employee</Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="Name or Employee ID (e.g., NN-2024-890)"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        variant="outlined"
                                    />
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, mb: 1, display: 'block' }}>Department</Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value)}
                                            variant="outlined"
                                        >
                                            <MenuItem value="">Any Department</MenuItem>
                                            {departments.map((dept) => <MenuItem key={dept} value={dept}>{dept}</MenuItem>)}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, mb: 1, display: 'block' }}>Role</Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            variant="outlined"
                                        >
                                            <MenuItem value="">Any Role</MenuItem>
                                            {roles.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                                        </TextField>
                                    </Grid>
                                </Grid>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                                        onClick={handleSearch}
                                        disabled={loading}
                                        sx={{ minWidth: 200, height: 56 }}
                                    >
                                        {loading ? 'Searching...' : 'Search Records'}
                                    </Button>
                                </Box>

                            </Box>
                        </Paper>

                        {/* Results Section */}
                        {results && (
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, px: 1 }}>RESULTS ({results.length})</Typography>
                                {results.length === 0 ? (
                                    <Paper elevation={0} sx={{ py: 8, px: 2, textAlign: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: 'divider', bgcolor: 'transparent' }}>
                                        <ManageSearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>No employees found</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mt: 1 }}>
                                            We couldn't find matches for "{query}". Please check the spelling or Official Employee ID.
                                        </Typography>
                                    </Paper>
                                ) : (
                                    <Paper elevation={0} sx={{ overflow: 'hidden', border: 2, borderColor: 'divider' }}>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Employee Name</TableCell>
                                                        <TableCell>Designation</TableCell>
                                                        <TableCell align="right">Status</TableCell>
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
                                                                    <Avatar sx={{ bgcolor: 'primary.main', borderRadius: 0, fontWeight: 800 }}>{emp.firstName?.[0]}{emp.lastName?.[0]}</Avatar>
                                                                    <Box>
                                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{emp.firstName} {emp.lastName}</Typography>
                                                                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>{emp.employeeCode}</Typography>
                                                                    </Box>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{emp.designation}</Typography>
                                                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{emp.department}</Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Chip
                                                                    label={emp.status}
                                                                    size="small"
                                                                    sx={{ borderRadius: 0, fontWeight: 800 }}
                                                                    color={emp.status === 'ACTIVE' ? 'success' : 'default'}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Paper>
                                )}
                            </Box>
                        )}

                        {/* Info Cards */}
                        {!results && (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Paper elevation={0} sx={{ p: 4, display: 'flex', gap: 3, alignItems: 'flex-start', border: 2, borderColor: 'divider' }}>
                                        <VerifiedUserIcon color="primary" sx={{ fontSize: 32 }} />
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>OFFICIAL REGISTRY</Typography>
                                            <Typography variant="body2" color="text.secondary">Direct access to the secure government employee record system for real-time verification.</Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Paper elevation={0} sx={{ p: 4, display: 'flex', gap: 3, alignItems: 'flex-start', border: 2, borderColor: 'divider' }}>
                                        <ReportProblemIcon color="secondary" sx={{ fontSize: 32 }} />
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>REPORT FRAUD</Typography>
                                            <Typography variant="body2" color="text.secondary">If you suspect an individual is impersonating a government official, use our secure reporting tool.</Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        )}
                    </Box>
                </PageTransition>

            </Container>

            {/* Footer */}
            <Box component="footer" sx={{ mt: 'auto', borderTop: 2, borderColor: 'divider', bgcolor: 'background.paper', py: 4, px: 3 }}>
                <Container maxWidth={false} sx={{ maxWidth: 1400, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
                    <Box>
                        <Typography variant="h6">EVMS 2.0</Typography>
                        <Typography variant="caption" color="text.secondary">© 2026 Indore Municipal Corporation. Official Personnel Portal.</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 4 }}>
                        <Link href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>LEGAL</Link>
                        <Link href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>SUPPORT</Link>
                    </Box>
                </Container>
            </Box>

        </Box>
    );
}
