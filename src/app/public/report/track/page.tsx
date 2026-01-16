'use client';

import { Box, Button, Typography, Paper, IconButton, TextField, InputAdornment } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TrackReportPage() {
    const router = useRouter();
    const [reportId, setReportId] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (reportId.trim()) {
            router.push(`/public/report/${reportId.trim()}`);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', alignItems: 'center' }}>

            {/* Mobile Container Wrapper */}
            <Box sx={{ width: '100%', maxWidth: 480, bgcolor: 'background.paper', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: 3 }}>

                {/* Header */}
                <Box component="header" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider', px: 2, py: 2, zIndex: 20, bgcolor: 'background.paper' }}>
                    <IconButton component={Link} href="/public/report" sx={{ color: 'text.primary', bgcolor: 'action.hover' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="subtitle1" fontWeight="bold">Track Status</Typography>
                    <Box sx={{ width: 40 }} />
                </Box>

                {/* Main Content */}
                <Box component="main" sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box sx={{ display: 'inline-flex', p: 2, bgcolor: 'primary.light', borderRadius: '50%', color: 'primary.main', mb: 2 }}>
                            <SearchIcon sx={{ fontSize: 40 }} />
                        </Box>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>Track Your Report</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Enter the Report ID provided during submission to check the current status.
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            fullWidth
                            label="Report ID"
                            placeholder="e.g. SR-2024-8921"
                            value={reportId}
                            onChange={(e) => setReportId(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountBalanceIcon color="action" />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 2 }
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={!reportId.trim()}
                            sx={{ height: 48, borderRadius: 2 }}
                        >
                            Check Status
                        </Button>
                    </Box>

                </Box>
            </Box>
        </Box>
    );
}
