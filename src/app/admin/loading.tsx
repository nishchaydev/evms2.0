import { Box, Skeleton, Grid, Paper } from '@mui/material';

export default function AdminLoading() {
    return (
        <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Header Skeleton */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                <Box>
                    <Skeleton variant="text" width={200} height={60} />
                    <Skeleton variant="text" width={300} height={30} />
                </Box>
                <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 2 }} />
            </Box>

            {/* Stats Grid Skeleton */}
            <Grid container spacing={3}>
                {[1, 2, 3, 4].map((i) => (
                    <Grid item xs={12} sm={6} lg={3} key={i}>
                        <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 4 }} />
                    </Grid>
                ))}
            </Grid>

            {/* Content Skeleton */}
            <Grid container spacing={4}>
                <Grid item xs={12} lg={8}>
                    <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
                </Grid>
            </Grid>
        </Box>
    );
}
