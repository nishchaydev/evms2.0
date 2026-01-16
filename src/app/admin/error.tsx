'use client';

import { Box, Typography, Button, Paper } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useEffect } from 'react';

export default function AdminError({
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
        <Box sx={{ p: 4, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper
                elevation={0}
                sx={{
                    p: 5,
                    textAlign: 'center',
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    maxWidth: 500
                }}
            >
                <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'error.lighter',
                    color: 'error.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                }}>
                    <ReportProblemIcon sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Something went wrong!
                </Typography>
                <Typography color="text.secondary" paragraph>
                    {error.message || "An unexpected error occurred while loading this page."}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
                    <Button variant="outlined" onClick={() => window.location.reload()}>
                        Reload Page
                    </Button>
                    <Button variant="contained" onClick={() => reset()}>
                        Try Again
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
