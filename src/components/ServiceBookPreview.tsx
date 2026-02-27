'use client';

import {
    Box,
    Typography,
    Dialog,
    DialogContent,
    Paper,
    Grid,
    Divider,
    IconButton,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import BadgeIcon from '@mui/icons-material/Badge';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Employee, Education, Experience, Recruitment } from '@/types/employee';

interface ServiceBookProps {
    open: boolean;
    onClose: () => void;
    employee: Employee;
}

export default function ServiceBookPreview({ open, onClose, employee }: ServiceBookProps) {
    if (!employee) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 0,
                    bgcolor: '#fff',
                    '@media print': {
                        width: '100vw',
                        height: '100vh',
                        margin: 0,
                        boxShadow: 'none'
                    }
                }
            }}
        >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white', '@media print': { display: 'none' } }}>
                <Typography variant="h6" fontWeight="bold">Official Service Book Preview</Typography>
                <Box>
                    <Button startIcon={<PrintIcon />} color="inherit" onClick={handlePrint}>Print / Export</Button>
                    <IconButton color="inherit" onClick={onClose} sx={{ ml: 1 }}><CloseIcon /></IconButton>
                </Box>
            </Box>

            <DialogContent sx={{ p: { xs: 2, md: 5 } }}>
                {/* Official Header */}
                <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
                    <Box sx={{ position: 'absolute', top: 0, left: 0 }}>
                        <BadgeIcon sx={{ fontSize: 60, opacity: 0.1, color: 'primary.main' }} />
                    </Box>
                    <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: 2, textTransform: 'uppercase' }}>Government of Madhya Pradesh</Typography>
                    <Typography variant="h6" fontWeight="700" sx={{ opacity: 0.8 }}>NAGAR NIGAM INDORE - SERVICE RECORD</Typography>
                    <Divider sx={{ my: 2, borderBottomWidth: 2, borderColor: 'primary.main' }} />
                </Box>

                {/* Employee Basic Info Section */}
                <Grid container spacing={4} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
                        <Avatar
                            src={employee.photoUrl || undefined}
                            sx={{ width: 140, height: 160, borderRadius: 0, border: '4px solid #000', mx: 'auto', mb: 1 }}
                        >
                            Photo
                        </Avatar>
                        <Typography variant="caption" fontWeight="bold">Official Signature/Thumb</Typography>
                        <Box sx={{ width: '100%', height: 40, border: '1px dashed #ccc', mt: 1 }} />
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <TableContainer component={Box}>
                            <Table size="small">
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', width: '30%', border: 'none' }}>Name:</TableCell>
                                        <TableCell sx={{ border: 'none' }}>{employee.firstName} {employee.lastName}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', border: 'none' }}>Employee Code:</TableCell>
                                        <TableCell sx={{ border: 'none', fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 'bold' }}>{employee.employeeCode}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', border: 'none' }}>Designation:</TableCell>
                                        <TableCell sx={{ border: 'none' }}>{employee.designation}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', border: 'none' }}>Department:</TableCell>
                                        <TableCell sx={{ border: 'none' }}>{employee.department}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', border: 'none' }}>Joining Date:</TableCell>
                                        <TableCell sx={{ border: 'none' }}>{new Date(employee.joiningDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>

                {/* History Sections */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight="900" sx={{ bgcolor: '#f0f0f0', p: 1, borderLeft: '5px solid #064E3B', mb: 2 }}>I. EDUCATIONAL QUALIFICATIONS</Typography>
                    <Table size="small" sx={{ border: '1px solid #ddd' }}>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#fafafa' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Degree/Level</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Institution</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Year</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Grade</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employee.education?.map((edu: Education, idx: number) => (
                                <TableRow key={idx}>
                                    <TableCell>{edu.degree} ({edu.level})</TableCell>
                                    <TableCell>{edu.institution}</TableCell>
                                    <TableCell>{edu.passingYear}</TableCell>
                                    <TableCell>{edu.grade}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight="900" sx={{ bgcolor: '#f0f0f0', p: 1, borderLeft: '5px solid #064E3B', mb: 2 }}>II. SERVICE HISTORY (EXPERIENCE)</Typography>
                    <Table size="small" sx={{ border: '1px solid #ddd' }}>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#fafafa' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Employer</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Duration</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employee.experiences?.map((exp: Experience, idx: number) => (
                                <TableRow key={idx}>
                                    <TableCell>{exp.company}</TableCell>
                                    <TableCell>{exp.designation}</TableCell>
                                    <TableCell>{exp.startDate} - {exp.endDate || 'Present'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight="900" sx={{ bgcolor: '#f0f0f0', p: 1, borderLeft: '5px solid #064E3B', mb: 2 }}>III. RECRUITMENT DETAILS</Typography>
                    <Table size="small" sx={{ border: '1px solid #ddd' }}>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#fafafa' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Exam Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Year</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Rank/Score</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Order Number</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employee.recruitments?.map((rec: Recruitment, idx: number) => (
                                <TableRow key={idx}>
                                    <TableCell>{rec.examName}</TableCell>
                                    <TableCell>{rec.examYear}</TableCell>
                                    <TableCell>{rec.rank || '-'}</TableCell>
                                    <TableCell>{rec.orderNumber || '-'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>

                <Box sx={{ mt: 8, textAlign: 'right', pr: 4 }}>
                    <Box sx={{ display: 'inline-block', textAlign: 'center' }}>
                        <VerifiedIcon sx={{ color: 'primary.main', fontSize: 40 }} />
                        <Typography variant="body2" fontWeight="bold">Digitally Verified by EVMS 2.0</Typography>
                        <Typography variant="caption">Date: {new Date().toLocaleDateString()}</Typography>
                    </Box>
                </Box>

                <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #eee', textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ opacity: 0.5 }}>This is a computer-generated service record for internal administrative use only.</Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
