'use client';

import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    Avatar,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress
} from '@mui/material';

import PeopleIcon from '@mui/icons-material/People';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import BadgeIcon from '@mui/icons-material/Badge';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { verifyJWT } from '@/lib/auth';
import DashboardStats from './components/DashboardStats';
import AnalyticsCharts from './components/AnalyticsCharts';
import useSWR from 'swr';
import { getDashboardStats } from '@/lib/dashboard-actions';
import { getDashboardAnalytics } from '@/lib/report-actions';

// Stat Card Component (kept same)
const StatCard = ({ title, value, icon, bg, color, subText }: { title: string, value: string | number, icon: React.ReactNode, bg: string, color: string, subText: React.ReactNode }) => (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: 1, borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
            <Typography variant="body2" color="text.secondary" fontWeight="medium">{title}</Typography>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: bg, color: color, display: 'flex' }}>
                {icon}
            </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
            <Typography variant="h4" fontWeight="bold">{value}</Typography>
            <Box sx={{ mb: 0.5 }}>{subText}</Box>
        </Box>
    </Paper>
);

interface DashboardProps {
    initialStats: {
        totalEmployees: number;
        activeEmployees: number;
        qrGenerated: number;
        pendingReports: number;
        barChartData: any[]; // {name, value}
        pieChartData: any[]; // {name, value}
    };
    initialActivities: any[];
    initialReports: any[];
    initialAnalytics: any;
}

import GlassCard from '@/components/ui/GlassCard';

// ... (other imports)

export default function AdminDashboard({ initialStats, initialActivities, initialReports, initialAnalytics }: DashboardProps) {
    // SWR for Real-time Stats (Poll every 10s)
    const { data: stats } = useSWR('dashboard-stats', () => getDashboardStats(), {
        fallbackData: initialStats,
        refreshInterval: 10000
    });

    const { data: analytics } = useSWR('dashboard-analytics', () => getDashboardAnalytics(), {
        fallbackData: initialAnalytics,
        refreshInterval: 10000
    });

    const [activities, setActivities] = useState<any[]>(initialActivities);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ background: 'linear-gradient(45deg, #2563eb, #7c3aed)', backgroundClip: 'text', textFillColor: 'transparent', width: 'fit-content' }}>
                        Dashboard Overview
                    </Typography>
                    <Typography variant="body1" color="text.secondary">Welcome to the Administration Portal</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Paper elevation={0} variant="outlined" sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)' }}>
                        <AssessmentIcon color="action" fontSize="small" />
                        <Typography variant="body2" fontWeight="bold">{new Date().toLocaleDateString()}</Typography>
                    </Paper>
                </Box>
            </Box>

            {/* Statistics */}
            <DashboardStats stats={stats} />

            <Grid container spacing={4}>
                {/* Analytics */}
                <Grid item xs={12} lg={8}>
                    <GlassCard sx={{ p: 0, height: '100%', bgcolor: 'rgba(255, 255, 255, 0.6)' }}>
                        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="h6" fontWeight="bold">Analytics Overview</Typography>
                        </Box>
                        <Box sx={{ p: 2 }}>
                            <AnalyticsCharts data={analytics} />
                        </Box>
                    </GlassCard>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12} lg={4}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ px: 1 }}>Quick Actions</Typography>
                    <Grid container spacing={2}>
                        {[{ icon: <PersonAddIcon />, label: 'Add Employee', color: '#1e40af', bg: '#eff6ff', href: '/admin/employees/add' },
                        { icon: <PlaylistAddIcon />, label: 'Manage Employees', color: '#4338ca', bg: '#e0e7ff', href: '/admin/employees' },
                        { icon: <QrCodeScannerIcon />, label: 'ID Cards', color: '#047857', bg: '#ecfdf5', href: '/admin/qr' },
                        { icon: <HistoryEduIcon />, label: 'Reports', color: '#c2410c', bg: '#fff7ed', href: '/admin/reports' }
                        ].map((action, i) => (
                            <Grid item xs={6} key={i}>
                                <GlassCard
                                    component={Link}
                                    href={action.href}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        gap: 2,
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                        bgcolor: 'rgba(255, 255, 255, 0.7)'
                                    }}
                                >
                                    <Box sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        bgcolor: action.bg,
                                        color: action.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                    }}>
                                        {action.icon}
                                    </Box>
                                    <Typography variant="subtitle2" fontWeight="bold" color="text.primary">{action.label}</Typography>
                                </GlassCard>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>

            {/* Recent Activity */}
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
                    <Typography variant="h6" fontWeight="bold">Recent Activity Logs</Typography>
                </Box>
                <GlassCard sx={{ p: 0, overflow: 'hidden', bgcolor: 'rgba(255, 255, 255, 0.6)' }}>
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Entity Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Activity Type</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Details</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Status</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', py: 2 }}>Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {activities.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                            No recent activity found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    activities.map((row, i) => (
                                        <TableRow key={i} hover sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                                            <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', color: 'primary.contrastText', fontSize: '0.875rem' }}>{row.name.charAt(0)}</Avatar>
                                                <Typography variant="body2" fontWeight="medium">{row.name}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">{row.type}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>{row.desc}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={row.status} size="small" color={row.color as any} variant="outlined" sx={{ fontWeight: 600, height: 24 }} />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                                                    {new Date(row.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </GlassCard>
            </Box>

        </Box>
    );
}
