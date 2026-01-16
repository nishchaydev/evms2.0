'use client';

import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, AppBar, Typography, Button } from '@mui/material';
import { SidebarLink } from '@/components/ClientLinks';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import AssessmentIcon from '@mui/icons-material/Assessment';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VerifiedIcon from '@mui/icons-material/Verified';
import LockResetIcon from '@mui/icons-material/LockReset';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Link from 'next/link';
import PageTransition from '@/components/ui/PageTransition';


import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { logout } from '@/lib/auth-actions';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';

const drawerWidth = 240;

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, loading } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = async () => {
        await logout();
    };

    const drawerContent = (
        <Box sx={{ overflow: 'auto' }}>
            <Toolbar />
            <List component="nav">
                <SidebarLink href="/super-admin" selected={pathname === '/super-admin'}>
                    <ListItemIcon>
                        <DashboardIcon color={pathname === '/super-admin' ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </SidebarLink>

                <SidebarLink href="/super-admin/employees" selected={pathname.startsWith('/super-admin/employees')}>
                    <ListItemIcon>
                        <PeopleIcon color={pathname.startsWith('/super-admin/employees') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="All Employees" />
                </SidebarLink>

                <SidebarLink href="/super-admin/verifications" selected={pathname.startsWith('/super-admin/verifications')}>
                    <ListItemIcon>
                        <VerifiedUserIcon color={pathname.startsWith('/super-admin/verifications') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Verifications" />
                </SidebarLink>

                <SidebarLink href="/super-admin/requests" selected={pathname.startsWith('/super-admin/requests')}>
                    <ListItemIcon>
                        <NotificationsIcon color={pathname.startsWith('/super-admin/requests') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Access Requests" />
                </SidebarLink>

                <SidebarLink href="/super-admin/reports" selected={pathname.startsWith('/super-admin/reports')}>
                    <ListItemIcon>
                        <AssessmentIcon color={pathname.startsWith('/super-admin/reports') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="System Reports" />
                </SidebarLink>
            </List>
        </Box>
    );

    if (loading) return null;

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar sx={{ minHeight: 70 }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                        <Box>
                            <Typography variant="caption" sx={{ letterSpacing: 1, textTransform: 'uppercase', opacity: 0.9, display: 'block' }}>
                                Government of India
                            </Typography>
                            <Typography variant="h6" noWrap component="div" fontWeight="bold">
                                Super Admin Portal
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="body2" fontWeight="bold">{user?.username}</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>SUPER_ADMIN</Typography>
                        </Box>
                        <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawerContent}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    <Toolbar />
                    {drawerContent}
                </Drawer>
            </Box>


            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                <Toolbar />
                <PageTransition>
                    {children}
                </PageTransition>
            </Box>
        </Box>
    );
}

