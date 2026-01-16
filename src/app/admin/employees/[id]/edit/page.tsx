'use client';

import {
    Box,
    Typography,
    Button,
    Paper,
    TextField,
    Grid,
    MenuItem,
    Breadcrumbs,
    Link as MuiLink,
    Avatar,
    Alert,
    CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Link from 'next/link';
import { getEmployeeById, updateEmployee } from '@/lib/employee-actions';
import { useState, useTransition, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DEPARTMENTS, DESIGNATIONS } from '@/lib/constants';

export default function EditEmployeePage() {
    const params = useParams();
    const id = params.id as string;

    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [employee, setEmployee] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchEmployee = async () => {
            if (!id) return;
            try {
                const data = await getEmployeeById(id);
                if (data) {
                    // Convert dates to string format YYYY-MM-DD for inputs
                    const formattedData = {
                        ...data,
                        dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
                        joiningDate: data.joiningDate ? new Date(data.joiningDate).toISOString().split('T')[0] : '',
                        confirmationDate: data.confirmationDate ? new Date(data.confirmationDate).toISOString().split('T')[0] : '',
                    };
                    setEmployee(formattedData);
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

    const handleSubmit = async (formData: FormData) => {
        setError(null);
        setSuccess(false);

        startTransition(async () => {
            const res = await updateEmployee(id, formData);
            if (res.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/admin/employees');
                }, 1500);
            } else {
                setError(res.error || 'Failed to update employee.');
            }
        });
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!employee) {
        return (
            <Box sx={{ p: 4 }}>
                <Alert severity="error">Employee not found</Alert>
                <Button onClick={() => router.back()} sx={{ mt: 2 }}>Go Back</Button>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>

            {/* Top Navigation (Admin) */}
            <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 1100, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', px: { xs: 2, md: 5 }, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ p: 1, bgcolor: 'primary.light', color: 'primary.main', borderRadius: 1 }}>
                        <AccountBalanceIcon />
                    </Box>
                    <Typography variant="subtitle1" fontWeight="bold">Nagar Nigam Employee System</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
                        <Typography variant="subtitle2" fontWeight="bold">Admin User</Typography>
                        <Typography variant="caption" color="text.secondary">IMC Head Office</Typography>
                    </Box>
                    <Avatar sx={{ border: '2px solid', borderColor: 'primary.main' }}>AD</Avatar>
                </Box>
            </Box>

            {/* Main Content */}
            <Box component="main" sx={{ flex: 1, py: 4, px: { xs: 2, md: 5 }, overflowY: 'auto' }}>
                <Box sx={{ maxWidth: 960, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>

                    {/* Breadcrumbs */}
                    <Breadcrumbs aria-label="breadcrumb">
                        <MuiLink component={Link} href="/admin" underline="hover" color="inherit">Home</MuiLink>
                        <MuiLink component={Link} href="/admin/employees" underline="hover" color="inherit">Employees</MuiLink>
                        <Typography color="text.primary" fontWeight="bold">Edit Employee</Typography>
                    </Breadcrumbs>

                    <form action={handleSubmit}>
                        {/* Page Heading */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                            <Box>
                                <Typography variant="h4" fontWeight="bold" gutterBottom>Edit Employee</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600 }}>
                                    Update the details below for {employee.firstName} {employee.lastName}.
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button variant="outlined" color="inherit" onClick={() => router.back()} sx={{ borderRadius: 2 }}>Cancel</Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                    disabled={isPending}
                                    sx={{ borderRadius: 2, fontWeight: 700 }}
                                >
                                    {isPending ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Box>
                        </Box>

                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ mb: 3 }}>Employee updated successfully! Redirecting...</Alert>}

                        {/* Form Grid */}
                        <Grid container spacing={3}>

                            {/* Left Col: Photo & Status */}
                            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', overflow: 'hidden' }}>
                                    <Box sx={{ px: 2.5, py: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BadgeIcon color="primary" />
                                        <Typography variant="subtitle1" fontWeight="bold">Profile Photo</Typography>
                                    </Box>
                                    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{
                                            width: '100%',
                                            aspectRatio: '4/3',
                                            bgcolor: 'background.default',
                                            border: '2px dashed',
                                            borderColor: 'divider',
                                            borderRadius: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            '&:hover': { bgcolor: 'action.hover' }
                                        }}>
                                            <AddAPhotoIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                                            <Typography variant="body2" fontWeight="bold">Click or drag to upload</Typography>
                                            <Typography variant="caption" color="text.secondary">JPG, PNG up to 5MB</Typography>
                                        </Box>

                                        <Box sx={{ width: '100%' }}>
                                            <Typography variant="caption" fontWeight="bold" color="text.secondary" textTransform="uppercase" display="block" mb={0.5}>Employee ID</Typography>
                                            <TextField
                                                name="employeeCode"
                                                disabled
                                                defaultValue={employee.employeeCode}
                                                fullWidth
                                                size="small"
                                                InputProps={{ sx: { borderRadius: 2, bgcolor: 'action.hover' } }}
                                            />
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>Cannot be changed.</Typography>
                                        </Box>
                                    </Box>
                                </Paper>

                                <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', p: 2.5 }}>
                                    <Typography variant="subtitle2" fontWeight="bold" textTransform="uppercase" gutterBottom>System Status</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: employee.status === 'ACTIVE' ? 'success.main' : 'warning.main' }} />
                                        <Typography variant="body2" color="text.secondary">{employee.status}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Right Col: Details */}
                            <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                                {/* Basic Details */}
                                <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider' }}>
                                    <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonIcon color="primary" />
                                        <Typography variant="subtitle1" fontWeight="bold">Basic Details</Typography>
                                    </Box>
                                    <Box sx={{ p: 3 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>First Name *</Typography>
                                                <TextField name="firstName" defaultValue={employee.firstName} required fullWidth size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Last Name *</Typography>
                                                <TextField name="lastName" defaultValue={employee.lastName} required fullWidth size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Father's Name</Typography>
                                                <TextField name="fatherName" defaultValue={employee.fatherName} fullWidth size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Marital Status</Typography>
                                                <TextField name="maritalStatus" select fullWidth defaultValue={employee.maritalStatus || 'Single'} size="small" InputProps={{ sx: { borderRadius: 2 } }}>
                                                    <MenuItem value="Single">Single</MenuItem>
                                                    <MenuItem value="Married">Married</MenuItem>
                                                    <MenuItem value="All Separated">Allocated Separated</MenuItem>
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Blood Group</Typography>
                                                <TextField name="bloodGroup" select fullWidth defaultValue={employee.bloodGroup || ''} size="small" InputProps={{ sx: { borderRadius: 2 } }}>
                                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                                        <MenuItem key={bg} value={bg}>{bg}</MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Date of Birth *</Typography>
                                                <TextField name="dob" defaultValue={employee.dob} required fullWidth type="date" size="small" InputProps={{ sx: { borderRadius: 2 } }} InputLabelProps={{ shrink: true }} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Paper>

                                {/* Employment Details */}
                                <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider' }}>
                                    <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <WorkIcon color="primary" />
                                        <Typography variant="subtitle1" fontWeight="bold">Employment Details</Typography>
                                    </Box>
                                    <Box sx={{ p: 3 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Department *</Typography>
                                                <TextField name="department" select required fullWidth defaultValue={employee.department} size="small" InputProps={{ sx: { borderRadius: 2 } }}>
                                                    {DEPARTMENTS.map((dept) => (
                                                        <MenuItem key={dept} value={dept}>
                                                            {dept}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Designation *</Typography>
                                                <TextField name="designation" select required fullWidth defaultValue={employee.designation} size="small" InputProps={{ sx: { borderRadius: 2 } }}>
                                                    {DESIGNATIONS.map((desig) => (
                                                        <MenuItem key={desig} value={desig}>
                                                            {desig}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Joining Date *</Typography>
                                                <TextField name="joiningDate" defaultValue={employee.joiningDate} required fullWidth type="date" size="small" InputProps={{ sx: { borderRadius: 2 } }} InputLabelProps={{ shrink: true }} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Confirmation Date</Typography>
                                                <TextField name="confirmationDate" defaultValue={employee.confirmationDate} fullWidth type="date" size="small" InputProps={{ sx: { borderRadius: 2 } }} InputLabelProps={{ shrink: true }} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Employee Type</Typography>
                                                <TextField name="employeeType" select fullWidth defaultValue={employee.employeeType || "permanent"} size="small" InputProps={{ sx: { borderRadius: 2 } }}>
                                                    <MenuItem value="permanent">Permanent</MenuItem>
                                                    <MenuItem value="contract">Contractual</MenuItem>
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Pay Grade / Level</Typography>
                                                <TextField name="payGrade" defaultValue={employee.payGrade} fullWidth placeholder="e.g. Level-9 (GP 3600)" size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Reporting Officer</Typography>
                                                <TextField name="reportingOfficer" defaultValue={employee.reportingOfficer} fullWidth placeholder="Name (Designation)" size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Zone / Location</Typography>
                                                <TextField name="zone" defaultValue={employee.zone} fullWidth placeholder="e.g. Zone 4, Indore" size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Paper>

                                {/* Contact Details */}
                                <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider' }}>
                                    <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ContactMailIcon color="primary" />
                                        <Typography variant="subtitle1" fontWeight="bold">Contact Details</Typography>
                                    </Box>
                                    <Box sx={{ p: 3 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Official Email *</Typography>
                                                <TextField name="email" defaultValue={employee.email} required type="email" fullWidth size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Phone Number *</Typography>
                                                <TextField name="phone" defaultValue={employee.contactNumber} required fullWidth size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Current Address</Typography>
                                                <TextField name="address" defaultValue={employee.address} fullWidth multiline rows={2} size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Permanent Address</Typography>
                                                <TextField name="permanentAddress" defaultValue={employee.permanentAddress} fullWidth multiline rows={2} size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Paper>

                            </Grid>
                        </Grid>
                    </form>

                </Box>
            </Box>
        </Box>
    );
}
