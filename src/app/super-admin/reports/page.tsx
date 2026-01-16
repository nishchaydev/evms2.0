'use client';

import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    TextField,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Tabs,
    Tab,
    Menu,
    CircularProgress,

    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import TableViewIcon from '@mui/icons-material/TableView';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState, useEffect } from 'react';
import { getReports, updateReportStatus } from '@/lib/report-actions';
import { getScanLogs, getSearchLogs } from '@/lib/log-actions';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Type definition for Report
interface Report {
    id: string;
    createdAt: Date;
    description: string;
    status: string;
    employee: {
        firstName: string;
        lastName: string;
        department: string;
    };
    images: { url: string }[];
}

import ImageIcon from '@mui/icons-material/Image';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';

export default function ReportsPage() {
    const [tabValue, setTabValue] = useState(2); // Default to Citizen Reports
    const [reports, setReports] = useState<Report[]>([]);
    const [scanLogs, setScanLogs] = useState<any[]>([]);
    const [searchLogs, setSearchLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

    // View Details State
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

    const openMap = (location: string) => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const fetchData = async () => {
        setLoading(true);
        if (tabValue === 0) {
            const data = await getScanLogs();
            setScanLogs(data);
        } else if (tabValue === 1) {
            const data = await getSearchLogs();
            setSearchLogs(data);
        } else if (tabValue === 2) {
            const data = await getReports();
            setReports(data as any);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [tabValue]);

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
            fetchData(); // Refresh list
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
            r.employee?.firstName ? `${r.employee.firstName} ${r.employee.lastName}` : 'Anonymous/General',
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

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh', bgcolor: 'background.default' }}>
            <Box sx={{ maxWidth: 'xl', mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>

                {/* Header */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'end' }, gap: 2 }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>Reports & Audit Logs</Typography>
                        <Typography variant="body1" color="text.secondary">Monitor system activity, track employee verification scans, and manage citizen reports.</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            sx={{ borderRadius: 2 }}
                            onClick={exportPDF}
                            disabled={reports.length === 0}
                        >
                            Export PDF
                        </Button>
                        <Button variant="contained" startIcon={<TableViewIcon />} sx={{ borderRadius: 2 }}>Export Excel</Button>
                    </Box>
                </Box>

                {/* Tabs */}
                <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'transparent' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="report tabs">
                        <Tab icon={<QrCodeScannerIcon />} iconPosition="start" label="QR Scan Logs" sx={{ fontWeight: 600, textTransform: 'none' }} />
                        <Tab icon={<PersonSearchIcon />} iconPosition="start" label="Employee Search Logs" sx={{ fontWeight: 600, textTransform: 'none' }} />
                        <Tab
                            icon={<ReportProblemIcon />}
                            iconPosition="start"
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    Citizen Reports
                                    {reports.filter(r => r.status === 'PENDING').length > 0 && (
                                        <Chip label={`${reports.filter(r => r.status === 'PENDING').length} New`} size="small" color="error" sx={{ height: 20, fontSize: '0.65rem' }} />
                                    )}
                                </Box>
                            }
                            sx={{ fontWeight: 600, textTransform: 'none' }}
                        />
                    </Tabs>
                </Paper>

                {/* Content */}
                {tabValue === 0 && (
                    <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', overflow: 'hidden' }}>
                        {loading ? (
                            <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>
                        ) : scanLogs.length === 0 ? (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography color="text.secondary">No scan logs found.</Typography>
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Scanned By</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Employee (Target)</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Details</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {scanLogs.map((log) => (
                                            <TableRow key={log.id} hover>
                                                <TableCell>{new Date(log.scannedAt).toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="bold">{log.scanner?.name || 'Unknown'}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{log.scanner?.role?.name}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">{log.employee?.firstName} {log.employee?.lastName}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{log.employee?.employeeCode}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={log.status}
                                                        size="small"
                                                        color={log.status === 'SUCCESS' ? 'success' : 'error'}
                                                        sx={{ fontWeight: 'bold' }}
                                                    />
                                                </TableCell>
                                                <TableCell>{log.details || '-'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Paper>
                )}

                {tabValue === 1 && (
                    <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', overflow: 'hidden' }}>
                        {loading ? (
                            <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>
                        ) : searchLogs.length === 0 ? (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography color="text.secondary">No search logs found.</Typography>
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead sx={{ bgcolor: 'action.hover' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Search Query</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Results Found</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {searchLogs.map((log) => (
                                            <TableRow key={log.id} hover>
                                                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="bold">{log.user?.name || 'Guest'}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{log.user?.role?.name}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={log.query} size="small" icon={<SearchIcon />} />
                                                </TableCell>
                                                <TableCell>{log.resultsCount}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Paper>
                )}

                {tabValue === 2 && (
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
                                            <TableCell sx={{ fontWeight: 'bold' }}>Report ID</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Against Employee</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Issue Description</TableCell>
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
                                                <TableCell sx={{ fontFamily: 'monospace' }}>{report.id.slice(0, 8)}...</TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="bold">{report.employee?.firstName ? `${report.employee.firstName} ${report.employee.lastName}` : 'General Report'}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{report.employee?.department || 'N/A'}</Typography>
                                                </TableCell>
                                                <TableCell sx={{ maxWidth: 300 }}>
                                                    <Typography variant="body2" noWrap>{report.description}</Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {report.images && report.images.length > 0 ? (
                                                        <Tooltip title="View Evidence">
                                                            <IconButton component={Link} href={report.images[0].url} target="_blank" size="small" color="primary" onClick={(e) => e.stopPropagation()}>
                                                                <ImageIcon />
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
                                                        color={getStatusColor(report.status) as any}
                                                        sx={{ fontWeight: 'bold' }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleStatusMenuOpen(e, report.id); }}>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Paper>
                )}

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

                {/* Detail View Dialog - Added Fix */}
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
                                                    {viewReport.employee?.firstName ? `${viewReport.employee.firstName} ${viewReport.employee.lastName}` : 'General Report'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {viewReport.employee?.department || 'No Specific Employee'}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={viewReport.status}
                                                color={getStatusColor(viewReport.status) as any}
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
                                                    {(viewReport as any).location || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Map Action */}
                                        {(viewReport as any).location && (
                                            <Button
                                                variant="outlined"
                                                startIcon={<LocationOnIcon />}
                                                onClick={() => openMap((viewReport as any).location)}
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
                                    fetchData();
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
