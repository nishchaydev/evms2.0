'use client';

import { motion } from 'framer-motion';
import { Box, Paper, Typography, Grid } from '@mui/material';
import {
    Users,
    UserCheck,
    QrCode,
    AlertTriangle,
    TrendingUp
} from 'lucide-react';

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    delay: number;
}

const StatCard = ({ title, value, icon, color, delay }: StatCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
    >
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)'
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Typography variant="body2" color="text.secondary" fontWeight="600">
                    {title}
                </Typography>
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: 3,
                        bgcolor: `${color}15`,
                        color: color,
                        display: 'flex'
                    }}
                >
                    {icon}
                </Box>
            </Box>
            <Box>
                <Typography variant="h3" fontWeight="bold" sx={{ color: 'text.primary' }}>
                    {value.toLocaleString()}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                    <TrendingUp size={16} color="#10b981" />
                    <Typography variant="caption" color="success.main" fontWeight="600">
                        +12% vs last month
                    </Typography>
                </Box>
            </Box>
        </Paper>
    </motion.div>
);

export default function DashboardStats({ stats }: { stats: any }) {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={3}>
                <StatCard
                    title="Total Employees"
                    value={stats.totalEmployees}
                    icon={<Users size={24} />}
                    color="#2563eb"
                    delay={0.1}
                />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
                <StatCard
                    title="Active Verified"
                    value={stats.activeEmployees}
                    icon={<UserCheck size={24} />}
                    color="#059669"
                    delay={0.2}
                />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
                <StatCard
                    title="QR Issued"
                    value={stats.qrGenerated}
                    icon={<QrCode size={24} />}
                    color="#7c3aed"
                    delay={0.3}
                />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
                <StatCard
                    title="Pending Reports"
                    value={stats.pendingReports}
                    icon={<AlertTriangle size={24} />}
                    color="#dc2626"
                    delay={0.4}
                />
            </Grid>
        </Grid>
    );
}
