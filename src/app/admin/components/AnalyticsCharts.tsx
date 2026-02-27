'use client';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Box, Paper, Typography, Grid, useTheme } from '@mui/material';
import GlassCard from '@/components/ui/GlassCard';

interface AnalyticsProps {
    data: {
        statusCounts: { name: string; value: number }[];
        deptCounts: { name: string; value: number }[];
        priorityCounts: { name: string; value: number }[];
    }
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#64748b'];

export default function AnalyticsCharts({ data }: AnalyticsProps) {
    const theme = useTheme();

    if (!data) {
        return (
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                    <GlassCard sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                        <Typography color="text.secondary">Loading Analytics...</Typography>
                    </GlassCard>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Status Distribution (Pie) */}
            <Grid item xs={12} md={4}>
                <GlassCard sx={{ p: { xs: 2, md: 3 }, height: '100%', minHeight: { xs: 350, md: 400 } }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Report Status
                    </Typography>
                    {(!data.statusCounts || data.statusCounts.length === 0) ? (
                        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                            <Typography variant="body2" color="text.secondary">No Status Data</Typography>
                        </Box>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data.statusCounts}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                >
                                    {data.statusCounts.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: theme.shadows[4] }} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </GlassCard>
            </Grid>

            {/* Department Load (Bar) */}
            <Grid item xs={12} md={8}>
                <GlassCard sx={{ p: { xs: 2, md: 3 }, height: '100%', minHeight: { xs: 350, md: 400 } }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Reports per Department
                    </Typography>
                    {(!data.deptCounts || data.deptCounts.length === 0) ? (
                        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                            <Typography variant="body2" color="text.secondary">No Department Data</Typography>
                        </Box>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={data.deptCounts}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                                <YAxis stroke={theme.palette.text.secondary} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: theme.palette.background.paper,
                                        borderRadius: 12,
                                        border: 'none',
                                        boxShadow: theme.shadows[4]
                                    }}
                                />
                                <Bar dataKey="value" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} name="Reports" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </GlassCard>
            </Grid>

            {/* Priority Breakdown (Bar/Line Mix) */}
            <Grid item xs={12}>
                <GlassCard sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Urgency Analysis
                    </Typography>
                    {(!data.priorityCounts || data.priorityCounts.length === 0) ? (
                        <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                            <Typography variant="body2" color="text.secondary">No Priority Data</Typography>
                        </Box>
                    ) : (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart
                                layout="vertical"
                                data={data.priorityCounts}
                                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                                <XAxis type="number" stroke={theme.palette.text.secondary} />
                                <YAxis type="category" dataKey="name" stroke={theme.palette.text.secondary} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{
                                        backgroundColor: theme.palette.background.paper,
                                        borderRadius: 12,
                                        border: 'none',
                                        boxShadow: theme.shadows[4]
                                    }}
                                />
                                <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} name="Count" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </GlassCard>
            </Grid>
        </Grid>
    );
}
