'use client';

import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loading() {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)'
        }}>
            <CircularProgress size={60} thickness={4} sx={{ color: '#064E3B', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" fontWeight="medium">
                Loading EVMS...
            </Typography>
        </Box>
    );
}
