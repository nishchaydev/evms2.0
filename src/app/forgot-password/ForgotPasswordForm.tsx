'use client';

import {
    Box,
    Typography,
    Button,
    Paper,
    TextField,
    InputAdornment,
    Link as MuiLink,
    Alert,
    CircularProgress
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';
import Link from 'next/link';
interface ForgotPasswordFormProps {
    onSubmit: (username: string) => Promise<{ success: boolean; message?: string }>;
}

export default function ForgotPasswordPage({ onSubmit }: ForgotPasswordFormProps) {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await onSubmit(username);

            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.message || 'An error occurred.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                <Paper elevation={3} sx={{ width: '100%', maxWidth: 440, borderRadius: 3, border: 1, borderColor: 'divider', overflow: 'hidden' }}>

                    {/* Card Header */}
                    <Box sx={{ pt: 4, pb: 2, px: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'warning.light', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, color: 'warning.main', opacity: 0.2 }}>
                        </Box>
                        <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', mt: 0 }}>
                            <VpnKeyIcon sx={{ fontSize: 32, color: 'warning.main' }} />
                        </Box>

                        <Typography variant="h5" fontWeight="bold" gutterBottom mt={1}>Reset Password</Typography>
                        <Typography variant="body2" color="text.secondary">Enter your username to request a password reset from the Administrator.</Typography>
                    </Box>

                    {/* Form */}
                    <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>

                        {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ borderRadius: 2 }}>Request Sent! Please contact the Super Admin to receive your new password.</Alert>}

                        {!success && (
                            <>
                                <Box>
                                    <Typography variant="body2" fontWeight="bold" gutterBottom>Username</Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter your username"
                                        variant="outlined"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccountCircleIcon color="action" />
                                                </InputAdornment>
                                            ),
                                            sx: { borderRadius: 2, bgcolor: 'background.default' }
                                        }}
                                    />
                                </Box>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    disabled={loading || !username.trim()}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                                    sx={{ mt: 1, borderRadius: 2, height: 48, fontWeight: 700, textTransform: 'none', fontSize: 16 }}
                                >
                                    {loading ? 'Sending Request...' : 'Send Request'}
                                </Button>
                            </>
                        )}

                        <Box sx={{ textAlign: 'center' }}>
                            <MuiLink component={Link} href="/login" underline="hover" color="text.secondary" variant="body2" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                                <ArrowBackIcon fontSize="inherit" /> Back to Login
                            </MuiLink>
                        </Box>

                    </Box>

                </Paper>
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
