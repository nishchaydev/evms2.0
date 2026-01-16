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
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { DEPARTMENTS, DESIGNATIONS } from '@/lib/constants';

interface EmployeeFormProps {
    onSubmit: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
}

export default function EmployeeForm({ onSubmit }: EmployeeFormProps) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [department, setDepartment] = useState('');
    const [employeeId, setEmployeeId] = useState('');

    const generateId = (dept: string) => {
        if (!dept) return '';
        const year = new Date().getFullYear();
        // Generate code from first 3 letters of department, uppercase
        const code = dept.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');

        const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
        return `NN-${code}-${year}-${random}`;
    };

    const handleDepartmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDept = e.target.value;
        setDepartment(newDept);
        const newId = generateId(newDept);
        setEmployeeId(newId);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };


    const handleSubmit = async (formData: FormData) => {
        setError(null);
        setSuccess(false);

        startTransition(async () => {
            const res = await onSubmit(formData);
            if (res.success) {
                setSuccess(true);
                // Optionally redirect after a delay
                setTimeout(() => {
                    router.push('/admin/employees');
                }, 1500);
            } else {
                setError(res.error || 'Failed to create employee.');
            }
        });
    };

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
                        <Typography color="text.primary" fontWeight="bold">Add New</Typography>
                    </Breadcrumbs>

                    <form action={handleSubmit}>
                        {/* Page Heading */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                            <Box>
                                <Typography variant="h4" fontWeight="bold" gutterBottom>Add New Employee</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600 }}>
                                    Fill in the details below to register a new government employee. All fields marked with * are mandatory.
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
                                    {isPending ? 'Saving...' : 'Save & Add Employee'}
                                </Button>
                            </Box>
                        </Box>

                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ mb: 3 }}>Employee created successfully! Redirecting...</Alert>}

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
                                        <Box
                                            onClick={() => document.getElementById('photo-input')?.click()}
                                            sx={{
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
                                                overflow: 'hidden',
                                                position: 'relative',
                                                '&:hover': { bgcolor: 'action.hover' }
                                            }}>
                                            {previewUrl ? (
                                                <Box
                                                    component="img"
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <>
                                                    <AddAPhotoIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                                                    <Typography variant="body2" fontWeight="bold">Click to upload</Typography>
                                                    <Typography variant="caption" color="text.secondary">JPG, PNG up to 5MB</Typography>
                                                </>
                                            )}
                                            <input
                                                id="photo-input"
                                                type="file"
                                                name="photo"
                                                accept="image/*"
                                                hidden
                                                onChange={handleFileChange}
                                            />
                                        </Box>

                                        <Box sx={{ width: '100%' }}>
                                            <Typography variant="caption" fontWeight="bold" color="text.secondary" textTransform="uppercase" display="block" mb={0.5}>Employee ID *</Typography>
                                            <TextField
                                                name="employeeCode"
                                                required
                                                fullWidth
                                                value={employeeId}
                                                onChange={(e) => setEmployeeId(e.target.value)}
                                                placeholder="e.g. NN-2024-890"
                                                size="small"
                                                InputProps={{ sx: { borderRadius: 2 } }}
                                                helperText="Auto-generated based on department"
                                            />
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>Must be unique across the department.</Typography>
                                        </Box>
                                    </Box>
                                </Paper>

                                <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', p: 2.5 }}>
                                    <Typography variant="subtitle2" fontWeight="bold" textTransform="uppercase" gutterBottom>System Status</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                                        <Typography variant="body2" color="text.secondary">Database Connected</Typography>
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
                                                <TextField name="firstName" required fullWidth placeholder="Enter first name" size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Last Name *</Typography>
                                                <TextField name="lastName" required fullWidth placeholder="Enter last name" size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Father's Name</Typography>
                                                <TextField name="fatherName" fullWidth placeholder="Enter father's name" size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Marital Status</Typography>
                                                <TextField name="maritalStatus" select fullWidth defaultValue="Single" size="small" InputProps={{ sx: { borderRadius: 2 } }}>
                                                    <MenuItem value="Single">Single</MenuItem>
                                                    <MenuItem value="Married">Married</MenuItem>
                                                    <MenuItem value="All Separated">Allocated Separated</MenuItem>
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Blood Group</Typography>
                                                <TextField name="bloodGroup" select fullWidth defaultValue="" size="small" InputProps={{ sx: { borderRadius: 2 } }}>
                                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                                        <MenuItem key={bg} value={bg}>{bg}</MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Date of Birth *</Typography>
                                                <TextField name="dob" required fullWidth type="date" size="small" InputProps={{ sx: { borderRadius: 2 } }} InputLabelProps={{ shrink: true }} />
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
                                                <TextField
                                                    name="department"
                                                    select
                                                    required
                                                    fullWidth
                                                    value={department}
                                                    onChange={handleDepartmentChange}
                                                    size="small"
                                                    InputProps={{ sx: { borderRadius: 2 } }}
                                                >
                                                    {DEPARTMENTS.map((dept) => (
                                                        <MenuItem key={dept} value={dept}>
                                                            {dept}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Designation *</Typography>
                                                <TextField name="designation" select required fullWidth defaultValue="" size="small" InputProps={{ sx: { borderRadius: 2 } }}>
                                                    {DESIGNATIONS.map((desig) => (
                                                        <MenuItem key={desig} value={desig}>
                                                            {desig}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Joining Date *</Typography>
                                                <TextField name="joiningDate" required fullWidth type="date" size="small" InputProps={{ sx: { borderRadius: 2 } }} InputLabelProps={{ shrink: true }} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Confirmation Date</Typography>
                                                <TextField name="confirmationDate" fullWidth type="date" size="small" InputProps={{ sx: { borderRadius: 2 } }} InputLabelProps={{ shrink: true }} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Employee Type</Typography>
                                                <TextField name="employeeType" select fullWidth defaultValue="permanent" size="small" InputProps={{ sx: { borderRadius: 2 } }}>
                                                    <MenuItem value="permanent">Permanent</MenuItem>
                                                    <MenuItem value="contract">Contractual</MenuItem>
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Pay Grade / Level</Typography>
                                                <TextField name="payGrade" fullWidth placeholder="e.g. Level-9 (GP 3600)" size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Reporting Officer</Typography>
                                                <TextField name="reportingOfficer" fullWidth placeholder="Name (Designation)" size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Zone / Location</Typography>
                                                <TextField name="zone" fullWidth placeholder="e.g. Zone 4, Indore" size="small" InputProps={{ sx: { borderRadius: 2 } }} />
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
                                                <TextField name="email" required type="email" fullWidth placeholder="email@example.com" size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Phone Number *</Typography>
                                                <TextField name="phone" required fullWidth placeholder="+91 98..." size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Current Address</Typography>
                                                <TextField name="address" fullWidth multiline rows={2} placeholder="Enter current address" size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Permanent Address</Typography>
                                                <TextField name="permanentAddress" fullWidth multiline rows={2} placeholder="Enter permanent address" size="small" InputProps={{ sx: { borderRadius: 2 } }} />
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
