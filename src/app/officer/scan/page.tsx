'use client';

import { Box, Typography, Button, Paper, Container, IconButton, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import InfoIcon from '@mui/icons-material/Info';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function OfficerScanPage() {
    const router = useRouter();
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [error, setError] = useState<string>('');

    const handleScan = (detectedCodes: any[]) => {
        if (detectedCodes && detectedCodes.length > 0) {
            const data = detectedCodes[0];
            const rawValue = data.rawValue;

            if (rawValue) {
                // The QR code contains a full URL like "http://localhost:3000/verify/TOKEN"
                // We want to extract the path and redirect.
                try {
                    // If it's a URL
                    if (rawValue.startsWith('http')) {
                        const url = new URL(rawValue);
                        // Check if it's our valid verify path
                        if (url.pathname.startsWith('/verify/')) {
                            setScanResult(rawValue);
                            router.push(url.pathname);
                            return;
                        }
                    }

                    // Fallback: If it's just the token alone (e.g. legacy or testing)
                    // We assume it's a token
                    // router.push(`/verify/${rawValue}`);

                } catch (e) {
                    console.error("Scan Error", e);
                }
            }
        }
    };

    const handleError = (err: any) => {
        // console.error(err);
        // Supress constant permission errors if permissions denied initially
        setError('Camera access required. Please allow permissions.');
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>

            {/* Header */}
            <Box component="header" sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, zIndex: 100 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ p: 1, bgcolor: 'primary.light', color: 'primary.main', borderRadius: 1, display: 'flex' }}>
                        <AccountBalanceIcon />
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>Officer Verification Portal</Typography>
                        <Typography variant="caption" color="text.secondary">Nagar Nigam (IMC)</Typography>
                    </Box>
                </Box>
                <Button
                    startIcon={<ArrowBackIcon />}
                    component={Link}
                    href="/officer"
                    sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'action.hover' } }}
                >
                    Back to Dashboard
                </Button>
            </Box>

            {/* Main Content */}
            <Container maxWidth="sm" sx={{ flex: 1, pt: 4, pb: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>Scan Employee ID</Typography>
                    <Typography variant="body1" color="text.secondary">Align the QR code within the frame below to instantly verify employee details and access their record.</Typography>
                </Box>

                {/* Scanner Placeholder */}
                <Paper
                    elevation={4}
                    sx={{
                        position: 'relative',
                        aspectRatio: '4/3',
                        width: '100%',
                        bgcolor: 'black',
                        borderRadius: 4,
                        overflow: 'hidden',
                        border: '4px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Scanner
                        onScan={handleScan}
                        onError={(error: unknown) => {
                            console.error(error);
                            const msg = error instanceof Error ? error.message : 'Camera error';
                            setError(msg);
                        }}
                        components={{
                            onOff: true
                        }}
                        constraints={{
                            // Removed facingMode to allow default camera (works better on laptops)
                        }}
                    />


                    {/* Overlay Frame (Visual Guide) */}
                    <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ width: 260, height: 260, position: 'relative', border: '2px solid rgba(255,255,255,0.3)', borderRadius: 2 }}>
                            {/* Corners */}
                            <Box sx={{ position: 'absolute', top: -2, left: -2, width: 40, height: 40, borderLeft: '6px solid', borderTop: '6px solid', borderColor: 'primary.main', borderRadius: '8px 0 0 0' }} />
                            <Box sx={{ position: 'absolute', top: -2, right: -2, width: 40, height: 40, borderRight: '6px solid', borderTop: '6px solid', borderColor: 'primary.main', borderRadius: '0 8px 0 0' }} />
                            <Box sx={{ position: 'absolute', bottom: -2, left: -2, width: 40, height: 40, borderLeft: '6px solid', borderBottom: '6px solid', borderColor: 'primary.main', borderRadius: '0 0 0 8px' }} />
                            <Box sx={{ position: 'absolute', bottom: -2, right: -2, width: 40, height: 40, borderRight: '6px solid', borderBottom: '6px solid', borderColor: 'primary.main', borderRadius: '0 0 8px 0' }} />

                            {/* Laser Line */}
                            <Box sx={{ position: 'absolute', top: '50%', left: 10, right: 10, height: '2px', bgcolor: 'error.main', boxShadow: '0 0 8px red', opacity: 0.8 }} />
                        </Box>
                    </Box>

                    {/* Live Badge */}
                    <Box sx={{ position: 'absolute', top: 20, width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <Box sx={{ bgcolor: 'rgba(0,0,0,0.6)', color: 'white', px: 2, py: 0.5, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 1, fontSize: 12, fontWeight: 'bold', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <Box sx={{ width: 8, height: 8, bgcolor: 'success.main', borderRadius: '50%' }} />
                            SCANNING ACTIVE
                        </Box>
                    </Box>
                </Paper>

                {error && (
                    <Alert severity="error" onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}


                {/* Instructions */}
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'primary.light', color: 'text.primary', display: 'flex', gap: 2, alignItems: 'start', borderRadius: 3, border: 1, borderColor: 'primary.main', opacity: 0.8 }}>
                    <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: '50%', color: 'primary.main' }}>
                        <InfoIcon />
                    </Box>
                    <Box>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Verification Instructions</Typography>
                        <Typography variant="body2" color="text.secondary">Only scan valid Nagar Nigam issued ID cards. Ensure adequate lighting and hold the ID steady for 2-3 seconds for automatic detection.</Typography>
                    </Box>
                </Paper>

            </Container>

            {/* Footer */}
            <Box component="footer" sx={{ py: 3, textAlign: 'center', borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Typography variant="caption" fontWeight="bold" display="block" color="text.secondary" sx={{ letterSpacing: 1, mb: 0.5 }}>GOVERNMENT OF INDIA</Typography>
                <Typography variant="caption" color="text.secondary">© 2024 Nagar Nigam Digital Services. Secure Officer Portal.</Typography>
            </Box>

        </Box >
    );
}
