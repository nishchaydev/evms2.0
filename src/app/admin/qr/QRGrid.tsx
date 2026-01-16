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
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            size="small"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                            sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
                        />
                        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint} sx={{ borderRadius: 2 }}>Print Physical IDs</Button>
                    </Box>
                </Box>

                {/* Screen Grid (Digital Preview) - Hidden in Print */}
                <Box sx={{ '@media print': { display: 'none' } }}>
                    <Grid container spacing={3}>
                        {filteredEmployees.map((emp) => (
                            <Grid item xs={12} sm={6} lg={4} xl={3} key={emp.id}>
                                <Card
                                    component={Button}
                                    onClick={() => handleCardClick(emp)}
                                    sx={{
                                        width: '100%',
                                        textTransform: 'none',
                                        textAlign: 'left',
                                        border: 1,
                                        borderColor: 'divider',
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        position: 'relative',
                                        transition: 'all 0.2s',
                                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 4, borderColor: 'primary.main' },
                                        p: 0
                                    }}
                                >
                                    <Box sx={{ height: 8, bgcolor: 'primary.main', width: '100%' }} />
                                    <CardContent sx={{ p: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                                            {/* LEFT: Info */}
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1.5, flex: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar
                                                        src={emp.photoUrl || undefined}
                                                        sx={{ width: 56, height: 56, border: 2, borderColor: 'background.paper', boxShadow: 1 }}
                                                    >
                                                        {emp.firstName.charAt(0)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1rem', lineHeight: 1.2 }}>
                                                            {emp.firstName} {emp.lastName}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                            {emp.designation}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Chip
                                                    label={emp.department}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                                />

                                                <Box sx={{ bgcolor: 'action.hover', px: 1, py: 0.5, borderRadius: 1, width: '100%' }}>
                                                    <Typography variant="caption" fontWeight="bold" display="block" color="text.secondary">ID NO:</Typography>
                                                    <Typography variant="body2" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>
                                                        {emp.employeeCode}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* RIGHT: QR Code */}
                                            {qrImages[emp.id] ? (
                                                <Box sx={{
                                                    p: 0.5,
                                                    bgcolor: 'white',
                                                    borderRadius: 1,
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center'
                                                }}>
                                                    <img
                                                        src={qrImages[emp.id]}
                                                        alt="QR"
                                                        style={{ width: '80px', height: '80px', display: 'block' }}
                                                    />
                                                </Box>
                                            ) : (
                                                <Box sx={{ width: 80, height: 80, bgcolor: 'action.hover', borderRadius: 1 }} />
                                            )}
                                        </Box>
                                    </CardContent>
                                    <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                                        <BadgeIcon color="disabled" fontSize="small" />
                                    </Box>
                                </Card>
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
                    PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
                >
                    <Box sx={{ position: 'relative', bgcolor: 'primary.main', height: 120 }}>
                        <IconButton onClick={handleCloseDialog} sx={{ position: 'absolute', top: 8, right: 8, color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                        <Box sx={{ position: 'absolute', bottom: -40, left: '50%', transform: 'translateX(-50%)' }}>
                            <Avatar
                                src={selectedEmployee.photoUrl || undefined}
                                sx={{ width: 100, height: 100, border: 4, borderColor: 'background.paper', boxShadow: 3 }}
                            />
                        </Box>
                    </Box>
                    <DialogContent sx={{ pt: 6, pb: 4, textAlign: 'center' }}>
                        <Typography variant="h5" fontWeight="bold">{selectedEmployee.firstName} {selectedEmployee.lastName}</Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>{selectedEmployee.designation}</Typography>
                        <Chip label={selectedEmployee.department} color="primary" size="small" sx={{ mb: 3 }} />

                        <Grid container spacing={2} sx={{ textAlign: 'left', mt: 1 }}>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 1.5, bgcolor: 'action.hover', borderRadius: 2 }}>
                                    <CreditCardIcon color="action" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Employee ID</Typography>
                                        <Typography variant="body2" fontWeight="medium">{selectedEmployee.employeeCode}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 1.5, bgcolor: 'action.hover', borderRadius: 2 }}>
                                    <PhoneIcon color="action" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Phone</Typography>
                                        <Typography variant="body2" fontWeight="medium">{selectedEmployee.contactNumber || 'N/A'}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 1.5, bgcolor: 'action.hover', borderRadius: 2 }}>
                                    <HomeIcon color="action" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Address</Typography>
                                        <Typography variant="body2" fontWeight="medium" noWrap>{selectedEmployee.address || 'N/A'}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 4, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 2, display: 'inline-block' }}>
                            {qrImages[selectedEmployee.id] && (
                                <img src={qrImages[selectedEmployee.id]} alt="QR" style={{ width: 120, height: 120 }} />
                            )}
                            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>Official Verification QR</Typography>
                        </Box>
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

