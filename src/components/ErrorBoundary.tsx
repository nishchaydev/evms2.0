'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <Box sx={{
                    p: 3,
                    border: '1px dashed red',
                    borderRadius: 2,
                    bgcolor: '#fff5f5',
                    textAlign: 'center'
                }}>
                    <WarningIcon color="error" fontSize="large" sx={{ mb: 1 }} />
                    <Typography variant="h6" color="error">Something went wrong.</Typography>
                    <Button
                        onClick={() => this.setState({ hasError: false })}
                        sx={{ mt: 2 }}
                        variant="outlined"
                        color="error"
                    >
                        Try again
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}
