import { Box, Container, Typography, Paper, TextField, Button, Stepper, Step, StepLabel, Chip, Alert, Card, CardContent, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

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
            case 'RESOLVED': activeStep = 3; break; // Completed
            case 'DISMISSED': activeStep = 3; break; // Completed (but maybe show red?)
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
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
            <Container maxWidth="md">
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>Track Your Report</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Enter your Report ID to check the current status of your complaint.
                    </Typography>
                </Box>

                {/* Search Box */}
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 6 }}>
                    <form action={searchAction} style={{ display: 'flex', gap: 2 }}>
                        <TextField
                            name="reportId"
                            fullWidth
                            label="Report ID"
                            placeholder="e.g., clq..."
                            defaultValue={id || ''}
                            variant="outlined"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            startIcon={<SearchIcon />}
                            sx={{ px: 4, fontWeight: 'bold' }}
                        >
                            Track
                        </Button>
                    </form>
                </Paper>

                {error && (
                    <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Results */}
                {report && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {/* Status Timeline */}
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                                Current Status
                            </Typography>
                            <Stepper activeStep={activeStep} alternativeLabel>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            <Box sx={{ mt: 4, textAlign: 'center' }}>
                                <Chip
                                    label={report.status}
                                    color={report.status === 'RESOLVED' ? 'success' : report.status === 'REVIEWED' ? 'warning' : report.status === 'DISMISSED' ? 'error' : 'default'}
                                    sx={{ fontWeight: 'bold', px: 2 }}
                                />
                                {report.status === 'DISMISSED' && (
                                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                        This report was reviewed and dismissed by the administration.
                                    </Typography>
                                )}
                            </Box>
                        </Paper>

                        {/* Report Details */}
                        <Card elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Report Details</Typography>
                                <Divider sx={{ mb: 2 }} />

                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                                        <Typography variant="body1" fontWeight="medium" sx={{ textTransform: 'capitalize' }}>{report.category}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Submitted On</Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ gridColumn: '1 / -1' }}>
                                        <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                                        <Typography variant="body1" sx={{ mt: 0.5 }}>{report.description}</Typography>
                                    </Box>
                                    <Box sx={{ gridColumn: '1 / -1' }}>
                                        <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                                        <Typography variant="body1" sx={{ mt: 0.5 }}>{report.location || 'No location provided'}</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
