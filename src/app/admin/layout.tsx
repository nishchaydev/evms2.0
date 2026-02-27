'use client';

import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, AppBar, Typography, Button, Divider } from '@mui/material';
import { SidebarLink } from '@/components/ClientLinks';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import VerifiedIcon from '@mui/icons-material/Verified';
import Link from 'next/link';
import PageTransition from '@/components/ui/PageTransition';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, useTheme, useMediaQuery } from '@mui/material';

const drawerWidth = 240;

import { useAuth } from '@/providers/AuthProvider';
import { logout } from '@/lib/auth-actions';
import GlobalSearch from '@/components/GlobalSearch';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, hasRole, loading } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = async () => {
        await logout();
    };

    const drawerContent = (
        <Box sx={{ overflow: 'auto' }}>
            <Toolbar /> {/* Spacer context */}
            <List component="nav">
                <SidebarLink href="/admin" selected={pathname === '/admin'}>
                    <ListItemIcon>
                        <DashboardIcon color={pathname === '/admin' ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </SidebarLink>

                <SidebarLink href="/admin/employees" selected={pathname.startsWith('/admin/employees')}>
                    <ListItemIcon>
                        <PeopleIcon color={pathname.startsWith('/admin/employees') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Employees" />
                </SidebarLink>

                <SidebarLink href="/admin/qr" selected={pathname.startsWith('/admin/qr')}>
                    <ListItemIcon>
                        <QrCodeScannerIcon color={pathname.startsWith('/admin/qr') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Employee ID Cards" />
                </SidebarLink>

                <SidebarLink href="/admin/verifications" selected={pathname.startsWith('/admin/verifications')}>
                    <ListItemIcon>
                        <VerifiedIcon color={pathname.startsWith('/admin/verifications') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Verifications" />
                </SidebarLink>


                <SidebarLink href="/admin/reports" selected={pathname.startsWith('/admin/reports')}>
                    <ListItemIcon>
                        <AssessmentIcon color={pathname.startsWith('/admin/reports') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Reports" />
                </SidebarLink>

                <Divider sx={{ my: 1 }} />

                <SidebarLink href="/admin/settings" selected={pathname.startsWith('/admin/settings')}>
                    <ListItemIcon>
                        <SettingsIcon color={pathname.startsWith('/admin/settings') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                </SidebarLink>
            </List>
        </Box>
    );

    if (loading) return null; // Or a skeleton

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
                        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                            <Typography variant="caption" sx={{ letterSpacing: 1, textTransform: 'uppercase', opacity: 0.9, display: 'block' }}>
                                Nagar Nigam Portal
                            </Typography>
                            <Typography variant="h6" noWrap component="div" fontWeight="bold">
                                EVMS Admin Portal
                            </Typography>
                        </Box>


                        <Box sx={{ ml: { md: 4, xs: 0 }, flexGrow: { xs: 1, md: 0 } }}>
                            <GlobalSearch />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="body2" fontWeight="bold">{user?.username}</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>{user?.role}</Typography>
                        </Box>
                        <Button
                            color="inherit"
                            onClick={handleLogout}
                            startIcon={<LogoutIcon />}
                            sx={{
                                minWidth: 'fit-content',
                                px: { xs: 1, sm: 2 },
                                '& .MuiButton-startIcon': { mr: { xs: 0, sm: 1 } }
                            }}
                        >
                            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Logout</Box>
                        </Button>
                    </Box>

                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawerContent}
                </Drawer>

                {/* Desktop Drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    <Toolbar /> {/* Top padding for spacer */}
                    {drawerContent}
                </Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                <Toolbar />
                <PageTransition>
                    {children}
                </PageTransition>
            </Box>
        </Box >
    );
}
