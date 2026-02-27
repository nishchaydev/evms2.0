'use client';

// Official Login Page - Refreshed for routing fix

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
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LoginIcon from '@mui/icons-material/Login';
import LockClockIcon from '@mui/icons-material/LockClock';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useColorMode } from '@/theme/ThemeContext';

export default function LoginPage() {
    const { mode } = useColorMode();
    const isLight = mode === 'light';
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

            if (data.redirect) {
                router.push(data.redirect);
                router.refresh();
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

            {/* Header - Official Style */}
            <Box component="header" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 2, borderColor: 'divider', px: { xs: 2, md: 5 }, py: 2, bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AccountBalanceIcon color="primary" sx={{ fontSize: { xs: 28, md: 32 } }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                        Govt. of Madhya Pradesh
                    </Typography>
                </Box>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <MuiLink sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.875rem' }}>BACK TO HOME</MuiLink>
                    </Link>
                </Box>
            </Box>

            {/* Main Content */}
            <Box component="main" sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, md: 3 } }}>
                <Paper elevation={0} sx={{ width: '100%', maxWidth: 440, border: 2, borderColor: 'divider' }}>

                    {/* Card Header */}
                    <Box sx={{ pt: 6, pb: 2, px: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ width: 80, height: 80, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, color: '#fff' }}>
                            <AccountBalanceIcon sx={{ fontSize: 40 }} />
                        </Box>

                        <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, textTransform: 'uppercase' }}>Officer Login</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Secure access for Nagar Nigam Indore (IMC)</Typography>
                    </Box>

                    {/* Form */}
                    <Box component="form" onSubmit={handleLogin} sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>

                        {error && (
                            <Alert severity="error" sx={{ borderRadius: 0, fontWeight: 700 }}>{error}</Alert>
                        )}

                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 1, mb: 1, display: 'block', textTransform: 'uppercase' }}>Username</Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter your username"
                                variant="outlined"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: 1, mb: 1, display: 'block', textTransform: 'uppercase' }}>Password</Typography>
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
                                }}
                            />
                            <Box sx={{ mt: 1, textAlign: 'right' }}>
                                <Link href="/forgot-password" style={{ textDecoration: 'none' }}>
                                    <MuiLink sx={{ color: 'primary.main', fontWeight: 800, fontSize: '0.75rem', letterSpacing: 0.5 }}>FORGOT PASSWORD?</MuiLink>
                                </Link>
                            </Box>
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                            sx={{ mt: 2, height: 56 }}
                        >
                            {loading ? 'Logging in...' : 'Official Login'}
                        </Button>

                        <Alert severity="info" icon={<LockClockIcon fontSize="inherit" />} sx={{ borderRadius: 0, mt: 2, bgcolor: isLight ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.1)', color: 'text.secondary', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                            For security purposes, you may be asked for location verification.
                        </Alert>

                    </Box>
                </Paper>
            </Box>

            {/* Footer */}
            <Box component="footer" sx={{ borderTop: 2, borderColor: 'divider', py: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    © 2026 Indore Municipal Corporation (IMC). Official Release.
                </Typography>
            </Box>

        </Box>
    );
}
