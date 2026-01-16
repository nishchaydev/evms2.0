'use client';

import { Box, Container, Skeleton, Grid } from '@mui/material';
import GlassCard from '@/components/ui/GlassCard';

export default function Loading() {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            {/* Header Skeleton */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: { xs: 2, md: 5 }, py: 1.5, bgcolor: 'background.paper' }}>
                <Skeleton variant="rectangular" width={200} height={32} sx={{ borderRadius: 1 }} />
            </Box>

            <Container maxWidth="md" sx={{ flex: 1, py: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', gap: 4 }}>

                {/* Title Skeleton */}
                <Box>
                    <Skeleton variant="text" width="60%" height={60} />
                    <Skeleton variant="text" width="40%" height={30} />
                </Box>

                {/* Search Card Skeleton */}
                <GlassCard sx={{ p: { xs: 2, md: 4 } }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                            </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Skeleton variant="rectangular" width={150} height={48} sx={{ borderRadius: 2 }} />
                        </Box>
                    </Box>
                </GlassCard>

                {/* Info Cards Skeleton */}
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
