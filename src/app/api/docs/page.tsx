import { Box, Typography, Paper, Divider, Chip } from '@mui/material';

export default function ApiDocs() {
    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                API Documentation
                <Chip label="v1.0" color="primary" size="small" sx={{ ml: 2, verticalAlign: 'middle' }} />
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Documentation for internal and public APIs for EVMS 2.0.
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip label="GET" color="success" size="small" />
                    <Typography variant="h6" fontWeight="bold">/api/cron/escalate</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Trigger automated escalation for reports pending more than 24 hours.
                </Typography>
                <Divider />
                <Box sx={{ mt: 2, p: 2, bgcolor: '#0f172a', color: '#fff', borderRadius: 2, fontFamily: 'monospace' }}>
                    {`// Response
{
  "success": true,
  "escalatedCount": 5,
  "message": "Escalated 5 overdue reports to CRITICAL."
}`}
                </Box>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip label="POST" color="warning" size="small" />
                    <Typography variant="h6" fontWeight="bold">/actions/createReport</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Server action to submit a new citizen report. Handles file upload and auto-triage.
                </Typography>
                <Divider />
                <Box sx={{ mt: 2, p: 2, bgcolor: '#0f172a', color: '#fff', borderRadius: 2, fontFamily: 'monospace' }}>
                    {`// Payload (FormData)
description: string (min 10 chars)
category: string
location: string ("lat,lng")
photo: File (optional)`}
                </Box>
            </Paper>

        </Box>
    );
}
