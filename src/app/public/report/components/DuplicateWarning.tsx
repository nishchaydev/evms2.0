'use client';

import { Alert, AlertTitle, Box, Button, Collapse, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

interface DuplicateWarningProps {
    duplicates: any[];
}

export default function DuplicateWarning({ duplicates }: DuplicateWarningProps) {
    if (!duplicates || duplicates.length === 0) return null;

    return (
        <Collapse in={duplicates.length > 0}>
            <Alert
                severity="warning"
                icon={<WarningIcon fontSize="inherit" />}
                sx={{ mb: 3, borderRadius: 2 }}
            >
                <AlertTitle>Potential Duplicates Found</AlertTitle>
                <Typography variant="body2" gutterBottom>
                    We found {duplicates.length} similar report(s) in this area. To save time, you can check if your issue is already reported.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                    {duplicates.slice(0, 2).map((dup) => (
                        <Box key={dup.id} sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 1 }}>
                            <Typography variant="caption" display="block" fontWeight="bold">
                                {new Date(dup.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" noWrap>
                                {dup.description}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Alert>
        </Collapse>
    );
}
