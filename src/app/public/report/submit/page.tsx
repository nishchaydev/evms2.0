'use client';

import {
    Box,
    Button,
    Typography,
    Paper,
    IconButton,
    TextField,
    MenuItem,
    LinearProgress,
    CircularProgress,
    Alert,
    Divider,
    InputAdornment,
    Container
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import MicIcon from '@mui/icons-material/Mic';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DownloadReceipt from '../components/DownloadReceipt';
import DuplicateWarning from '../components/DuplicateWarning';
import { checkDuplicateReports } from '@/lib/report-actions';
import Link from 'next/link';

function ReportSubmitForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const employeeId = searchParams.get('employeeId');
    const employeeName = searchParams.get('employeeName');

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [reportId, setReportId] = useState('');
    const [duplicates, setDuplicates] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        category: '',
        description: '',
        location: '',
        photo: null as File | null,
        employeeId: employeeId || '',
        department: ''
    });

    const handleSubmit = async () => {
        setLoading(true);

        const submitData = new FormData();
        submitData.append('category', formData.category);
        submitData.append('description', formData.description);
        submitData.append('location', formData.location);

        if (formData.employeeId) {
            submitData.append('employeeId', formData.employeeId);
        }

        if (!formData.employeeId && formData.department) {
            submitData.append('department', formData.department);
        }

        if (formData.photo) {
            submitData.append('photo', formData.photo);
        }

        try {
            const { createReport } = await import('@/lib/report-actions');
            const result = await createReport(submitData);

            if (result.success) {
                setReportId(result.reportId || 'PENDING');
                setStep(3);
            } else {
                alert('Failed to submit report. Please try again.');
            }
        } catch (e) {
            console.error(e);
            alert('An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const [preview, setPreview] = useState<string | null>(null);

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try {
                const imageCompression = (await import('browser-image-compression')).default;
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true
                };
                const compressedFile = await imageCompression(file, options);
                setFormData({ ...formData, photo: compressedFile });
                const objectUrl = URL.createObjectURL(compressedFile);
                setPreview(objectUrl);
            } catch (error) {
                console.error("Compression failed:", error);
                setFormData({ ...formData, photo: file });
                setPreview(URL.createObjectURL(file));
            }
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', color: 'text.primary' }}>

            {/* Top Navigation */}
            <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 1100, bgcolor: 'background.paper', borderBottom: 2, borderColor: 'divider', px: { xs: 2, md: 5 }, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/public/report" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ArrowBackIcon color="primary" />
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Public Reporting</Typography>
                    </Box>
                </Link>
                <Box>
                    <AccountBalanceIcon color="primary" sx={{ fontSize: 24 }} />
                </Box>
            </Box>

            <Container maxWidth="md" sx={{ flex: 1, py: { xs: 4, md: 8 } }}>

                {/* Success View */}
                {step === 3 && (
                    <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 4 }}>
                        <Box sx={{ width: 100, height: 100, border: 4, borderColor: 'success.main', color: 'success.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircleIcon sx={{ fontSize: 64 }} />
                        </Box>
                        <Box>
                            <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>Submission Successful</Typography>
                            <Typography variant="h6" color="text.secondary">Official Report ID: <strong>{reportId}</strong></Typography>
                        </Box>

                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
                            Your grievance has been registered in the secure government database. You can use the ID above to track the real-time resolution process.
                        </Typography>

                        <Paper elevation={0} sx={{ width: '100%', maxWidth: 500, p: 4, border: 2, borderColor: 'divider', display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <DownloadReceipt
                                reportId={reportId}
                                category={formData.category}
                                location={formData.location}
                                date={new Date()}
                            />
                            <Divider />
                            <Link href="/public/report" style={{ textDecoration: 'none' }}>
                                <Button variant="contained" color="primary" size="large" fullWidth>Return to Portal</Button>
                            </Link>
                        </Paper>
                    </Box>
                )}

                {/* Form View */}
                {step !== 3 && (
                    <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>

                        <Box>
                            <Typography variant="overline" color="primary">Official Submission</Typography>
                            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>File New Registry</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
                                Provide accurate details and photographic evidence to ensure efficient processing by the Nagpur Nigam Indore administration.
                            </Typography>
                        </Box>

                        {employeeName && (
                            <Alert severity="warning" variant="outlined" sx={{ borderRadius: 0, border: 2, fontWeight: 700 }}>
                                FILING REPORT AGAINST: <strong>{employeeName}</strong>
                            </Alert>
                        )}

                        {/* Section: Context */}
                        {!employeeId && (
                            <Paper elevation={0} sx={{ p: 4, border: 2, borderColor: 'divider' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3, textTransform: 'uppercase' }}>Target Department</Typography>
                                <TextField
                                    select
                                    label="Select Jurisdiction *"
                                    fullWidth
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    variant="outlined"
                                >
                                    <MenuItem value="Health">Health & Sanitation</MenuItem>
                                    <MenuItem value="Water">Water Supply</MenuItem>
                                    <MenuItem value="Revenue">Revenue Collection</MenuItem>
                                    <MenuItem value="Engineering">Engineering & Roads</MenuItem>
                                    <MenuItem value="Town Planning">Town Planning</MenuItem>
                                    <MenuItem value="Fire">Fire Brigade</MenuItem>
                                    <MenuItem value="General">General Administration</MenuItem>
                                </TextField>
                            </Paper>
                        )}

                        {/* Section 1: Issue Details */}
                        <Paper elevation={0} sx={{ p: 4, border: 2, borderColor: 'divider', display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>1. Incident Details</Typography>

                            <TextField
                                select
                                label="Complaint Category *"
                                fullWidth
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                variant="outlined"
                            >
                                <MenuItem value="sanitation">Sanitation & Waste Management</MenuItem>
                                <MenuItem value="water">Water Supply Issues</MenuItem>
                                <MenuItem value="roads">Infrastructure & Potholes</MenuItem>
                                <MenuItem value="electricity">Street Lighting & Utilities</MenuItem>
                                <MenuItem value="encroachment">Illegal Encroachment</MenuItem>
                                <MenuItem value="other">Other Official Matters</MenuItem>
                            </TextField>

                            <TextField
                                label="Detailed Description *"
                                multiline
                                rows={5}
                                fullWidth
                                placeholder="Provide comprehensive details regarding the incident..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => {
                                                    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                                                    if (SpeechRecognition) {
                                                        const recognition = new SpeechRecognition();
                                                        recognition.lang = 'en-US';
                                                        recognition.start();
                                                        recognition.onresult = (event: any) => {
                                                            const transcript = event.results[0][0].transcript;
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                description: prev.description ? `${prev.description} ${transcript}` : transcript
                                                            }));
                                                        };
                                                    } else {
                                                        alert('Voice input is not supported in this browser.');
                                                    }
                                                }}
                                                sx={{ mb: 'auto', mt: 1 }}
                                            >
                                                <MicIcon color="primary" />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Paper>

                        {/* Section 2: Location & Evidence */}
                        <Paper elevation={0} sx={{ p: 4, border: 2, borderColor: 'divider', display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>2. Evidence & Location</Typography>

                            <Box>
                                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', mb: 1, display: 'block' }}>Incident Location</Typography>
                                <TextField
                                    fullWidth
                                    placeholder="GPS Coordinates or Landmark"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => {
                                                        if ('geolocation' in navigator) {
                                                            navigator.geolocation.getCurrentPosition(
                                                                (position) => {
                                                                    const { latitude, longitude } = position.coords;
                                                                    setFormData(prev => ({ ...prev, location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` }));
                                                                },
                                                                () => alert('Could not fetch location.')
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <MyLocationIcon color="primary" />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Box>

                            <Box>
                                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', mb: 1, display: 'block' }}>Photographic Proof</Typography>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        height: 200,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: 'rgba(0,0,0,0.02)',
                                        borderStyle: formData.photo ? 'solid' : 'dashed',
                                        borderWidth: 2,
                                        borderRadius: 0,
                                        cursor: 'pointer',
                                        position: 'relative',
                                        borderColor: formData.photo ? 'success.main' : 'divider',
                                        overflow: 'hidden',
                                        transition: 'all 0.2s',
                                        '&:hover': { bgcolor: 'rgba(0,0,0,0.04)', borderColor: 'primary.main' }
                                    }}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }}
                                        onChange={handlePhotoChange}
                                    />
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <>
                                            <AddPhotoAlternateIcon sx={{ fontSize: 48, color: 'divider', mb: 1 }} />
                                            <Typography variant="body2" sx={{ fontWeight: 800 }}>UPLOAD IMAGE</Typography>
                                            <Typography variant="caption" color="text.secondary">DRAG & DROP OR CLICK TO BROWSE</Typography>
                                        </>
                                    )}
                                </Paper>
                            </Box>
                        </Paper>

                        <DuplicateWarning duplicates={duplicates} />

                        <Box sx={{ pt: 2, pb: 8 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                                disabled={loading || !formData.category || !formData.description || (!employeeId && !formData.department)}
                                onClick={handleSubmit}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                                sx={{ height: 64, fontWeight: 900, fontSize: '1.2rem' }}
                            >
                                {loading ? 'PROCESSING SUBMISSION...' : 'SUBMIT OFFICIAL REPORT'}
                            </Button>
                        </Box>
                    </Box>
                )}
            </Container>

            {/* Footer */}
            <Box component="footer" sx={{ mt: 'auto', borderTop: 2, borderColor: 'divider', bgcolor: 'background.paper', py: 4, px: 3 }}>
                <Container maxWidth={false} sx={{ maxWidth: 1400, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
                    <Box>
                        <Typography variant="h6">EVMS 2.0</Typography>
                        <Typography variant="caption" color="text.secondary">© 2026 Indore Municipal Corporation. Official Registry Service.</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 4 }}>
                        <Typography component={Link} href="#" variant="body2" sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>LEGAL</Typography>
                        <Typography component={Link} href="#" variant="body2" sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>SUPPORT</Typography>
                    </Box>
                </Container>
            </Box>
        </Box >
    );
}

export default function ReportSubmitPage() {
    return (
        <Suspense fallback={<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><CircularProgress color="primary" /></Box>}>
            <ReportSubmitForm />
        </Suspense>
    );
}
