'use client';

import { useState, useTransition } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    Box,
    InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
import { createUser } from '@/lib/user-actions';
import { DEPARTMENTS } from '@/lib/constants';

export default function AddUserButton() {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        role: 'OFFICER',
        department: ''
    });

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setError('');
        setFormData({ name: '', username: '', password: '', role: 'OFFICER', department: '' });
    };

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setError('');
        if (!formData.name || !formData.username || !formData.password) {
            setError('All fields are required.');
            return;
        }

        // Security: Enforce Department
        if (formData.role !== 'SUPER_ADMIN' && !formData.department) {
            setError('Department is required for this role.');
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('username', formData.username);
        data.append('password', formData.password);
        data.append('role', formData.role);
        if (formData.department) {
            data.append('department', formData.department);
        }

        startTransition(async () => {
            const res = await createUser(data);
            if (res.success) {
                handleClose();
            } else {
                setError(res.error || 'Failed to create user.');
            }
        });
    };

    return (
        <>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleClickOpen}
                sx={{ borderRadius: 2, px: 3, py: 1.5, fontWeight: 600, textTransform: 'none' }}
            >
                Add New User
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 'bold', borderBottom: 1, borderColor: 'divider' }}>
                    Add New System User
                </DialogTitle>
                <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>

                    {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}

                    <Box sx={{ mt: 1 }}>
                        <TextField
                            autoFocus
                            name="name"
                            label="Full Name"
                            placeholder="e.g. Rajesh Kumar"
                            fullWidth
                            variant="outlined"
                            value={formData.name}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><BadgeIcon color="action" /></InputAdornment>,
                            }}
                        />
                    </Box>

                    <TextField
                        name="username"
                        label="Username"
                        placeholder="e.g. rajesh.kumar"
                        fullWidth
                        variant="outlined"
                        value={formData.username}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>,
                        }}
                    />

                    <TextField
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={formData.password}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><LockIcon color="action" /></InputAdornment>,
                        }}
                    />

                    <FormControl fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select
                            name="role"
                            value={formData.role}
                            label="Role"
                            onChange={handleChange}
                        >
                            <MenuItem value="ADMIN">Admin (Full Operational Access)</MenuItem>
                            <MenuItem value="MANAGER">Manager (Limited Access)</MenuItem>
                            <MenuItem value="OFFICER">Officer (Verification Only)</MenuItem>
                            <MenuItem value="COMMISSIONER">Commissioner</MenuItem>
                            <MenuItem value="HOD">Head of Department (HOD)</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Department</InputLabel>
                        <Select
                            name="department"
                            value={formData.department}
                            label="Department"
                            onChange={handleChange}
                        >
                            <MenuItem value="">None</MenuItem>
                            {DEPARTMENTS.map((dept) => (
                                <MenuItem key={dept} value={dept}>
                                    {dept}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
                    <Button onClick={handleClose} sx={{ fontWeight: 600, color: 'text.secondary' }}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={isPending}
                        sx={{ fontWeight: 600, px: 3 }}
                    >
                        {isPending ? 'Creating...' : 'Create User'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
