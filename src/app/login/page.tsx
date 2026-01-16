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
    CircularProgress,
    IconButton
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LoginIcon from '@mui/icons-material/Login';
import LockClockIcon from '@mui/icons-material/LockClock';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Success - Redirect based on response
            if (data.redirect) {
                router.push(data.redirect);
                router.refresh(); // Ensure middleware picks up the cookie
            } else {
                router.push('/');
            }

        } catch (err: any) {
            setError(err.message || 'An error occurred during login');
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', color: 'text.primary' }}>

            {/* Header */}
            <Box component="header" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider', px: { xs: 2, md: 5 }, py: 2, bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ color: 'primary.main', display: 'flex' }}>
                        <VerifiedUserIcon sx={{ fontSize: { xs: 28, md: 32 } }} />
                    </Box>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>Digital Employee Verification System</Typography>
                </Box>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
                    <MuiLink href="#" underline="hover" color="text.primary" fontWeight={500}>Help</MuiLink>
                    <MuiLink href="#" underline="hover" color="text.primary" fontWeight={500}>Contact</MuiLink>
                </Box>
            </Box>

            {/* Main Content */}
            <Box component="main" sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, md: 3 } }}>
                <Paper elevation={3} sx={{ width: '100%', maxWidth: { xs: '100%', sm: 440 }, borderRadius: 3, border: 1, borderColor: 'divider', overflow: 'hidden' }}>

                    {/* Card Header */}
                    <Box sx={{ pt: 4, pb: { xs: 0, md: 2 }, px: { xs: 2, md: 4 }, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'primary.light', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, color: 'primary.main', opacity: 0.2 }}>
                        </Box>
                        <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', mt: 0 }}>
                            <AccountBalanceIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                        </Box>

                        <Typography variant="h5" fontWeight="bold" gutterBottom mt={1} sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>Officer / Admin Login</Typography>
                        <Typography variant="body2" color="text.secondary">Secure access for Nagar Nigam (IMC) staff</Typography>
                    </Box>

                    {/* Form */}
                    <Box component="form" onSubmit={handleLogin} sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3 }}>

                        {error && (
                            <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
                        )}

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
                                            <PersonIcon color="action" />
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: 2, bgcolor: 'background.default' }
                                }}
                            />
                        </Box>

                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2" fontWeight="bold">Password</Typography>
                            </Box>
                            <TextField
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: 2, bgcolor: 'background.default' }
                                }}
                            />
                            <Box sx={{ mt: 1, textAlign: 'right' }}>
                                <MuiLink component={Link} href="/forgot-password" underline="hover" color="primary" variant="body2" fontWeight={600}>Forgot Password?</MuiLink>
                            </Box>
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                            sx={{ mt: 1, borderRadius: 2, height: 48, fontWeight: 700, textTransform: 'none', fontSize: 16 }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>

                        <Alert severity="info" icon={<LockClockIcon fontSize="inherit" />} sx={{ borderRadius: 2, bgcolor: 'rgb(239, 246, 255)', color: 'text.secondary', border: '1px solid rgb(219, 234, 254)' }}>
                            For security purposes, you may be asked to verify your identity.
                        </Alert>

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
