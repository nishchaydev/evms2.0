'use client';

export const dynamic = 'force-dynamic';

import {
    Box,
    Typography,
    Button,
    Paper,
    TextField,
    Link as MuiLink,
    Alert,
    CircularProgress,
    IconButton
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LockClockIcon from '@mui/icons-material/LockClock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function OTPForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || 'your email';

    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) value = value[0]; // restricted to 1 char
        if (!/^\d*$/.test(value)) return; // only numbers

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto move to next focus
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 4) {
            setError('Please enter the 4-digit code.');
            return;
        }

        setError('');
        setLoading(true);

        // Mock verification
        setTimeout(() => {
            setLoading(false);
            if (otpValue === '1234') {
                setSuccess(true);
                setTimeout(() => {
                    // Redirect to login or reset password page
                    router.push('/login');
                }, 1500);
            } else {
                setError('Invalid code. Try 1234.');
            }
        }, 1500);
    };

    return (
        <Paper elevation={3} sx={{ width: '100%', maxWidth: 440, borderRadius: 3, border: 1, borderColor: 'divider', overflow: 'hidden' }}>

            {/* Card Header */}
            <Box sx={{ pt: 4, pb: 2, px: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'success.light', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, color: 'success.main', opacity: 0.2 }}>
                </Box>
                <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', mt: 0 }}>
                    <LockClockIcon sx={{ fontSize: 32, color: 'success.main' }} />
                </Box>

                <Typography variant="h5" fontWeight="bold" gutterBottom mt={1}>Enter OTP</Typography>
                <Typography variant="body2" color="text.secondary">
                    We have sent a 4-digit code to <Typography component="span" fontWeight="bold" color="text.primary">{email}</Typography>
                </Typography>
            </Box>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>

                {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ borderRadius: 2 }}>Verified! Redirecting...</Alert>}

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    {otp.map((digit, index) => (
                        <TextField
                            key={index}
                            inputRef={el => { inputRefs.current[index] = el }}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            variant="outlined"
                            placeholder="-"
                            inputProps={{
                                style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' },
                                maxLength: 1
                            }}
                            sx={{ width: 56, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                    ))}
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading || success}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    sx={{ mt: 1, borderRadius: 2, height: 48, fontWeight: 700, textTransform: 'none', fontSize: 16 }}
                >
                    {loading ? 'Verifying...' : 'Verify & Proceed'}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Didn't receive the code? <MuiLink href="#" underline="hover" fontWeight="bold">Resend</MuiLink>
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <MuiLink component={Link} href="/forgot-password" underline="hover" color="text.secondary" variant="body2" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                            <ArrowBackIcon fontSize="inherit" /> Change Email
                        </MuiLink>
                    </Box>
                </Box>

            </Box>

        </Paper>
    );
}

export default function OTPPage() {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', color: 'text.primary' }}>
            {/* Header */}
            <Box component="header" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider', px: { xs: 3, md: 5 }, py: 2, bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ color: 'primary.main', display: 'flex' }}>
                        <VerifiedUserIcon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="subtitle1" fontWeight="bold">Digital Employee Verification System</Typography>
                </Box>
            </Box>

            {/* Main Content */}
            <Box component="main" sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
                <Suspense fallback={<CircularProgress />}>
                    <OTPForm />
                </Suspense>
            </Box>

            {/* Footer */}
            <Box component="footer" sx={{ py: 3, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    © 2024 Nagar Nigam (IMC). All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
}
