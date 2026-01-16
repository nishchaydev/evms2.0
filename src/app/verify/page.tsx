'use client';

import { Box, Button, Container, Typography, Paper, IconButton, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HelpIcon from '@mui/icons-material/Help';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function VerifyPage() {
    const router = useRouter();
    const [error, setError] = useState<string>('');

    const handleScan = (detectedCodes: any[]) => {
        if (detectedCodes && detectedCodes.length > 0) {
            const data = detectedCodes[0];
            const rawValue = data.rawValue;

            if (rawValue) {
                try {
                    // If it's a URL
                    if (rawValue.startsWith('http')) {
                        const url = new URL(rawValue);
                        if (url.pathname.startsWith('/verify/')) {
                            router.push(url.pathname);
                            return;
                        }
                    }
                    // Fallback for direct token
                    router.push(`/verify/${rawValue}`);
                } catch (e) {
                    console.error("Scan Error", e);
                }
            }
        }
    };

    const handleError = (err: any) => {
        setError('Camera access is required to scan ID cards. Please allow permissions.');
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', alignItems: 'center' }}>

            {/* Mobile Container Wrapper */}
            <Box sx={{ width: '100%', maxWidth: 480, bgcolor: 'background.paper', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: 3 }}>

                {/* Header */}
                <Box component="header" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider', px: 2, py: 2, zIndex: 20, bgcolor: 'background.paper' }}>
                    <IconButton component={Link} href="/" sx={{ color: 'text.primary', bgcolor: 'action.hover' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'rgba(31, 137, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main' }}>
                            <AccountBalanceIcon sx={{ fontSize: 20 }} />
                        </Box>
                        <Typography variant="subtitle1" fontWeight="bold">Nagar Nigam (IMC)</Typography>
                    </Box>
                    <Box sx={{ width: 40 }} /> {/* Spacer */}
                </Box>

                {/* Main Content */}
                <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>

                    {/* Page Title */}
                    <Box sx={{ px: 3, pt: 4, pb: 3, textAlign: 'center', zIndex: 10 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom color="text.primary">Scan QR Code</Typography>
                        <Typography variant="body2" color="text.secondary">Verify official government employees</Typography>
                    </Box>

                    {/* Camera Viewport */}
                    <Box sx={{ flex: 1, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>

                        {/* Camera Frame */}
                        <Box sx={{
                            position: 'relative',
                            width: '100%',
                            aspectRatio: '3/4',
                            maxHeight: 500,
                            bgcolor: 'grey.900',
                            borderRadius: 4,
                            overflow: 'hidden',
                            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {/* Scanner Component */}
                            <Box sx={{ position: 'absolute', inset: 0 }}>
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
                                        // Removed facingMode to allow default camera
                                    }}
                                />
                            </Box>

                            {/* Overlay & Cutout */}
                            <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.4)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Box sx={{
                                    position: 'relative',
                                    width: 250,
                                    height: 250,
                                    border: '2px solid rgba(255,255,255,0.2)',
                                    borderRadius: 2,
                                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)' // The cutout effect
                                }}>
                                    {/* Corners */}
                                    <Box sx={{ position: 'absolute', top: -2, left: -2, width: 32, height: 32, borderTop: 4, borderLeft: 4, borderColor: 'primary.main', borderTopLeftRadius: 8 }} />
                                    <Box sx={{ position: 'absolute', top: -2, right: -2, width: 32, height: 32, borderTop: 4, borderRight: 4, borderColor: 'primary.main', borderTopRightRadius: 8 }} />
                                    <Box sx={{ position: 'absolute', bottom: -2, left: -2, width: 32, height: 32, borderBottom: 4, borderLeft: 4, borderColor: 'primary.main', borderBottomLeftRadius: 8 }} />
                                    <Box sx={{ position: 'absolute', bottom: -2, right: -2, width: 32, height: 32, borderBottom: 4, borderRight: 4, borderColor: 'primary.main', borderBottomRightRadius: 8 }} />

                                    {/* Scan Line */}
                                    <Box sx={{ position: 'absolute', top: '50%', left: 16, right: 16, height: '2px', bgcolor: 'primary.main', boxShadow: '0 0 15px rgba(31,137,229,0.8)', opacity: 0.8 }} />
                                </Box>
                            </Box>
                        </Box>

                        {error && (
                            <Alert severity="warning" sx={{ mt: 2, width: '100%' }}>{error}</Alert>
                        )}

                        {/* Instructions */}
                        <Box sx={{ mt: 4, px: 3, textAlign: 'center', maxWidth: 320 }}>
                            <Box sx={{ display: 'inline-flex', width: 40, height: 40, borderRadius: '50%', bgcolor: 'action.hover', alignItems: 'center', justifyContent: 'center', mb: 2, color: 'text.secondary' }}>
                                <QrCodeScannerIcon />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Align the QR code within the frame above to instantly verify the employee's identity.
                            </Typography>
                        </Box>

                    </Box>

                </Box>

                {/* Footer */}
                <Box component="footer" sx={{ p: 3, pb: 4, textAlign: 'center', borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                    <Typography variant="caption" display="block" color="text.disabled" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 2 }}>
                        Official Digital Verification System
                    </Typography>
                    <Button
                        startIcon={<HelpIcon sx={{ fontSize: 18 }} />}
                        sx={{ color: 'text.secondary', textTransform: 'none', '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}
                    >
                        Help & Support
                    </Button>
                </Box>

            </Box>
        </Box>
    );
}
