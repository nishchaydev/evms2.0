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
    InputAdornment
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import MicIcon from '@mui/icons-material/Mic';
import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DownloadReceipt from '../components/DownloadReceipt';
import DuplicateWarning from '../components/DuplicateWarning';
import { checkDuplicateReports } from '@/lib/report-actions';

function ReportSubmitForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const employeeId = searchParams.get('employeeId');
    const employeeName = searchParams.get('employeeName');

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [reportId, setReportId] = useState('');
    const [duplicates, setDuplicates] = useState<any[]>([]);

    // Form Data State
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

        // Only append employeeId if it exists (for specific employee reports)
        if (formData.employeeId) {
            submitData.append('employeeId', formData.employeeId);
        }


        // General Report Routing
        if (!formData.employeeId && formData.department) {
            submitData.append('department', formData.department);
        }

        if (formData.photo) {
            submitData.append('photo', formData.photo);
        }

        // Ideally import createReport at top, but for client component we can import logic or pass via props.
        // Since we can't import server action directly into client component in all setups without specific config,
        // let's assume we imported it. *Adding import in next step*

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
                // Dynamic import to avoid SSR issues if library assumes window
                const imageCompression = (await import('browser-image-compression')).default;

                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true
                };

                const compressedFile = await imageCompression(file, options);
                setFormData({ ...formData, photo: compressedFile });

                // Generate preview from compressed file
                const objectUrl = URL.createObjectURL(compressedFile);
                setPreview(objectUrl);
            } catch (error) {
                console.error("Compression failed:", error);
                // Fallback to original
                setFormData({ ...formData, photo: file });
                setPreview(URL.createObjectURL(file));
            }
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 480, bgcolor: 'background.paper', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: 3 }}>

            {/* Header */}
            <Box component="header" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider', px: 2, py: 2, zIndex: 20, bgcolor: 'background.paper' }}>
                <IconButton onClick={() => router.back()} sx={{ color: 'text.primary', bgcolor: 'action.hover' }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="subtitle1" fontWeight="bold">New Report</Typography>
                <Box sx={{ width: 40 }} />
            </Box>

            {/* Main Content */}
            <Box component="main" sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>

                {/* Success View */}
                {step === 3 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center', gap: 2 }}>
                        <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'success.light', color: 'success.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                            <CheckCircleIcon sx={{ fontSize: 48 }} />
                        </Box>
                        <Typography variant="h5" fontWeight="bold">Report Submitted!</Typography>
                        <Typography variant="body2" color="text.secondary" >
                            Your report ID is <strong>#{reportId}</strong>. You can track its status from the home page.
                        </Typography>

                        <Box sx={{ width: '100%', mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <DownloadReceipt
                                reportId={reportId}
                                category={formData.category}
                                location={formData.location}
                                date={new Date()}
                            />
                            <Button variant="contained" size="large" fullWidth href="/public/report">Return to Home</Button>
                        </Box>
                    </Box>
                )}

                {/* Form View (All Steps Combined) */}
                {step !== 3 && (
                    <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        {/* Pre-fill Banner */}
                        {employeeName && (
                            <Alert severity="warning" sx={{ borderRadius: 3, mb: 3, boxShadow: 1 }}>
                                Reporting against: <strong>{employeeName}</strong>
                            </Alert>
                        )}

                        {/* Department Selection (For General Reports) */}
                        {!employeeId && (
                            <Paper elevation={0} sx={{ mb: 3, p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">Target Department</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Since you are not reporting a specific employee, please select the relevant department.
                                </Typography>
                                <TextField
                                    select
                                    label="Select Department *"
                                    fullWidth
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                >
                                    <MenuItem value="Health">Health (Sanitation)</MenuItem>
                                    <MenuItem value="Water">Water Works</MenuItem>
                                    <MenuItem value="Revenue">Revenue</MenuItem>
                                    <MenuItem value="Engineering">Engineering (Roads)</MenuItem>
                                    <MenuItem value="Town Planning">Town Planning</MenuItem>
                                    <MenuItem value="Fire">Fire Brigade</MenuItem>
                                    <MenuItem value="General">General Administration</MenuItem>
                                </TextField>
                            </Paper>
                        )}

                        {/* Section 1: Issue Details */}
                        <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
                            <Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">1. Issue Details</Typography>
                                <Typography variant="body2" color="text.secondary">Categorize and describe the problem you're facing.</Typography>
                            </Box>

                            <TextField
                                select
                                label="Category *"
                                fullWidth
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            >
                                <MenuItem value="sanitation">Sanitation & Garbage</MenuItem>
                                <MenuItem value="water">Water Supply</MenuItem>
                                <MenuItem value="roads">Roads & Potholes</MenuItem>
                                <MenuItem value="electricity">Street Lights / Electricity</MenuItem>
                                <MenuItem value="encroachment">Illegal Encroachment</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </TextField>

                            <TextField
                                label="Description *"
                                multiline
                                rows={4}
                                fullWidth
                                placeholder="Describe the issue in detail..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                                        recognition.onerror = (event: any) => {
                                                            console.error('Speech recognition error', event.error);
                                                        };
                                                    } else {
                                                        alert('Voice input is not supported in this browser.');
                                                    }
                                                }}
                                                edge="end"
                                                title="Speak Description"
                                                sx={{ mb: 8 }} // Align with top
                                            >
                                                <MicIcon color="primary" />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Paper>

                        {/* Section 2: Location & Evidence */}
                        <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                            <Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">2. Location & Evidence</Typography>
                                <Typography variant="body2" color="text.secondary">Where did this happen? Adding a photo helps resolve issues faster.</Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Location</Typography>
                                <CustomTextField
                                    fullWidth
                                    placeholder="Enter address or landmark"
                                    value={formData.location}
                                    onChange={(e: any) => setFormData({ ...formData, location: e.target.value })}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                                                (error) => {
                                                                    console.error('Error getting location:', error);
                                                                    alert('Could not fetch location. Please enter manually.');
                                                                }
                                                            );
                                                        } else {
                                                            alert('Geolocation is not supported by your browser.');
                                                        }
                                                    }}
                                                    edge="end"
                                                    title="Use Current Location"
                                                >
                                                    <MyLocationIcon color="primary" />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Photo Evidence</Typography>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        height: 160,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: 'rgba(0,0,0,0.02)',
                                        borderStyle: 'dashed',
                                        borderWidth: 2,
                                        borderRadius: 3,
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
                                        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <Box sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                bgcolor: 'rgba(0,0,0,0.5)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                opacity: 0,
                                                transition: '0.2s',
                                                '&:hover': { opacity: 1 }
                                            }}>
                                                <AddPhotoAlternateIcon sx={{ color: 'white', mb: 1, fontSize: 32 }} />
                                                <Typography variant="body2" fontWeight="bold" color="white">
                                                    Change Photo
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ) : (
                                        <>
                                            <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'primary.light', color: 'primary.main', mb: 1, opacity: 0.2 }}>
                                                <AddPhotoAlternateIcon sx={{ fontSize: 32 }} />
                                            </Box>
                                            <Typography variant="body2" fontWeight="bold" color="text.primary">Click to upload photo</Typography>
                                            <Typography variant="caption" color="text.secondary">or drag and drop</Typography>
                                        </>
                                    )}
                                </Paper>
                            </Box>
                        </Paper>



                        {/* Duplicate Warning */}
                        <DuplicateWarning duplicates={duplicates} />

                        {/* Action Bar */}
                        <Box sx={{ pt: 2, pb: 4 }}>
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={loading || !formData.category || !formData.description || (!employeeId && !formData.department)}
                                onClick={handleSubmit}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                                sx={{ py: 2, borderRadius: 3, fontWeight: 'bold', fontSize: '1.1rem', boxShadow: 4 }}
                            >
                                {loading ? 'Submitting Report...' : 'Submit Report'}
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box >
    );

}

// Wrapper for custom styling consistency if needed
function CustomTextField(props: any) {
    return <TextField {...props} variant="outlined" size="medium" />;
}

export default function ReportSubmitPage() {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc', alignItems: 'center' }}>
            <Suspense fallback={<CircularProgress />}>
                <ReportSubmitForm />
            </Suspense>
        </Box>
    );
}
