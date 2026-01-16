'use client';

import * as React from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Chip
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import HistoryIcon from '@mui/icons-material/History';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WarningIcon from '@mui/icons-material/Warning';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Link from 'next/link';

// Mock Data
const recentScans = [
    { time: '10:42 AM', name: 'Amit Sharma', id: 'IMC-8832', dept: 'Sanitation', status: 'Verified', statusColor: 'success' },
    { time: '10:38 AM', name: 'Priya Verma', id: 'IMC-9921', dept: 'Administration', status: 'Verified', statusColor: 'success' },
    { time: '10:15 AM', name: 'Unknown User', id: '---', dept: '---', status: 'Failed', statusColor: 'error' },
    { time: '09:55 AM', name: 'Rahul Singh', id: 'IMC-1023', dept: 'Engineering', status: 'Flagged', statusColor: 'warning' },
];

export default function OfficerDashboard() {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [stats, setStats] = React.useState({ verifiedEmployees: 0, flaggedIssues: 0, totalScansToday: 0 });
    const [recentScans, setRecentScans] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    React.useEffect(() => {
        async function fetchDashboardData() {
            setLoading(true);
            try {
                const { getOfficerStats, getRecentScans } = await import('@/lib/officer-actions');
                const [statsData, scansData] = await Promise.all([
                    getOfficerStats(),
                    getRecentScans()
                ]);
                setStats(statsData);
                setRecentScans(scansData);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboardData();
    }, []);

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider' }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', opacity: 0.1 }}>
                    {/* Opacity hack replacement */}
                </Box>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'primary.light', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', position: 'absolute' }}>
                    <AccountBalanceIcon />
                </Box>
                <Box sx={{ ml: 6 }}>
                    <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>Nagar Nigam</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ letterSpacing: 1 }}>IMC VERIFICATION</Typography>
                </Box>
            </Box>
            <List sx={{ px: 2, flex: 1 }}>
                {[
                    { text: 'Dashboard', icon: <DashboardIcon />, active: true },
                    { text: 'Scan QR', icon: <QrCodeScannerIcon />, href: '/officer/scan' },
                    { text: 'Employee Search', icon: <PersonSearchIcon />, href: '/officer/search' },
                    { text: 'History Logs', icon: <HistoryIcon />, href: '#' },
                    { text: 'Reports', icon: <ReportProblemIcon />, href: '#' },
                ].map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            component={item.href ? Link : 'div'}
                            href={item.href || undefined}
                            selected={item.active}
                            sx={{ borderRadius: 2, '&.Mui-selected': { bgcolor: 'primary.light', color: 'primary.main', '& .MuiListItemIcon-root': { color: 'primary.main' } } }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: item.active ? 'primary.main' : 'text.secondary' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <ListItemButton sx={{ borderRadius: 2, color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: 'error.lighter' } }}>
                    <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Mobile Sidebar */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 } }}
            >
                {drawer}
            </Drawer>

            {/* Desktop Sidebar */}
            <Box component="nav" sx={{ width: { md: 280 }, flexShrink: { md: 0 }, display: { xs: 'none', md: 'block' } }}>
                {drawer}
            </Box>

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* Header */}
                <Box component="header" sx={{ bgcolor: 'primary.main', color: 'white', px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 2, zIndex: 10 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ display: { md: 'none' } }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" fontWeight="bold">Digital Verification System</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                            <Typography variant="subtitle2" fontWeight="bold">Officer Rajesh Kumar</Typography>
                            <Typography variant="caption" sx={{ color: 'primary.light', opacity: 0.9 }}>Zonal Officer | Zone 4</Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: 'white', color: 'primary.main', border: '2px solid rgba(255,255,255,0.3)' }}>RK</Avatar>
                    </Box>
                </Box>

                {/* Content Scroll Area */}
                <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 4 } }}>
                    <Box sx={{ maxWidth: 'lg', mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>

                        {/* Welcome */}
                        <Box>
                            <Typography variant="h4" fontWeight="900" gutterBottom>Dashboard Overview</Typography>
                            <Typography variant="body1" color="text.secondary">Welcome back, Officer. Here is your daily summary.</Typography>
                        </Box>

                        {/* Stats Cards */}
                        <Grid container spacing={2}>
                            {[
                                { title: 'Total Scans Today', value: stats.totalScansToday, change: 'Today', icon: <QrCodeScannerIcon />, color: 'primary.main', bg: 'primary.light' },
                                { title: 'Verified Employees', value: stats.verifiedEmployees, change: 'Active Total', icon: <VerifiedUserIcon />, color: 'success.main', bg: '#e8f5e9' },
                                { title: 'Flagged Issues', value: stats.flaggedIssues, change: 'Pending Reports', icon: <WarningIcon />, color: 'warning.main', bg: '#fff8e1' },
                            ].map((stat, i) => (
                                <Grid item xs={12} md={4} key={i}>
                                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>{stat.title}</Typography>
                                            <Box sx={{ p: 1, borderRadius: 2, bgcolor: stat.bg, color: stat.color, display: 'flex' }}>{stat.icon}</Box>
                                        </Box>
                                        <Typography variant="h3" fontWeight="bold">{stat.value}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: i === 0 ? 'success.main' : 'text.secondary', fontSize: 13, fontWeight: 600 }}>
                                            {i === 0 && <TrendingUpIcon fontSize="small" />}
                                            {stat.change}
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Recent Activity */}
                        <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', overflow: 'hidden' }}>
                            <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" fontWeight="bold">Recent Verified Employees</Typography>
                                <Button size="small">View All</Button>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead sx={{ bgcolor: 'background.default' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: 12, color: 'text.secondary' }}>Time</TableCell>
                                            <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: 12, color: 'text.secondary' }}>Name</TableCell>
                                            <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: 12, color: 'text.secondary' }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: 12, color: 'text.secondary' }}>Department</TableCell>
                                            <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: 12, color: 'text.secondary' }}>Role</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: 12, color: 'text.secondary' }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow><TableCell colSpan={6} align="center">Loading...</TableCell></TableRow>
                                        ) : recentScans.length === 0 ? (
                                            <TableRow><TableCell colSpan={6} align="center">No recent activity.</TableCell></TableRow>
                                        ) : (
                                            recentScans.map((row, i) => (
                                                <TableRow key={i} hover>
                                                    <TableCell>{new Date(row.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={row.status}
                                                            size="small"
                                                            color="success"
                                                            sx={{ borderRadius: 1, fontWeight: 600, fontSize: 12, height: 24 }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{row.department}</TableCell>
                                                    <TableCell>{row.role}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>

                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
