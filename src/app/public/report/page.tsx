'use client';

import {
    Box,
    Button,
    Container,
    Typography,
    Paper,
    IconButton,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Link from 'next/link';

export default function ReportLandingPage() {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', color: 'text.primary' }}>

            {/* Top Navigation */}
            <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 1100, bgcolor: 'background.paper', borderBottom: 2, borderColor: 'divider', px: { xs: 2, md: 5 }, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AccountBalanceIcon color="primary" sx={{ fontSize: 24 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Govt. of Madhya Pradesh</Typography>
                    </Box>
                </Link>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Link href="/login" style={{ textDecoration: 'none' }}>
                        <Button variant="outlined" color="primary" size="small">
                            Official Login
                        </Button>
                    </Link>
                </Box>
            </Box>

            {/* Main Content */}
            <Container maxWidth="md" sx={{ flex: 1, py: { xs: 4, md: 8 }, display: 'flex', flexDirection: 'column', gap: 6 }}>

                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography variant="overline" color="primary">Citizen Grievance</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>Public Reporting Portal</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
                        Submit issues directly to the Indore Municipal Corporation (IMC). Our transparent system allows you to file reports and track resolution progress in real-time.
                    </Typography>
                </Box>

                {/* Action Cards */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    <Link href="/public/report/submit" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                border: 2,
                                borderColor: 'divider',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                                bgcolor: 'background.paper',
                                transition: 'all 0.2s',
                                '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(5, 150, 105, 0.02)' }
                            }}
                        >
                            <NoteAddIcon color="primary" sx={{ fontSize: 40 }} />
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>FILE NEW REPORT</Typography>
                                <Typography variant="body2" color="text.secondary">Register a new complaint regarding sanitation, infrastructure, or water issues.</Typography>
                            </Box>
                            <Button variant="contained" color="primary" fullWidth sx={{ mt: 'auto' }}>START REPORT</Button>
                        </Paper>
                    </Link>

                    <Link href="/public/track" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                border: 2,
                                borderColor: 'divider',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                                bgcolor: 'background.paper',
                                transition: 'all 0.2s',
                                '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(5, 150, 105, 0.02)' }
                            }}
                        >
                            <TrackChangesIcon color="primary" sx={{ fontSize: 40 }} />
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>TRACK STATUS</Typography>
                                <Typography variant="body2" color="text.secondary">Monitor the progress of your previously submitted official grievances.</Typography>
                            </Box>
                            <Button variant="outlined" color="primary" fullWidth sx={{ mt: 'auto' }}>CHECK PROGRESS</Button>
                        </Paper>
                    </Link>
                </Box>

                {/* FAQs Section */}
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3, textTransform: 'uppercase' }}>Frequently Asked Questions</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Accordion elevation={0} sx={{ border: 1, borderColor: 'divider', '&:before': { display: 'none' } }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ fontWeight: 800 }}>HOW DO I TRACK MY REPORT?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2" color="text.secondary">
                                    After submission, you will receive a unique Report ID. Use the "Track Status" tool and enter this ID for real-time processing updates.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion elevation={0} sx={{ border: 1, borderColor: 'divider', '&:before': { display: 'none' } }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ fontWeight: 800 }}>IS MY IDENTITY PROTECTED?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2" color="text.secondary">
                                    Yes. Your personal information is encrypted and only used for administrative verification. Officer access is restricted on a need-to-know basis.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion elevation={0} sx={{ border: 1, borderColor: 'divider', '&:before': { display: 'none' } }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ fontWeight: 800 }}>WHAT IS THE AVERAGE RESOLUTION TIME?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2" color="text.secondary">
                                    Reports are acknowledged within 24 hours. Standard civic issues are typically addressed within 3-5 business days depending on priority.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </Box>

                {/* Emergency Section */}
                <Paper elevation={0} sx={{ p: 4, bgcolor: '#FEF2F2', border: 2, borderColor: '#FCA5A5' }}>
                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                        <ReportProblemIcon sx={{ color: '#991B1B', fontSize: 32 }} />
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#991B1B', mb: 1, textTransform: 'uppercase' }}>Emergency Protocols</Typography>
                            <Typography variant="body2" sx={{ color: '#991B1B', fontWeight: 600 }}>
                                For immediate life-threatening emergencies (Fire, Electrical Hazard, Structural Failure), call 101 or 108 directly. This portal is for non-emergency civic reporting.
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

            </Container>

            {/* Footer */}
            <Box component="footer" sx={{ mt: 'auto', borderTop: 2, borderColor: 'divider', bgcolor: 'background.paper', py: 4, px: 3 }}>
                <Container maxWidth={false} sx={{ maxWidth: 1400, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
                    <Box>
                        <Typography variant="h6">EVMS 2.0</Typography>
                        <Typography variant="caption" color="text.secondary">© 2026 Indore Municipal Corporation. Official Public Service Portal.</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 4 }}>
                        <Link href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>LEGAL</Link>
                        <Link href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>SUPPORT</Link>
                    </Box>
                </Container>
            </Box>

        </Box>
    );
}
