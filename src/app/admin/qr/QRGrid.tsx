'use client';

import { Box, Typography, Paper, Grid, Button, IconButton, TextField, InputAdornment, Avatar, Card, CardContent, Dialog, DialogContent, Chip } from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import BadgeIcon from '@mui/icons-material/Badge';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';


// Interface for Employee Data
interface EmployeeQR {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    department: string;
    designation: string;
    qrToken: string;
    photoUrl?: string | null;
    dob?: string | Date;
    joiningDate?: string | Date;
    contactNumber?: string | null;
    address?: string | null;
}

interface QRGridProps {
    initialEmployees: EmployeeQR[];
}

import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import VerifiedIcon from '@mui/icons-material/Verified';

export default function QRGrid({ initialEmployees }: QRGridProps) {
    const [employees, setEmployees] = useState<EmployeeQR[]>(initialEmployees);
    const [search, setSearch] = useState('');
    const [qrImages, setQrImages] = useState<{ [key: string]: string }>({});

    // Digital View State
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeQR | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const generateQRs = async () => {
            const images: { [key: string]: string } = {};
            for (const emp of employees) {
                if (emp.qrToken && emp.qrToken !== 'PENDING') {
                    try {
                        const verifyUrl = `${window.location.origin}/verify/${emp.qrToken}`;
                        images[emp.id] = await QRCode.toDataURL(verifyUrl, { width: 300, margin: 1 });
                    } catch (e) {
                        console.error("QR Gen Error", e);
                    }
                }
            }
            setQrImages(images);
        };
        generateQRs();
    }, [employees]);

    const handlePrint = () => {
        window.print();
    };

    const handleCardClick = (emp: EmployeeQR) => {
        setSelectedEmployee(emp);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedEmployee(null);
    };

    const filteredEmployees = employees.filter(e =>
        e.firstName.toLowerCase().includes(search.toLowerCase()) ||
        e.lastName.toLowerCase().includes(search.toLowerCase()) ||
        e.employeeCode.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ maxWidth: 'xl', mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>

                {/* Header - Hidden in Print */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'end' }, gap: 2, '@media print': { display: 'none' } }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>Employee ID Cards</Typography>
                        <Typography variant="body1" color="text.secondary">Manage digital identities and print physical ID cards.</Typography>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        flexDirection: { xs: 'column', sm: 'row' },
                        width: { xs: '100%', sm: 'auto' }
                    }}>
                        <TextField
                            size="small"
                            placeholder="Search by name or code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                                sx: { borderRadius: 3 }
                            }}
                            sx={{
                                bgcolor: 'background.paper',
                                flex: 1,
                                minWidth: { sm: 250 }
                            }}
                        />
                        <Button
                            variant="contained"
                            startIcon={<PrintIcon />}
                            onClick={handlePrint}
                            sx={{
                                borderRadius: 3,
                                py: { xs: 1.5, sm: 1 },
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Print Physical IDs
                        </Button>
                    </Box>
                </Box>

                {/* Screen Grid (Digital Preview) - Hidden in Print */}
                <Box sx={{ '@media print': { display: 'none' } }}>
                    <Grid container spacing={3}>
                        {filteredEmployees.map((emp) => (
                            <Grid item xs={12} sm={6} lg={4} xl={3} key={emp.id}>
                                <Box
                                    component={Button}
                                    onClick={() => handleCardClick(emp)}
                                    sx={{
                                        width: '100%',
                                        textTransform: 'none',
                                        textAlign: 'left',
                                        position: 'relative',
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        p: 0,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-8px) rotate(1deg)',
                                            '& .glass-overlay': { opacity: 1 }
                                        }
                                    }}
                                >
                                    {/* Glassmorphism Background */}
                                    <Box sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.8) 0%, rgba(5, 150, 105, 0.4) 100%)',
                                        backdropFilter: 'blur(10px)',
                                        zIndex: 1
                                    }} />

                                    {/* Decorative Patterns */}
                                    <Box sx={{
                                        position: 'absolute',
                                        top: -20,
                                        right: -20,
                                        width: 100,
                                        height: 100,
                                        borderRadius: '50%',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        zIndex: 2
                                    }} />

                                    <Box sx={{ position: 'relative', zIndex: 3, p: 3, width: '100%', color: 'white' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Avatar
                                                src={emp.photoUrl || undefined}
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    border: '3px solid rgba(255, 255, 255, 0.3)',
                                                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)'
                                                }}
                                            >
                                                {emp.firstName.charAt(0)}
                                            </Avatar>

                                            {qrImages[emp.id] && (
                                                <Box sx={{
                                                    p: 1,
                                                    bgcolor: 'white',
                                                    borderRadius: 2,
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                }}>
                                                    <img
                                                        src={qrImages[emp.id]}
                                                        alt="QR"
                                                        style={{ width: '60px', height: '60px', display: 'block' }}
                                                    />
                                                </Box>
                                            )}
                                        </Box>

                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="h6" fontWeight="900" sx={{ letterSpacing: 0.5, lineHeight: 1.2 }}>
                                                {emp.firstName} {emp.lastName}
                                            </Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>
                                                {emp.designation}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                            <Box>
                                                <Typography variant="caption" sx={{ opacity: 0.6, display: 'block' }}>Department</Typography>
                                                <Typography variant="body2" fontWeight="700">{emp.department}</Typography>
                                            </Box>
                                            <Typography variant="caption" sx={{ fontFamily: 'monospace', bgcolor: 'rgba(255, 255, 255, 0.1)', px: 1, py: 0.5, borderRadius: 1 }}>
                                                {emp.employeeCode}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Hover Shine Effect */}
                                    <Box className="glass-overlay" sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                                        transition: 'opacity 0.3s',
                                        opacity: 0,
                                        zIndex: 4
                                    }} />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Print Layout (Physical ID Cards) - Visible ONLY in Print */}
                <Box sx={{ display: 'none', '@media print': { display: 'block' } }}>
                    <Grid container spacing={2}>
                        {filteredEmployees.map((emp) => (
                            <Grid item xs={6} key={emp.id} sx={{ pageBreakInside: 'avoid', mb: 2 }}>
                                {/* Front & Back Container */}
                                <Box sx={{ display: 'flex', gap: 1, border: '1px dashed #ccc', p: 1 }}>

                                    {/* FRONT CARD */}
                                    <Box sx={{
                                        width: '3.375in', height: '2.125in', // Standard ID Card Size
                                        border: 1, borderColor: '#000', borderRadius: 2,
                                        position: 'relative', overflow: 'hidden',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        bgcolor: 'white'
                                    }}>
                                        {/* Header */}
                                        <Box sx={{ width: '100%', bgcolor: '#1976d2', color: 'white', py: 0.5, textAlign: 'center' }}>
                                            <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '10px' }}>NAGAR NIGAM INDORE</Typography>
                                        </Box>
                                        <Box sx={{ mt: 1.5, mb: 1 }}>
                                            <Avatar src={emp.photoUrl || undefined} sx={{ width: 64, height: 64, border: 1, borderColor: '#eee' }} />
                                        </Box>
                                        <Typography variant="subtitle2" fontWeight="bold" sx={{ fontSize: '12px' }}>{emp.firstName} {emp.lastName}</Typography>
                                        <Typography variant="caption" sx={{ fontSize: '10px' }}>{emp.designation}</Typography>
                                        <Typography variant="caption" fontWeight="bold" color="primary" sx={{ fontSize: '10px' }}>{emp.department}</Typography>

                                        <Box sx={{ mt: 'auto', mb: 1, textAlign: 'center' }}>
                                            <Typography variant="caption" display="block" sx={{ fontSize: '8px' }}>Employee Code</Typography>
                                            <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '12px' }}>{emp.employeeCode}</Typography>
                                        </Box>
                                        <Box sx={{ width: '100%', height: 4, bgcolor: '#ed6c02' }} />
                                    </Box>

                                    {/* BACK CARD */}
                                    <Box sx={{
                                        width: '3.375in', height: '2.125in',
                                        border: 1, borderColor: '#000', borderRadius: 2,
                                        position: 'relative', overflow: 'hidden',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        bgcolor: '#f8f9fa'
                                    }}>
                                        <Typography variant="caption" fontWeight="bold" sx={{ mb: 1 }}>SCAN TO VERIFY</Typography>
                                        {qrImages[emp.id] && (
                                            <img src={qrImages[emp.id]} alt="QR" style={{ width: '100px', height: '100px' }} />
                                        )}
                                        <Typography variant="caption" sx={{ mt: 1, fontSize: '8px', color: '#666' }}>Property of Nagar Nigam Indore</Typography>
                                        <Typography variant="caption" sx={{ fontSize: '8px', color: '#666' }}>If found, please return.</Typography>
                                    </Box>

                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

            </Box>

            {/* Digital ID Detail View Modal */}
            {selectedEmployee && (
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 6,
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        }
                    }}
                >
                    <Box sx={{ position: 'relative', bgcolor: 'primary.main', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ textAlign: 'center', color: 'white' }}>
                            <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: 2 }}>OFFICIAL DIGITAL IDENTITY</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>NAGAR NIGAM INDORE • GOVERNMENT OF MP</Typography>
                        </Box>
                        <IconButton onClick={handleCloseDialog} sx={{ position: 'absolute', top: 16, right: 16, color: 'white', bgcolor: 'rgba(0,0,0,0.2)', '&:hover': { bgcolor: 'rgba(0,0,0,0.4)' } }}>
                            <CloseIcon />
                        </IconButton>
                        <Box sx={{ position: 'absolute', bottom: -50, left: '50%', transform: 'translateX(-50%)' }}>
                            <Avatar
                                src={selectedEmployee.photoUrl || undefined}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    border: '8px solid white',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                                }}
                            />
                        </Box>
                    </Box>

                    <DialogContent sx={{ pt: 10, pb: 6, textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="900" sx={{ color: 'text.primary', mb: 0.5 }}>
                            {selectedEmployee.firstName} {selectedEmployee.lastName}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mb: 1, fontWeight: 700 }}>
                            {selectedEmployee.designation}
                        </Typography>
                        <Chip
                            label={selectedEmployee.department}
                            sx={{
                                borderRadius: 2,
                                fontWeight: 800,
                                bgcolor: 'rgba(6, 78, 59, 0.1)',
                                color: 'primary.main',
                                border: '1px solid rgba(6, 78, 59, 0.2)',
                                px: 2,
                                mb: 4
                            }}
                        />

                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            {[
                                { icon: <CreditCardIcon />, label: 'Employee ID', value: selectedEmployee.employeeCode },
                                { icon: <PhoneIcon />, label: 'Phone Number', value: selectedEmployee.contactNumber || 'N/A' },
                                { icon: <VerifiedIcon />, label: 'Status', value: 'VERIFIED OFFICIAL', color: 'success.main' }
                            ].map((item, idx) => (
                                <Grid item xs={12} sm={4} key={idx}>
                                    <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                                        <Box sx={{ color: item.color || 'primary.main', mb: 1 }}>{item.icon}</Box>
                                        <Typography variant="caption" color="text.secondary" display="block">{item.label}</Typography>
                                        <Typography variant="body2" fontWeight="bold">{item.value}</Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={{
                            p: 3,
                            bgcolor: 'white',
                            borderRadius: 4,
                            border: '2px solid',
                            borderColor: 'primary.main',
                            display: 'inline-block',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
                        }}>
                            {qrImages[selectedEmployee.id] && (
                                <img
                                    src={qrImages[selectedEmployee.id]}
                                    alt="QR"
                                    style={{ width: 160, height: 160, display: 'block' }}
                                />
                            )}
                            <Typography variant="overline" display="block" color="primary" sx={{ mt: 1, fontWeight: 900 }}>
                                Scan for Field Verification
                            </Typography>
                        </Box>

                        <Typography variant="caption" sx={{ display: 'block', mt: 4, color: 'text.secondary', opacity: 0.7 }}>
                            Identity generated at {new Date().toLocaleDateString()} • EVMS 2.0 Core
                        </Typography>
                    </DialogContent>
                </Dialog>
            )}

        </Box>
    );
}

// Imports added at top? No, inside replace block but TS might complain if strict. Let's ensure imports are clean.
// Actually, I can't put imports mid-file like this in `replace_file_content` if it's strictly checking.
// I replaced the WHOLE component, so I need to make sure I didn't verify imports I missed.
// The code block has imports: `import CloseIcon ...`.
// But I need `import { Dialog, DialogContent ... }` too which were in the older file or need to be added.
// `Dialog`, `DialogContent`, `Chip` are used but likely not imported in the original file (it only had Card, etc.).

