'use client';

import Link from 'next/link';
import { Box, Container, Typography, Button } from '@mui/material';
import { ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';

export default function NotFound() {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
            <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
                <ErrorOutlineIcon color="disabled" sx={{ fontSize: 80, mb: 2, opacity: 0.5 }} />
                <Typography variant="h2" fontWeight="bold" gutterBottom color="text.primary">
                    404
                </Typography>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                    Page Not Found
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </Typography>
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" size="large">
                        Return to Homepage
                    </Button>
                </Link>
            </Container>
        </Box>
    );
}
