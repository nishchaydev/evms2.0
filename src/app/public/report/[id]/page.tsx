'use client';

import { Box, Typography, Paper, IconButton, Chip, Alert, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import BuildIcon from '@mui/icons-material/Build';
import CancelIcon from '@mui/icons-material/Cancel';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getReportById } from '@/lib/report-actions';

interface Report {
    id: string;
    createdAt: Date;
    description: string;
    status: string;
    employee: {
        firstName: string;
        lastName: string;
    };
    attachment: string | null;
}

export default function ReportStatusPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getReportById(id).then((data) => {
            setReport(data as any);
            setLoading(false);
        });
    }, [id]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'RESOLVED': return 'success';
            case 'IN_PROGRESS': return 'warning'; // Renamed via display logic if needed
            case 'REVIEWED': return 'warning';
            case 'DISMISSED': return 'error';
            default: return 'info';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'RESOLVED': return <CheckCircleIcon sx={{ fontSize: 40 }} />;
            case 'REVIEWED': return <BuildIcon sx={{ fontSize: 40 }} />;
            case 'DISMISSED': return <CancelIcon sx={{ fontSize: 40 }} />;
            default: return <PendingIcon sx={{ fontSize: 40 }} />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'RESOLVED': return 'Issue Resolved';
            case 'REVIEWED': return 'Under Review';
            case 'DISMISSED': return 'Report Dismissed';
            default: return 'Report Submitted';
        }
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography>Loading status...</Typography>
            </Box>
        );
    }

    if (!report) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Alert severity="error">Report ID not found or invalid.</Alert>
                <Button sx={{ mt: 2 }} onClick={() => router.push('/public/report/track')}>Try Again</Button>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', alignItems: 'center' }}>

            {/* Mobile Container Wrapper */}
            <Box sx={{ width: '100%', maxWidth: 480, bgcolor: 'background.paper', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: 3 }}>

                {/* Header */}
                <Box component="header" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider', px: 2, py: 2, zIndex: 20, bgcolor: 'background.paper' }}>
                    <IconButton onClick={() => router.back()} sx={{ color: 'text.primary', bgcolor: 'action.hover' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="subtitle1" fontWeight="bold">Report Status</Typography>
                    <Box sx={{ width: 40 }} />
                </Box>

                {/* Main Content */}
                <Box component="main" sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>

                    {/* Status Card */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            bgcolor: `${getStatusColor(report.status)}.light`,
                            color: `${getStatusColor(report.status)}.main`,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            border: 1,
                            borderColor: `${getStatusColor(report.status)}.main`
                        }}
                    >
                        <Box sx={{ mb: 2 }}>{getStatusIcon(report.status)}</Box>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>{getStatusText(report.status)}</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Report ID: <strong>{report.id.slice(0, 8)}</strong>
                        </Typography>
                    </Paper>

                    {/* Details */}
                    <Box>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Report Details</Typography>
                        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                                <Typography variant="caption" color="text.secondary">AGAINST</Typography>
                                <Typography variant="body2" fontWeight="medium">{report.employee.firstName} {report.employee.lastName}</Typography>
                            </Box>
                            <Box sx={{ p: 2 }}>
                                <Typography variant="caption" color="text.secondary">DESCRIPTION</Typography>
                                <Typography variant="body2" fontWeight="medium">{report.description}</Typography>
                            </Box>
                        </Paper>
                    </Box>

                    {/* Timeline */}
                    <Box>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>Timeline</Typography>
                        <Box sx={{ pl: 2, borderLeft: 2, borderColor: 'divider', ml: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>

                            {/* Current Status */}
                            <Box sx={{ position: 'relative' }}>
                                <Box sx={{ position: 'absolute', left: -21, top: 0, width: 12, height: 12, borderRadius: '50%', bgcolor: `${getStatusColor(report.status)}.main`, border: '2px solid white' }} />
                                <Typography variant="body2" fontWeight="bold">{getStatusText(report.status)}</Typography>
                                <Typography variant="caption" color="text.secondary">Recently Updated</Typography>
                            </Box>

                            <Box sx={{ position: 'relative' }}>
                                <Box sx={{ position: 'absolute', left: -21, top: 0, width: 12, height: 12, borderRadius: '50%', bgcolor: 'grey.400', border: '2px solid white' }} />
                                <Typography variant="body2" fontWeight="bold">Report Submitted</Typography>
                                <Typography variant="caption" color="text.secondary">{new Date(report.createdAt).toLocaleDateString()}</Typography>
                            </Box>
                        </Box>
                    </Box>

                </Box>

            </Box>
        </Box>
    );
}

// Needed imports mostly handled by auto-import usually, but explicit here for file overwrite
import { Button } from '@mui/material';
