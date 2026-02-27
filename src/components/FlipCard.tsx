'use client';

import { useState } from 'react';
import { Box, Paper, Avatar, Typography, Divider, Chip, Button, Grid } from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import VerifiedIcon from '@mui/icons-material/Verified';
import InfoIcon from '@mui/icons-material/Info';
import FlagIcon from '@mui/icons-material/Flag';
import PrintIcon from '@mui/icons-material/Print';
import Link from 'next/link';
import { LinkButton } from './ClientLinks';
import QRCode from 'qrcode';
import { useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Helper Component for Rows
function InfoRow({ label, value, isMono = false }: { label: string, value: string, isMono?: boolean }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: 2, bgcolor: 'action.hover', border: '1px solid transparent', '&:hover': { bgcolor: 'action.selected', borderColor: 'divider' }, transition: 'all 0.2s' }}>
            <Typography variant="body2" color="text.secondary" fontWeight="medium">{label}</Typography>
            <Typography variant="body1" fontWeight="bold" color="text.primary" sx={isMono ? { fontFamily: 'monospace', bgcolor: 'background.paper', px: 1, py: 0.5, borderRadius: 1, border: 1, borderColor: 'divider', fontSize: '0.875rem' } : {}}>
                {value}
            </Typography>
        </Box>
    );
}

interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    photoUrl: string | null;
    designation: string;
    department: string;
    employeeCode: string;
    status: string;
}

export default function FlipCard({ employee }: { employee: Employee }) {
    const [flipped, setFlipped] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState('');

    useEffect(() => {
        // Generate QR Code for the current page URL
        if (typeof window !== 'undefined') {
            QRCode.toDataURL(window.location.href)
                .then(setQrDataUrl)
                .catch(console.error);
        }
    }, []);

    return (
        <Box
            sx={{
                perspective: '1000px',
                width: '100%',
                cursor: 'pointer'
            }}
            onClick={() => setFlipped(!flipped)}
        >
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    transition: 'transform 0.6s',
                    transformStyle: 'preserve-3d',
                    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* FRONT SIDE */}
                <Paper
                    elevation={3}
                    sx={{
                        width: '100%',
                        borderRadius: 3,
                        overflow: 'hidden',
                        border: 1,
                        borderColor: 'divider',
                        position: 'relative',
                        backfaceVisibility: 'hidden',
                        bgcolor: 'background.paper'
                    }}
                >
                    {/* Card Header Stripe */}
                    <Box sx={{ height: 8, bgcolor: 'primary.main', width: '100%' }} />

                    {/* Card Content */}
                    <Box sx={{ p: 3, pt: 4 }}>
                        <Typography variant="h6" align="center" fontWeight="bold" gutterBottom sx={{ mb: 4, color: 'text.primary' }}>
                            Employee Verification Record
                        </Typography>

                        {/* Profile Photo & Basic Info */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, mb: 4 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={employee.photoUrl || undefined}
                                    sx={{ width: 128, height: 128, border: '4px solid', borderColor: 'background.paper', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)', bgcolor: 'grey.200' }}
                                />
                                <Box sx={{ position: 'absolute', bottom: -10, right: -10, bgcolor: 'background.paper', p: 0.5, borderRadius: '50%', boxShadow: 1 }}>
                                    <BadgeIcon color="primary" sx={{ fontSize: 24 }} />
                                </Box>
                            </Box>
                            <Box sx={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h5" fontWeight="bold" color="text.primary">
                                    {employee.firstName} {employee.lastName}
                                </Typography>
                                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.75, borderRadius: 50, bgcolor: 'success.light', color: 'success.dark', border: 1, borderColor: 'success.main', opacity: 0.9 }}>
                                    <VerifiedIcon sx={{ fontSize: 18, color: 'success.main' }} />
                                    <Typography variant="caption" fontWeight="bold" sx={{ color: 'success.dark' }}>Verified Nagar Nigam Employee</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <InfoRow label="Designation" value={employee.designation} />
                            <InfoRow label="Department" value={employee.department} />
                            <InfoRow label="Employee ID" value={employee.employeeCode} isMono />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
                                <Typography variant="body2" color="text.secondary" fontWeight="medium">Current Status</Typography>
                                <Chip
                                    icon={<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', boxShadow: '0 0 0 2px white' }} />}
                                    label={employee.status}
                                    size="small"
                                    sx={{ bgcolor: 'success.light', color: 'success.dark', fontWeight: 'bold', border: 1, borderColor: 'success.light', '& .MuiChip-label': { px: 1 } }}
                                />
                            </Box>
                        </Box>
                    </Box>

                    {/* Disclaimer Footer */}
                    <Box sx={{ p: 3, bgcolor: 'action.selected', borderTop: 1, borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <InfoIcon color="disabled" sx={{ mt: 0.5 }} />
                            <Box>
                                <Typography variant="body2" fontWeight="bold" gutterBottom color="text.primary">Public Notice</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6, display: 'block' }}>
                                    No personal or confidential data is displayed.
                                </Typography>
                            </Box>
                        </Box>

                        {/* Action Buttons - Stop Propagation to prevent flip */}
                        <Grid container spacing={2} onClick={(e) => e.stopPropagation()}>
                            <Grid item xs={6}>
                                <LinkButton
                                    fullWidth
                                    variant="outlined"
                                    color="inherit"
                                    startIcon={<FlagIcon />}
                                    href={`/public/report/submit?employeeId=${employee.id}&employeeName=${encodeURIComponent(employee.firstName + ' ' + employee.lastName)}`}
                                    sx={{ textTransform: 'none', borderColor: 'divider', color: 'text.secondary' }}
                                >
                                    Report Issue
                                </LinkButton>
                            </Grid>
                            <Grid item xs={6}>
                                <Button fullWidth variant="outlined" color="inherit" startIcon={<PrintIcon />} sx={{ textTransform: 'none', borderColor: 'divider', color: 'text.secondary' }}>
                                    Print Details
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ height: 4, background: 'linear-gradient(90deg, rgba(6, 78, 59, 0.4) 0%, rgba(5, 150, 105, 1) 50%, rgba(6, 78, 59, 0.4) 100%)', opacity: 0.3 }} />
                </Paper>

                {/* BACK SIDE */}
                <Paper
                    elevation={3}
                    sx={{
                        width: '100%',
                        borderRadius: 3,
                        overflow: 'hidden',
                        border: 1,
                        borderColor: 'divider',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        bgcolor: 'background.paper',
                        transform: 'rotateY(180deg)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 4,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Scan to Share</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        Scan this QR code to view this verification record on another device.
                    </Typography>

                    <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, border: 1, borderColor: 'divider', mb: 4 }}>
                        {qrDataUrl && <img src={qrDataUrl} alt="QR Code" width={200} height={200} />}
                    </Box>

                    <Button startIcon={<ArrowBackIcon />} onClick={(e) => { e.stopPropagation(); setFlipped(false); }}>
                        Flip Back
                    </Button>
                </Paper>
            </Box>
        </Box>
    );
}
