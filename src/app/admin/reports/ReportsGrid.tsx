'use client';

// Reusing the robust reports page logic from super-admin but adapted for generic admin view if needed
// For now, mirroring the same functionality as requested
import {
    Box,
    Typography,
    Paper,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    Grid,
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DownloadIcon from '@mui/icons-material/Download';
import TableViewIcon from '@mui/icons-material/TableView';
import VisibilityIcon from '@mui/icons-material/Visibility';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState, useEffect } from 'react';
import { getReports, updateReportStatus } from '@/lib/report-actions';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Employee } from '@/types/employee';

// Type definition for Report
interface Report {
    id: string;
    createdAt: Date;
    description: string;
    status: string;
    employee?: Employee | null;
    images: { url: string }[];
    location?: string | null;
}

import ImageIcon from '@mui/icons-material/Image';
import { prisma } from '@/lib/prisma';
import { LinkIconButton } from '@/components/ClientLinks';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';

// ... inside the component ...
// Update the table header
// <TableCell sx={{ fontWeight: 'bold' }}>Attachment</TableCell>

// Update the table row
// <TableCell>
//     {report.images.length > 0 ? (
//         <Tooltip title="View Image">
//             <IconButton component={Link} href={report.images[0].url} target="_blank" color="primary">
//                 <ImageIcon />
//             </IconButton>
//         </Tooltip>
//     ) : (
//         <Typography variant="caption" color="text.secondary">None</Typography>
//     )}
// </TableCell>

interface ReportsGridProps {
    initialReports: Report[];
}

export default function ReportsGrid({ initialReports }: ReportsGridProps) {
    const [reports, setReports] = useState<Report[]>(initialReports);
    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

    const fetchReports = async () => {
        // Keep for refreshing
        setLoading(true);
        const data = await getReports();
        setReports(data as unknown as Report[]);
        setLoading(false);
    };

    const handleStatusMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedReportId(id);
    };

    const handleStatusMenuClose = () => {
        setAnchorEl(null);
        setSelectedReportId(null);
    };

    const handleStatusChange = async (status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED') => {
        if (selectedReportId) {
            await updateReportStatus(selectedReportId, status);
            fetchReports();
            handleStatusMenuClose();
        }
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Citizen Reports Log", 14, 16);
        doc.setFontSize(10);
        doc.text(`Exported on: ${new Date().toLocaleString()}`, 14, 22);

        const tableData = reports.map(r => [
            new Date(r.createdAt).toLocaleDateString(),
            r.id.slice(0, 8),
            r.employee?.firstName ? `${r.employee?.firstName} ${r.employee?.lastName}` : 'Anonymous/General',
            r.description.slice(0, 50) + (r.description.length > 50 ? '...' : ''),
            r.status
        ]);

        autoTable(doc, {
            head: [['Date', 'Report ID', 'Against Employee', 'Issue', 'Status']],
            body: tableData,
            startY: 28,
        });

        doc.save("evms-reports.pdf");
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'RESOLVED': return 'success';
            case 'PENDING': return 'error';
            case 'REVIEWED': return 'warning';
            default: return 'default';
        }
    };

    // ... inside AdminReportsPage ...
    const [detailOpen, setDetailOpen] = useState(false);
    const [viewReport, setViewReport] = useState<Report | null>(null);

    const handleViewDetails = (report: Report) => {
        setViewReport(report);
        setDetailOpen(true);
    };

    const handleCloseDetails = () => {
        setDetailOpen(false);
        setViewReport(null);
    };

    // Helper to open map
    const openMap = (location: string) => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ maxWidth: 'xl', mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>

                {/* Header */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'end' }, gap: 2 }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>Report Management</Typography>
                        <Typography variant="body1" color="text.secondary">Review and manage citizen reports filed against employees.</Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        sx={{ borderRadius: 2 }}
                        onClick={exportPDF}
                        disabled={reports.length === 0}
                    >
                        Export Report Log
                    </Button>
                </Box>

                {/* Content */}
                <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', overflow: 'hidden' }}>
                    {loading ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>
                    ) : reports.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">No reports found.</Typography>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ bgcolor: 'action.hover' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Employee</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Evidence</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reports.map((report) => (
                                        <TableRow
                                            key={report.id}
                                            hover
                                            onClick={() => handleViewDetails(report)}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell sx={{ fontFamily: 'monospace' }}>{report.id.slice(0, 8)}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {report.employee?.firstName ? `${report.employee?.firstName} ${report.employee?.lastName}` : 'General Report'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {report.employee?.department || 'N/A'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ maxWidth: 300 }}>
                                                <Typography variant="body2" noWrap>{report.description}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                {report.images && report.images.length > 0 ? (
                                                    <Tooltip title="View Evidence">
                                                        <IconButton size="small" color="primary" onClick={(e) => { e.stopPropagation(); handleViewDetails(report); }}>
                                                            <ImageIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                ) : (
                                                    <Typography variant="caption" color="text.secondary">-</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={report.status}
                                                    size="small"
                                                    color={getStatusColor(report.status) as 'success' | 'error' | 'warning' | 'default'}
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                    <Tooltip title="View Details">
                                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleViewDetails(report); }}>
                                                            <VisibilityIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleStatusMenuOpen(e, report.id); }}>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>

                {/* Status Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleStatusMenuClose}
                >
                    <MenuItem onClick={() => handleStatusChange('PENDING')}>Mark as Pending</MenuItem>
                    <MenuItem onClick={() => handleStatusChange('REVIEWED')}>Mark as Reviewed</MenuItem>
                    <MenuItem onClick={() => handleStatusChange('RESOLVED')}>Mark as Resolved</MenuItem>
                    <MenuItem onClick={() => handleStatusChange('DISMISSED')}>Dismiss Report</MenuItem>
                </Menu>

                {/* Detail View Dialog */}
                {viewReport && (
                    <Dialog open={detailOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
                        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">Report Investigation</Typography>
                                <Typography variant="caption" color="text.secondary">ID: {viewReport.id}</Typography>
                            </Box>
                            <IconButton onClick={handleCloseDetails}><CloseIcon /></IconButton>
                        </DialogTitle>
                        <DialogContent sx={{ p: 0 }}>
                            <Grid container>
                                {/* Left: Info */}
                                <Grid item xs={12} md={7} sx={{ p: 3, borderRight: { md: 1 }, borderColor: 'divider' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        {/* Employee Status */}
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Avatar sx={{ width: 56, height: 56, bgcolor: viewReport.employee ? 'primary.main' : 'grey.400' }}>
                                                {viewReport.employee?.firstName?.[0] || '?'}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {viewReport.employee?.firstName ? `${viewReport.employee?.firstName} ${viewReport.employee?.lastName}` : 'General Report'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {viewReport.employee?.department || 'No Specific Employee'}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={viewReport.status}
                                                color={getStatusColor(viewReport.status) as 'success' | 'error' | 'warning' | 'default'}
                                                sx={{ ml: 'auto', fontWeight: 'bold' }}
                                            />
                                        </Box>

                                        <Divider />

                                        {/* Issue Details */}
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Reported Issue</Typography>
                                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                                {viewReport.description}
                                            </Typography>
                                        </Box>

                                        {/* Meta */}
                                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Date Reported</Typography>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {new Date(viewReport.createdAt).toLocaleString()}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Location Coordinates</Typography>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {viewReport.location || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Map Action */}
                                        {viewReport.location && (
                                            <Button
                                                variant="outlined"
                                                startIcon={<LocationOnIcon />}
                                                onClick={() => openMap(viewReport.location!)}
                                                fullWidth
                                            >
                                                View on Google Maps
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>

                                {/* Right: Evidence */}
                                <Grid item xs={12} md={5} sx={{ bgcolor: 'action.hover' }}>
                                    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Visual Evidence</Typography>
                                        {viewReport.images && viewReport.images.length > 0 ? (
                                            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'black', borderRadius: 2, overflow: 'hidden', minHeight: 300 }}>
                                                <img
                                                    src={viewReport.images[0].url}
                                                    alt="Evidence"
                                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                                />
                                            </Box>
                                        ) : (
                                            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed', borderColor: 'divider', borderRadius: 2, color: 'text.secondary', minHeight: 300 }}>
                                                No image attached
                                            </Box>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                            <Button onClick={handleCloseDetails}>Close</Button>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => {
                                    updateReportStatus(viewReport.id, 'RESOLVED');
                                    setDetailOpen(false);
                                    fetchReports();
                                }}
                                disabled={viewReport.status === 'RESOLVED'}
                            >
                                Mark Resolved
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Box>
        </Box>
    );
}
