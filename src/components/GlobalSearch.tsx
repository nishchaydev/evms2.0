'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Box,
    TextField,
    InputAdornment,
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    CircularProgress,
    Fade,
    IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { useRouter } from 'next/navigation';
import { searchEmployees } from '@/lib/employee-actions';

export default function GlobalSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length >= 2) {
                setLoading(true);
                const data = await searchEmployees(query);
                setResults(data);
                setLoading(false);
                setOpen(true);
            } else {
                setResults([]);
                setOpen(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (id: string) => {
        setOpen(false);
        setQuery('');
        router.push(`/admin/employees/${id}`);
    };

    return (
        <Box ref={containerRef} sx={{ position: 'relative', width: { xs: '100%', sm: 300, md: 400 } }}>
            <TextField
                fullWidth
                size="small"
                placeholder="Quick search employee..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                    },
                    '& .MuiInputBase-input::placeholder': { color: 'rgba(255, 255, 255, 0.6)' }
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                        </InputAdornment>
                    ),
                    endAdornment: query && (
                        <InputAdornment position="end">
                            <IconButton size="small" onClick={() => setQuery('')}>
                                <CloseIcon sx={{ color: 'white', fontSize: 18 }} />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />

            <Fade in={open}>
                <Paper
                    elevation={4}
                    sx={{
                        position: 'absolute',
                        top: '120%',
                        left: 0,
                        right: 0,
                        zIndex: 1400,
                        borderRadius: 3,
                        overflow: 'hidden',
                        bgcolor: 'white',
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <List sx={{ py: 0 }}>
                        {loading ? (
                            <Box sx={{ p: 2, textAlign: 'center' }}>
                                <CircularProgress size={24} />
                            </Box>
                        ) : results.length > 0 ? (
                            results.map((emp) => (
                                <ListItem
                                    key={emp.id}
                                    component="div"
                                    onClick={() => handleSelect(emp.id)}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.05)' }
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar src={emp.photoUrl}>
                                            <PersonIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography fontWeight="bold" variant="body2" color="text.primary">
                                                {emp.firstName} {emp.lastName}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="caption" color="text.secondary">
                                                {emp.employeeCode} • {emp.designation}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <Box sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">No results found</Typography>
                            </Box>
                        )}
                        <Box sx={{ p: 1, bgcolor: 'rgba(0,0,0,0.02)', textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="caption" color="primary" fontWeight="bold">
                                One-Click history access enabled
                            </Typography>
                        </Box>
                    </List>
                </Paper>
            </Fade>
        </Box>
    );
}
