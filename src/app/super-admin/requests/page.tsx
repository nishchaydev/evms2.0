'use client';

import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useEffect, useState } from 'react';
import { getPendingRequests, resolvePasswordRequest } from '@/lib/password-actions';

interface Request {
    id: string;
    status: string;
    createdAt: Date;
    user: {
        name: string;
        username: string;
        role: { name: string };
    };
}

export default function PasswordRequestsPage() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchRequests = async () => {
        setLoading(true);
        const data = await getPendingRequests();
        setRequests(data as any);
        setLoading(false);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleOpen = (req: Request) => {
        setSelectedRequest(req);
        setNewPassword('');
        setMessage('');
    };

    const handleClose = () => {
        setSelectedRequest(null);
    };

    const handleAction = async (action: 'APPROVE' | 'REJECT') => {
        if (!selectedRequest) return;
        setActionLoading(true);

        // For reject, no password needed
        const pass = action === 'APPROVE' ? newPassword : '';

        const result = await resolvePasswordRequest(selectedRequest.id, pass, action);

        if (result.success) {
            handleClose();
            fetchRequests();
        } else {
            setMessage(result.message || 'Failed');
        }
        setActionLoading(false);
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>Password Requests</Typography>
                <Typography variant="body1" color="text.secondary">Review and approve password reset requests from users.</Typography>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Requested At</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}><CircularProgress /></TableCell>
                                </TableRow>
                            ) : requests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No pending requests.</TableCell>
                                </TableRow>
                            ) : (
                                requests.map((req) => (
                                    <TableRow key={req.id} hover>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight="bold">{req.user.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">@{req.user.username}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={req.user.role.name} size="small" variant="outlined" />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{new Date(req.createdAt).toLocaleDateString()}</Typography>
                                            <Typography variant="caption" color="text.secondary">{new Date(req.createdAt).toLocaleTimeString()}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={req.status} color="warning" size="small" />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<LockResetIcon />}
                                                onClick={() => handleOpen(req)}
                                                sx={{ borderRadius: 2, textTransform: 'none' }}
                                            >
                                                Resolve
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Resolve Dialog */}
            <Dialog open={!!selectedRequest} onClose={handleClose} maxWidth="xs" fullWidth>
                {selectedRequest && (
                    <>
                        <DialogTitle sx={{ fontWeight: 'bold' }}>Reset Password</DialogTitle>
                        <DialogContent>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">User:</Typography>
                                <Typography variant="subtitle1" fontWeight="bold">{selectedRequest.user.name}</Typography>
                            </Box>

                            {message && <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>}

                            <TextField
                                fullWidth
                                label="New Password"
                                type="text" // Visible for admin to copy-paste easily
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                sx={{ mb: 1 }}
                                autoComplete="off"
                            />
                            <Typography variant="caption" color="text.secondary">
                                Provide this new password to the user securely.
                            </Typography>
                        </DialogContent>
                        <DialogActions sx={{ p: 2 }}>
                            <Button onClick={() => handleAction('REJECT')} color="error" disabled={actionLoading} startIcon={<CancelIcon />}>
                                Reject
                            </Button>
                            <Button
                                onClick={() => handleAction('APPROVE')}
                                variant="contained"
                                disabled={actionLoading || !newPassword.trim()}
                                startIcon={actionLoading ? <CircularProgress size={16} color="inherit" /> : <CheckCircleIcon />}
                            >
                                Set Password
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

        </Box>
    );
}
