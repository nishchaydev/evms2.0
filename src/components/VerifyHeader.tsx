'use client';

import { Box, Container, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import SupportIcon from '@mui/icons-material/ContactSupport';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VerifyHeader() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigate = (path: string) => {
        router.push(path);
        handleClose();
    };

    return (
        <Box component="header" sx={{ width: '100%', bgcolor: 'primary.main', color: 'white', position: 'sticky', top: 0, zIndex: 1100, boxShadow: 3 }}>
            <Container maxWidth="lg" sx={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }} onClick={() => router.push('/')}>
                    <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, backdropFilter: 'blur(4px)' }}>
                        <AccountBalanceIcon sx={{ fontSize: 24, color: 'white' }} />
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>IMC Digital Verification</Typography>
                        <Typography variant="caption" sx={{ color: 'blue.100', opacity: 0.9 }}>Nagar Nigam Official Portal</Typography>
                    </Box>
                </Box>

                <IconButton
                    onClick={handleMenu}
                    sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                >
                    <MenuIcon />
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            borderRadius: 2,
                            minWidth: 180
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={() => handleNavigate('/')}>
                        <ListItemIcon><HomeIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>Home</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigate('/public/report')}>
                        <ListItemIcon><SupportIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>Help & Support</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => handleNavigate('/login')}>
                        <ListItemIcon><LoginIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>Admin Login</ListItemText>
                    </MenuItem>
                </Menu>
            </Container>
        </Box>
    );
}
