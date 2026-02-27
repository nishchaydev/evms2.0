import {
    Box,
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Stepper,
    Step,
    StepLabel,
    Chip,
    Alert,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

import { getReportById } from '@/lib/report-actions';
import { redirect } from 'next/navigation';

export default async function TrackReportPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
    const { id } = await searchParams;
    let report = null;
    let error = null;

    if (id) {
        report = await getReportById(id);
        if (!report) {
            error = 'Report not found. Please check the ID and try again.';
        }
    }

    // Determine active step
    const steps = ['Submitted', 'Reviewed', 'Resolved'];
    let activeStep = 0;
    if (report) {
        switch (report.status) {
            case 'PENDING': activeStep = 0; break;
            case 'REVIEWED': activeStep = 1; break;
            case 'RESOLVED': activeStep = 3; break;
            case 'DISMISSED': activeStep = 3; break;
        }
    }

    async function searchAction(formData: FormData) {
        'use server';
        const id = formData.get('reportId');
        if (id) {
            redirect(`/public/track?id=${id}`);
        }
    }

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

            <Container maxWidth="md" sx={{ flex: 1, py: { xs: 4, md: 8 } }}>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: 6 }}>
                    <Typography variant="overline" color="primary">Citizen Services</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>Track Report</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Enter your official Report ID to track the real-time status of your submitted grievance.
                    </Typography>
                </Box>

                {/* Search Box */}
                <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, border: 2, borderColor: 'divider', mb: 6 }}>
                    <form action={searchAction} style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, mb: 1, display: 'block' }}>Report ID</Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <TextField
                                    name="reportId"
                                    fullWidth
                                    placeholder="e.g., clq..."
                                    defaultValue={id || ''}
                                    variant="outlined"
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    startIcon={<SearchIcon />}
                                    sx={{ minWidth: 160, height: 56 }}
                                >
                                    Track Status
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </Paper>

                {error && (
                    <Alert severity="error" sx={{ mb: 4, borderRadius: 0, fontWeight: 700 }}>
                        {error}
                    </Alert>
                )}

                {/* Results */}
                {report && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {/* Status Timeline */}
                        <Paper elevation={0} sx={{ p: 4, border: 2, borderColor: 'divider', bgcolor: 'background.paper' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 4, textTransform: 'uppercase' }}>
                                Processing Status
                            </Typography>
                            <Stepper activeStep={activeStep} alternativeLabel>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel sx={{ '& .MuiStepLabel-label': { fontWeight: 700 } }}>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            <Box sx={{ mt: 5, textAlign: 'center', borderTop: 1, borderColor: 'divider', pt: 3 }}>
                                <Chip
                                    label={report.status}
                                    color={report.status === 'RESOLVED' ? 'success' : report.status === 'REVIEWED' ? 'warning' : report.status === 'DISMISSED' ? 'error' : 'default'}
                                    sx={{ fontWeight: 800, px: 3, py: 2, borderRadius: 0, textTransform: 'uppercase' }}
                                />
                                {report.status === 'DISMISSED' && (
                                    <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 600 }}>
                                        Verification failed. This report has been dismissed by the administration.
                                    </Typography>
                                )}
                            </Box>
                        </Paper>

                        {/* Report Details */}
                        <Card elevation={0} sx={{ border: 2, borderColor: 'divider' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3, textTransform: 'uppercase' }}>Report Details</Typography>
                                <Divider sx={{ mb: 3 }} />

                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>Category</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 700, textTransform: 'capitalize' }}>{report.category}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>Submitted On</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ gridColumn: '1 / -1' }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>Description</Typography>
                                        <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>{report.description}</Typography>
                                    </Box>
                                    <Box sx={{ gridColumn: '1 / -1' }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>Location Details</Typography>
                                        <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>{report.location || 'No specific location provided'}</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                )}
            </Container>

            {/* Footer */}
            <Box component="footer" sx={{ mt: 'auto', borderTop: 2, borderColor: 'divider', bgcolor: 'background.paper', py: 4, px: 3 }}>
                <Container maxWidth={false} sx={{ maxWidth: 1400, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
                    <Box>
                        <Typography variant="h6">EVMS 2.0</Typography>
                        <Typography variant="caption" color="text.secondary">© 2026 Indore Municipal Corporation. Citizen Response Portal.</Typography>
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
