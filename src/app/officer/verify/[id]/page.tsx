'use client';

import {
    Box,
    Typography,
    Paper,
    Grid,
    Avatar,
    Chip,
    Button,
    Container,
    Breadcrumbs,
    Link as MuiLink,
    Divider,
    CircularProgress,
    Alert
} from '@mui/material';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getEmployeeById } from '@/lib/employee-actions';

// Icons
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import BadgeIcon from '@mui/icons-material/Badge';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WorkIcon from '@mui/icons-material/Work';

export default function OfficerVerifyPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const [employee, setEmployee] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployee = async () => {
            if (!id) return;
            try {
                const data = await getEmployeeById(id);
                if (data) {
                    setEmployee(data);
                } else {
                    setError('Employee not found');
                }
            } catch (err) {
                setError('Failed to load employee details');
            } finally {
                setLoading(false);
            }
        };
        fetchEmployee();
    }, [id]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;

    if (error || !employee) {
        return (
            <Container maxWidth="sm" sx={{ mt: 10 }}>
                <Alert severity="error">{error || 'Employee not found'}</Alert>
                <Button onClick={() => router.back()} sx={{ mt: 2 }} variant="outlined">Go Back</Button>
            </Container>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">

                {/* Header / Breadcrumbs */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <MuiLink component={Link} href="/officer" underline="hover" color="inherit">Dashboard</MuiLink>
                        <MuiLink component={Link} href="/officer/search" underline="hover" color="inherit">Search</MuiLink>
                        <Typography color="text.primary" fontWeight="bold">Officer View</Typography>
                    </Breadcrumbs>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} color="inherit">
                        Back
                    </Button>
                </Box>

                {/* Profile Header Card */}
                <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', overflow: 'hidden', mb: 4, position: 'relative' }}>
                    <Box sx={{ height: 6, bgcolor: 'primary.main', width: '100%', position: 'absolute', top: 0 }} />
                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={4} alignItems="center">
                            {/* Photo */}
                            <Grid item xs={12} md={3} lg={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box sx={{ position: 'relative' }}>
                                    <Avatar
                                        src={employee.photoUrl || undefined}
                                        sx={{ width: 120, height: 120, border: '4px solid', borderColor: 'background.paper', boxShadow: 2 }}
                                    >
                                        {employee.firstName?.[0]}{employee.lastName?.[0]}
                                    </Avatar>
                                    <Box sx={{ position: 'absolute', bottom: 4, right: 4, bgcolor: 'success.main', width: 24, height: 24, borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CheckCircleIcon sx={{ fontSize: 16, color: 'white' }} />
                                    </Box>
                                </Box>
                            </Grid>

                            {/* Main Info */}
                            <Grid item xs={12} md={9} lg={10}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                        <Typography variant="h4" fontWeight="bold">
                                            {employee.firstName} {employee.lastName}
                                        </Typography>
                                        <Chip
                                            label={employee.status}
                                            size="small"
                                            color={employee.status === 'ACTIVE' ? 'success' : 'default'}
                                            variant="outlined"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </Box>
                                    <Typography variant="h6" color="primary" fontWeight="medium">
                                        {employee.designation}
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 3, mt: 1, color: 'text.secondary', flexWrap: 'wrap' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <BadgeIcon fontSize="small" />
                                            <Typography variant="body2">{employee.employeeCode}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <ApartmentIcon fontSize="small" />
                                            <Typography variant="body2">{employee.department}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <LocationOnIcon fontSize="small" />
                                            <Typography variant="body2">Indore, MP</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>

                <Grid container spacing={3}>
                    {/* Left Col: Contact Info (Officer View sees all) */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', mb: 3 }}>
                            <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'action.hover' }}>
                                <Typography variant="subtitle2" fontWeight="bold" color="primary">CONTACT DETAILS</Typography>
                            </Box>
                            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <PhoneIcon color="action" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold">MOBILE</Typography>
                                        <Typography variant="body2" fontWeight="medium">{employee.contactNumber || 'N/A'}</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <EmailIcon color="action" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold">EMAIL</Typography>
                                        <Typography variant="body2" fontWeight="medium">{employee.email}</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <HomeIcon color="action" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ADDRESS</Typography>
                                        <Typography variant="body2" fontWeight="medium">{employee.address || 'N/A'}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>

                        <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider' }}>
                            <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'action.hover' }}>
                                <Typography variant="subtitle2" fontWeight="bold" color="primary">SYSTEM METADATA</Typography>
                            </Box>
                            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <InfoItem label="System ID" value={employee.id} />
                                <InfoItem label="Created At" value={new Date(employee.createdAt).toLocaleDateString()} />
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Right Col: Employment Details */}
                    <Grid item xs={12} md={8}>
                        <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', mb: 3 }}>
                            <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'action.hover' }}>
                                <Typography variant="subtitle2" fontWeight="bold" color="primary">EMPLOYMENT HISTORY</Typography>
                            </Box>
                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={4}>
                                    <Grid item xs={6}>
                                        <InfoItem label="Department" value={employee.department} />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <InfoItem label="Designation" value={employee.designation} />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <InfoItem label="Date of Joining" value={new Date(employee.joiningDate).toLocaleDateString()} />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <InfoItem label="Date of Birth" value={new Date(employee.dob).toLocaleDateString()} />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <InfoItem label="Employee Type" value={employee.employeeType || 'Permanent'} />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>

                        <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', p: 3 }}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                <Button variant="contained" startIcon={<EditIcon />} component={Link} href={`/admin/employees/${employee.id}/edit`}>
                                    Edit Employee Record
                                </Button>
                                <Button variant="outlined" color="primary">
                                    Download Service Book
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

            </Container>
        </Box>
    );
}

function InfoItem({ label, value }: { label: string, value: string }) {
    return (
        <Box>
            <Typography variant="caption" color="text.secondary" fontWeight="bold" textTransform="uppercase">{label}</Typography>
            <Typography variant="body1" fontWeight="medium">{value}</Typography>
        </Box>
    );
}
