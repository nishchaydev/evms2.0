import { Box, Skeleton, Card, CardContent, Grid } from '@mui/material';

export default function Loading() {
    return (
        <Box sx={{ p: 4 }}>
            <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={300} height={20} sx={{ mb: 4 }} />

            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <Skeleton variant="rectangular" height={40} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Skeleton variant="rectangular" height={40} />
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Skeleton variant="rectangular" width={100} height={40} />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Box key={i} sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <Skeleton variant="circular" width={40} height={40} />
                            <Box sx={{ flex: 1 }}>
                                <Skeleton variant="text" width="60%" />
                                <Skeleton variant="text" width="40%" />
                            </Box>
                        </Box>
                    ))}
                </CardContent>
            </Card>
        </Box>
    );
}
