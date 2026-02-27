'use client';

import {
    Box,
    Typography,
    Dialog,
    DialogContent,
    Avatar,
    IconButton,
    Chip,
    Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VerifiedIcon from '@mui/icons-material/Verified';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Employee } from '@/types/employee';

interface DigitalIDModalProps {
    open: boolean;
    onClose: () => void;
    employee: Employee;
}

export default function DigitalIDModal({ open, onClose, employee }: DigitalIDModalProps) {
    const [qrCode, setQrCode] = useState('');

    useEffect(() => {
        if (employee?.qr?.token) {
            const verifyUrl = `${window.location.origin}/verify/${employee.qr.token}`;
            QRCode.toDataURL(verifyUrl, { width: 300, margin: 1 }).then(setQrCode);
        }
    }, [employee]);

    if (!employee) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 6,
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #064E3B 0%, #059669 100%)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }
            }}
        >
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton onClick={onClose} sx={{ color: 'white' }}><CloseIcon /></IconButton>
            </Box>

            <DialogContent sx={{ p: 4, pt: 0, textAlign: 'center', color: 'white' }}>
                <Typography variant="overline" sx={{ letterSpacing: 3, opacity: 0.8 }}>OFFICIAL DIGITAL ID</Typography>

                <Box sx={{ position: 'relative', display: 'inline-block', mt: 3, mb: 2 }}>
                    <Avatar
                        src={employee.photoUrl || undefined}
                        sx={{
                            width: 120,
                            height: 120,
                            border: '4px solid rgba(255,255,255,0.3)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                        }}
                    />
                    <Box sx={{ position: 'absolute', bottom: -5, right: -5, bgcolor: 'white', borderRadius: '50%', p: 0.5, display: 'flex' }}>
                        <VerifiedIcon color="success" />
                    </Box>
                </Box>

                <Typography variant="h5" fontWeight="900" sx={{ mb: 0.5 }}>{employee.firstName} {employee.lastName}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>{employee.designation}</Typography>

                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 4, textAlign: 'left' }}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Typography variant="caption" sx={{ opacity: 0.6, display: 'block' }}>RECO NO.</Typography>
                            <Typography variant="body2" fontWeight="bold">{employee.employeeCode}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="caption" sx={{ opacity: 0.6, display: 'block' }}>DEPT.</Typography>
                            <Typography variant="body2" fontWeight="bold" noWrap>{employee.department}</Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ mt: 4, mb: 2 }}>
                    <Box sx={{
                        p: 2,
                        bgcolor: 'white',
                        borderRadius: 4,
                        display: 'inline-block',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
                    }}>
                        {qrCode ? (
                            <img src={qrCode} alt="QR" style={{ width: 140, height: 140, display: 'block' }} />
                        ) : (
                            <Box sx={{ width: 140, height: 140, bgcolor: '#eee' }} />
                        )}
                    </Box>
                </Box>

                <Typography variant="caption" sx={{ opacity: 0.6 }}>SCAN TO VERIFY AUTHENTICITY</Typography>

                <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography variant="caption" sx={{ opacity: 0.5, fontStyle: 'italic' }}>EVMS 2.0 Secure Infrastructure</Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
