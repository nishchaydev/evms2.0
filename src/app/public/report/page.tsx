'use client';

import { Box, Button, Container, Typography, Paper, IconButton, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Link from 'next/link';

export default function ReportLandingPage() {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', alignItems: 'center' }}>

            <Container maxWidth="sm" sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column', boxShadow: { md: 3 }, borderRadius: { md: 4 }, my: { md: 4 }, overflow: 'hidden', bgcolor: 'background.paper' }}>

                {/* Header */}
                <Box component="header" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider', px: 3, py: 2.5, zIndex: 20, bgcolor: 'white' }}>
                    <IconButton component={Link} href="/" sx={{ color: 'text.primary', bgcolor: 'action.hover' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'rgba(31, 137, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main' }}>
                            <AccountBalanceIcon sx={{ fontSize: 24 }} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>Nagar Nigam (IMC)</Typography>
                            <Typography variant="caption" color="text.secondary">Indore Municipal Corporation</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ width: 40 }} />
                </Box>

                {/* Main Content */}
                <Box component="main" sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 4, bgcolor: '#fafafa' }}>

                    <Box sx={{ textAlign: 'center', py: 3 }}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom color="#1e293b">Citizen Reporting</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                            Report issues directly to Nagar Nigam and track their resolution status in real-time.
                        </Typography>
                    </Box>

                    {/* Action Cards */}
                    <Box sx={{ display: 'grid', gap: 2 }}>
                        <Paper
                            elevation={0}
                            component={Link}
                            href="/public/report/submit"
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                border: 1,
                                borderColor: 'divider',
                                display: 'flex',
                                gap: 3,
                                alignItems: 'center',
                                textDecoration: 'none',
                                bgcolor: 'white',
                                transition: 'all 0.2s',
                                '&:hover': { transform: 'translateY(-4px)', borderColor: 'primary.main', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }
                            }}
                        >
                            <Box sx={{ width: 64, height: 64, borderRadius: '24px', bgcolor: 'primary.lighter', color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <NoteAddIcon sx={{ fontSize: 32 }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" fontWeight="bold" color="text.primary">File New Report</Typography>
                                <Typography variant="body2" color="text.secondary">Submit a new complaint regarding sanitation, water, or other civic issues.</Typography>
                            </Box>
                        </Paper>

                        <Paper
                            elevation={0}
                            component={Link}
                            href="/public/track"
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                border: 1,
                                borderColor: 'divider',
                                display: 'flex',
                                gap: 3,
                                alignItems: 'center',
                                textDecoration: 'none',
                                bgcolor: 'white',
                                transition: 'all 0.2s',
                                '&:hover': { transform: 'translateY(-4px)', borderColor: 'secondary.main', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }
                            }}
                        >
                            <Box sx={{ width: 64, height: 64, borderRadius: '24px', bgcolor: 'secondary.lighter', color: 'secondary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <TrackChangesIcon sx={{ fontSize: 32 }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" fontWeight="bold" color="text.primary">Track Status</Typography>
                                <Typography variant="body2" color="text.secondary">Check the progress of your previously submitted complaints.</Typography>
                            </Box>
                        </Paper>
                    </Box>

                    {/* FAQs Section */}
                    <Box sx={{ py: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ px: 1 }}>Frequently Asked Questions</Typography>

                        <Accordion elevation={0} sx={{ border: 1, borderColor: 'divider', mb: 1.5, borderRadius: '12px !important', bgcolor: 'white', '&:before': { display: 'none' } }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography fontWeight="medium">How do I track my report?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2" color="text.secondary">
                                    After submitting a report, you will receive a unique Report ID. Go to "Track Status" and enter this ID to see real-time updates.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion elevation={0} sx={{ border: 1, borderColor: 'divider', mb: 1.5, borderRadius: '12px !important', bgcolor: 'white', '&:before': { display: 'none' } }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography fontWeight="medium">Is my identity anonymous?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2" color="text.secondary">
                                    Yes, your personal details are kept confidential. Only the necessary report details are shared with the assigned officer.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion elevation={0} sx={{ border: 1, borderColor: 'divider', mb: 1.5, borderRadius: '12px !important', bgcolor: 'white', '&:before': { display: 'none' } }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography fontWeight="medium">How long does resolution take?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2" color="text.secondary">
                                    Most reports are reviewed within 24 hours. Resolution time depends on the complexity, typically 3-5 business days.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Box>

                    {/* Info Section */}
                    <Box sx={{ mt: 'auto', bgcolor: '#FEF2F2', color: '#991B1B', p: 3, borderRadius: 3, border: 1, borderColor: '#FCA5A5' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <ReportProblemIcon color="error" />
                            <Box>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Emergency Controls</Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                                    For life-threatening emergencies (Fire, Major Accidents, Flood control), do not use this app. Call <strong>101</strong> or <strong>108</strong> immediately.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                </Box>

                {/* Footer */}
                <Box component="footer" sx={{ p: 3, textAlign: 'center', borderTop: 1, borderColor: 'divider', bgcolor: 'white' }}>
                    <Typography variant="caption" display="block" color="text.disabled">
                        © 2024 Nagar Nigam (IMC)
                    </Typography>
                </Box>

            </Container>

        </Box>
    );
}
