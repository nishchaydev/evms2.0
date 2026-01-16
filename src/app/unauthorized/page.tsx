'use client';
import { Button, Container, Typography, Box } from '@mui/material';
import Link from 'next/link';

export default function UnauthorizedPage() {
    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 10 }}>
            <Typography variant="h2" color="error" gutterBottom>
                Access Denied
            </Typography>
            <Typography variant="body1" paragraph>
                You do not have permission to view this page.
            </Typography>
            <Box sx={{ mt: 4 }}>
                <Button variant="contained" component={Link} href="/login">
                    Back to Login
                </Button>
            </Box>
        </Container>
    );
}
