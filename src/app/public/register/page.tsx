'use client';

import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    TextField,
    Typography,
    MenuItem,
    Alert,
    CircularProgress,
    Stack,
    Divider
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import { registerEmployeeSelf } from '@/lib/register-actions';
import Link from 'next/link';

export default function RegistrationPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setError(null);

        const res = await registerEmployeeSelf(formData);

        if (res.success) {
            setIsSuccess(true);
            window.scrollTo(0, 0);
        } else {
            setError(res.error || 'Registration failed');
            window.scrollTo(0, 0);
        }
        setIsSubmitting(false);
    }

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('File size should be less than 2MB');
                e.target.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    if (isSuccess) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', color: 'text.primary' }}>
                <Box component="header" sx={{ p: 2, borderBottom: 2, borderColor: 'divider', bgcolor: 'background.paper' }}>
                    <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AccountBalanceIcon color="primary" />
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>Govt. Verification Portal</Typography>
                    </Container>
                </Box>

                <Container maxWidth="sm" sx={{ flex: 1, py: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Box sx={{ width: 100, height: 100, border: 4, borderColor: 'success.main', color: 'success.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                        <CheckCircleIcon sx={{ fontSize: 64 }} />
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>Registration Received</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Your official personnel record has been submitted and is currently <strong>PENDING verification</strong> by the Nodal Office.
                    </Typography>
                    <Paper elevation={0} sx={{ p: 4, border: 2, borderColor: 'divider', width: '100%', mb: 4 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            Please present your physical credentials to the IT Department or your assigned Nodal Officer for final clearance.
                        </Typography>
                    </Paper>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" color="primary" size="large" sx={{ minWidth: 200 }}>Return to Home</Button>
                    </Link>
                </Container>

                <Box component="footer" sx={{ mt: 'auto', borderTop: 2, borderColor: 'divider', py: 4, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">© 2026 Indore Municipal Corporation. Official Personnel Registry.</Typography>
                </Box>
            </Box>
        );
    }

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
                <Box>
                    <Link href="/login" style={{ textDecoration: 'none' }}>
                        <Button variant="outlined" color="primary" size="small">Official Login</Button>
                    </Link>
                </Box>
            </Box>

            <Container maxWidth="md" sx={{ flex: 1, py: { xs: 4, md: 8 } }}>
                <Box sx={{ mb: 6, textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography variant="overline" color="primary">Personnel Onboarding</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>Employee Registration</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Enter your official credentials to request access to the Employee Management System. All data is subject to mandatory verification.
                    </Typography>
                </Box>

                <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, border: 2, borderColor: 'divider' }}>
                    {error && <Alert severity="error" variant="outlined" sx={{ mb: 4, borderRadius: 0, border: 2, fontWeight: 700 }}>{error}</Alert>}

                    <form action={handleSubmit}>
                        <Grid container spacing={4}>

                            {/* Section: Identity */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, textTransform: 'uppercase', borderBottom: 2, borderColor: 'divider', pb: 1, mb: 1 }}>
                                    Official Credentials
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="employeeCode" fullWidth label="Official Employee Code *" placeholder="e.g. EMP-1020-IMC" required variant="outlined" />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="department" select fullWidth label="Assign Department *" defaultValue="" required variant="outlined">
                                    <MenuItem value="" disabled>Select Department</MenuItem>
                                    <MenuItem value="IT Department">IT Department</MenuItem>
                                    <MenuItem value="Revenue">Revenue Collection</MenuItem>
                                    <MenuItem value="Health">Health & Sanitation</MenuItem>
                                    <MenuItem value="Urban Development">Urban Development</MenuItem>
                                    <MenuItem value="Police">Police Administration</MenuItem>
                                    <MenuItem value="Education">Education Board</MenuItem>
                                    <MenuItem value="Public Works">Public Works (PWD)</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="designation" fullWidth label="Current Designation *" placeholder="e.g. Executive Engineer" required variant="outlined" />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="joiningDate" type="date" fullWidth label="Official Date of Joining" InputLabelProps={{ shrink: true }} required variant="outlined" />
                            </Grid>

                            {/* Section: Personal */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, textTransform: 'uppercase', borderBottom: 2, borderColor: 'divider', pb: 1, mb: 1, mt: 2 }}>
                                    Personal Verification
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="firstName" fullWidth label="First Name *" required variant="outlined" />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="lastName" fullWidth label="Last Name *" required variant="outlined" />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="fatherName" fullWidth label="Father's/Guardian's Name *" required variant="outlined" />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField name="dob" type="date" fullWidth label="Date of Birth" InputLabelProps={{ shrink: true }} required variant="outlined" />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField name="bloodGroup" select fullWidth label="Blood Group" defaultValue="" variant="outlined">
                                    <MenuItem value="A+">A+</MenuItem>
                                    <MenuItem value="A-">A-</MenuItem>
                                    <MenuItem value="B+">B+</MenuItem>
                                    <MenuItem value="B-">B-</MenuItem>
                                    <MenuItem value="AB+">AB+</MenuItem>
                                    <MenuItem value="AB-">AB-</MenuItem>
                                    <MenuItem value="O+">O+</MenuItem>
                                    <MenuItem value="O-">O-</MenuItem>
                                </TextField>
                            </Grid>

                            {/* Section: Contact */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, textTransform: 'uppercase', borderBottom: 2, borderColor: 'divider', pb: 1, mb: 1, mt: 2 }}>
                                    Communication
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="email" type="email" fullWidth label="Official Email Address *" required variant="outlined" />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="phone" type="tel" fullWidth label="Mobile Number (WhatsApp Preferred) *" required variant="outlined" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="address" fullWidth label="Permanent Residential Address *" multiline rows={3} required variant="outlined" />
                            </Grid>

                            {/* Section: Photo */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, textTransform: 'uppercase', borderBottom: 2, borderColor: 'divider', pb: 1, mb: 1, mt: 2 }}>
                                    Official Profile Photo
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={4}>
                                    <Box sx={{ width: 120, height: 120, border: 2, borderColor: 'divider', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {photoPreview ? (
                                            <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>NO IMAGE</Typography>
                                        )}
                                    </Box>
                                    <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                                        <Button
                                            component="label"
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<CloudUploadIcon />}
                                            sx={{ mb: 1, height: 48, px: 3 }}
                                        >
                                            SELECT PHOTO
                                            <input type="file" name="photo" hidden accept="image/*" onChange={handlePhotoChange} />
                                        </Button>
                                        <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 600 }}>
                                            REQUIRED: Neutral background. Max 2MB. JPG/PNG format only.
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 4 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    fullWidth
                                    disabled={isSubmitting}
                                    endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                                    sx={{ height: 64, fontSize: '1.2rem', fontWeight: 900 }}
                                >
                                    {isSubmitting ? 'PROCESSING REGISTRATION...' : 'SUBMIT FOR VERIFICATION'}
                                </Button>
                            </Grid>

                        </Grid>
                    </form>
                </Paper>
            </Container>

            {/* Footer */}
            <Box component="footer" sx={{ mt: 'auto', borderTop: 2, borderColor: 'divider', bgcolor: 'background.paper', py: 4, px: 3 }}>
                <Container maxWidth={false} sx={{ maxWidth: 1400, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
                    <Box>
                        <Typography variant="h6">EVMS 2.0</Typography>
                        <Typography variant="caption" color="text.secondary">© 2026 Indore Municipal Corporation. Official Personnel Portal.</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 4 }}>
                        <Link href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>PRIVACY</Link>
                        <Link href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>COMPLIANCE</Link>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
