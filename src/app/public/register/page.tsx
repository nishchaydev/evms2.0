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
    Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from 'react';
import { registerEmployeeSelf } from '@/lib/register-actions';
import Image from 'next/image';

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
            <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold" gutterBottom>Registration Successful</Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Your details have been submitted successfully.
                        Your account is currently <strong>PENDING verification</strong>.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 4 }}>
                        Please contact your Nodal Officer or the IT Department with your Employee Code for approval.
                    </Typography>
                    <Button variant="outlined" href="/" sx={{ borderRadius: 2 }}>Return to Home</Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F4F6F8', py: 4 }}>
            <Container maxWidth="md">
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" color="primary">Employee Registration</Typography>
                    <Typography variant="body1" color="text.secondary">Enter your details to register for the Employee Management System.</Typography>
                </Box>

                <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    <form action={handleSubmit}>
                        <Grid container spacing={3}>

                            {/* Section: Identity */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ color: 'text.secondary', letterSpacing: 1, fontWeight: 'bold', borderBottom: 1, borderColor: 'divider', pb: 1, mb: 1 }}>
                                    OFFICIAL DETAILS
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="employeeCode" fullWidth label="Employee Code (Unique ID)" placeholder="e.g. EMP1020" required variant="outlined" />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="department" select fullWidth label="Department" defaultValue="" required>
                                    <MenuItem value="" disabled>Select Department</MenuItem>
                                    <MenuItem value="IT Department">IT Department</MenuItem>
                                    <MenuItem value="Revenue">Revenue</MenuItem>
                                    <MenuItem value="Health">Health</MenuItem>
                                    <MenuItem value="Urban Development">Urban Development</MenuItem>
                                    <MenuItem value="Police">Police</MenuItem>
                                    <MenuItem value="Education">Education</MenuItem>
                                    <MenuItem value="Public Works">Public Works</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="designation" fullWidth label="Designation" placeholder="e.g. Junior Assistant" required />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="joiningDate" type="date" fullWidth label="Date of Joining" InputLabelProps={{ shrink: true }} required />
                            </Grid>

                            {/* Section: Personal */}
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: 'text.secondary', letterSpacing: 1, fontWeight: 'bold', borderBottom: 1, borderColor: 'divider', pb: 1, mb: 1 }}>
                                    PERSONAL INFORMATION
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="firstName" fullWidth label="First Name" required />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="lastName" fullWidth label="Last Name" required />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="fatherName" fullWidth label="Father's Name" required />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField name="dob" type="date" fullWidth label="Date of Birth" InputLabelProps={{ shrink: true }} required />
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <TextField name="bloodGroup" select fullWidth label="Blood Group" defaultValue="">
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
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: 'text.secondary', letterSpacing: 1, fontWeight: 'bold', borderBottom: 1, borderColor: 'divider', pb: 1, mb: 1 }}>
                                    CONTACT DETAILS
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="email" type="email" fullWidth label="Email Address" required />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="phone" type="tel" fullWidth label="Mobile Number" required />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="address" fullWidth label="Current Address" multiline rows={2} required />
                            </Grid>

                            {/* Section: Photo */}
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: 'text.secondary', letterSpacing: 1, fontWeight: 'bold', borderBottom: 1, borderColor: 'divider', pb: 1, mb: 1 }}>
                                    PROFILE PHOTO
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" alignItems="center" spacing={3}>
                                    <Box sx={{ width: 100, height: 100, borderRadius: 2, border: '1px dashed grey', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', bgcolor: '#f0f0f0' }}>
                                        {photoPreview ? (
                                            <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <Typography variant="caption" color="text.secondary">No Image</Typography>
                                        )}
                                    </Box>
                                    <Box>
                                        <Button
                                            component="label"
                                            variant="outlined"
                                            startIcon={<CloudUploadIcon />}
                                            sx={{ mb: 1 }}
                                        >
                                            Upload Photo
                                            <input type="file" name="photo" hidden accept="image/*" onChange={handlePhotoChange} />
                                        </Button>
                                        <Typography variant="caption" display="block" color="text.secondary">
                                            Max size: 2MB. Formats: JPG, PNG.
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 4 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    disabled={isSubmitting}
                                    endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                                    sx={{ py: 1.5, fontSize: '1.1rem', borderRadius: 2 }}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Register Now'}
                                </Button>
                            </Grid>

                        </Grid>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
}
