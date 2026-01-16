'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import GlassCard from '@/components/ui/GlassCard';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
            <Container maxWidth="sm">
                <GlassCard sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>

                    <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'error.light', color: 'error.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, opacity: 0.2 }}>
                        <ErrorOutlineIcon sx={{ fontSize: 48, opacity: 1, color: 'error.main' }} />
                    </Box>

                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Something went wrong
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        We encountered an unexpected error while processing your request. Our team has been notified.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Button
                            variant="outlined"
                            startIcon={<HomeIcon />}
                            component={Link}
                            href="/"
                            sx={{ borderRadius: 2, textTransform: 'none' }}
                        >
                            Back Home
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<RefreshIcon />}
                            onClick={reset}
                            sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
                        >
                            Try Again
                        </Button>
                    </Box>

                    {process.env.NODE_ENV === 'development' && (
                        <Box sx={{ mt: 4, p: 2, bgcolor: 'error.lighter', borderRadius: 1, width: '100%', textAlign: 'left' }}>
                            <Typography variant="caption" component="pre" sx={{ overflowX: 'auto', color: 'error.main' }}>
                                {error.message}
                            </Typography>
                        </Box>
                    )}
                </GlassCard>
            </Container>
        </Box>
    );
}
