'use client';

import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Switch,
    FormControlLabel,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Divider,
    Alert,
    Chip
} from '@mui/material';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import BackupIcon from '@mui/icons-material/Backup';
import RestoreIcon from '@mui/icons-material/Restore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import LanguageIcon from '@mui/icons-material/Language';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import LockClockIcon from '@mui/icons-material/LockClock';

export default function SettingsPage() {
    return (
        <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh', bgcolor: 'background.default' }}>
            <Box sx={{ maxWidth: 'xl', mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>

                {/* Header */}
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>System Settings & Data Backup</Typography>
                    <Typography variant="body1" color="text.secondary">Configure system preferences, manage secure data backups, and review retention policies.</Typography>
                </Box>

                <Grid container spacing={4}>

                    {/* Left Col - Settings */}
                    <Grid item xs={12} lg={8} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

                        {/* Backup Card */}
                        <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', overflow: 'hidden' }}>
                            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ p: 1, bgcolor: 'primary.light', color: 'primary.main', borderRadius: 2 }}>
                                        <CloudSyncIcon />
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">Data Backup & Recovery</Typography>
                                        <Typography variant="body2" color="text.secondary">Manage secure employee data archives</Typography>
                                    </Box>
                                </Box>
                                <Chip
                                    icon={<Box sx={{ width: 8, height: 8, bgcolor: 'success.main', borderRadius: '50%' }} />}
                                    label="System Healthy"
                                    size="small"
                                    color="success"
                                    sx={{ bgcolor: 'success.light', color: 'success.dark', fontWeight: 'bold' }}
                                />
                            </Box>
                            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Paper variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'action.hover' }}>
                                    <Box>
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary" textTransform="uppercase">Last Successful Backup</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                            <CheckCircleIcon color="success" fontSize="small" />
                                            <Typography variant="body2" fontWeight="medium">October 24, 2023 at 14:00 IST</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary" textTransform="uppercase">Total Backup Size</Typography>
                                        <Typography variant="body2" fontWeight="medium" mt={0.5}>2.4 GB</Typography>
                                    </Box>
                                </Paper>

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button variant="contained" startIcon={<BackupIcon />} fullWidth sx={{ py: 1.5 }}>Backup Employee Data</Button>
                                    <Button variant="outlined" startIcon={<RestoreIcon />} fullWidth sx={{ py: 1.5 }}>Restore From Backup</Button>
                                </Box>

                                <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                    <InfoIcon fontSize="inherit" /> Backups are encrypted and stored in the secure government cloud vault.
                                </Typography>
                            </Box>
                        </Paper>

                        {/* General Config */}
                        <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', overflow: 'hidden' }}>
                            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                                <Typography variant="h6" fontWeight="bold">General Configuration</Typography>
                            </Box>
                            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12} sm={8}>
                                        <Typography variant="subtitle2" fontWeight="bold">System Language</Typography>
                                        <Typography variant="caption" color="text.secondary">Select the default interface language for admin console.</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <FormControl fullWidth size="small">
                                            <Select defaultValue="en">
                                                <MenuItem value="en">English</MenuItem>
                                                <MenuItem value="hi">Hindi (हिंदी)</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Divider />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">Email Notifications</Typography>
                                        <Typography variant="caption" color="text.secondary">Receive daily digests of verification requests.</Typography>
                                    </Box>
                                    <Switch />
                                </Box>
                            </Box>
                        </Paper>

                        {/* Security Settings */}
                        <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', overflow: 'hidden' }}>
                            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                                <Typography variant="h6" fontWeight="bold">Security Settings</Typography>
                            </Box>
                            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">Enforce Two-Factor Authentication (2FA)</Typography>
                                        <Typography variant="caption" color="text.secondary">Require all admin users to use OTP for login.</Typography>
                                    </Box>
                                    <Switch defaultChecked />
                                </Box>
                                <Divider />
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12} sm={8}>
                                        <Typography variant="subtitle2" fontWeight="bold">Session Timeout Policy</Typography>
                                        <Typography variant="caption" color="text.secondary">Automatically log out inactive users.</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <FormControl fullWidth size="small">
                                            <Select defaultValue="30">
                                                <MenuItem value="15">15 Minutes</MenuItem>
                                                <MenuItem value="30">30 Minutes</MenuItem>
                                                <MenuItem value="60">1 Hour</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>

                    </Grid>

                    {/* Right Col - Info */}
                    <Grid item xs={12} lg={4} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

                        {/* Policy Summary */}
                        <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', overflow: 'hidden' }}>
                            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider', bgcolor: 'primary.50' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', mb: 1 }}>
                                    <SecurityIcon fontSize="small" />
                                    <Typography variant="caption" fontWeight="bold" textTransform="uppercase">Policy Summary</Typography>
                                </Box>
                                <Typography variant="h6" fontWeight="bold">Data Retention & Privacy</Typography>
                            </Box>
                            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <FolderSharedIcon color="action" />
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">Employee Records</Typography>
                                        <Typography variant="caption" color="text.secondary">Retained for 5 years post-exit as per IMC regulations.</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <HistoryEduIcon color="action" />
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">Audit Logs</Typography>
                                        <Typography variant="caption" color="text.secondary">Archived quarterly. Accessible by Chief Data Officer only.</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <LockClockIcon color="action" />
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">Backup Retention</Typography>
                                        <Typography variant="caption" color="text.secondary">Daily snapshots are kept for 30 days. Monthly archives for 1 year.</Typography>
                                    </Box>
                                </Box>
                                <Divider />
                                <Button size="small" endIcon={<ArrowForwardIcon />} sx={{ justifyContent: 'flex-start' }}>Read Full Privacy Policy</Button>
                            </Box>
                        </Paper>

                        {/* Support */}
                        <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Need Assistance?</Typography>
                            <Typography variant="body2" color="text.secondary" mb={2}>For critical system failures or backup restoration issues, contact the IT Cell immediately.</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Button variant="outlined" startIcon={<CallIcon />} fullWidth sx={{ justifyContent: 'flex-start', color: 'text.primary', borderColor: 'divider' }}>+91 731-123-4567</Button>
                                <Button variant="outlined" startIcon={<EmailIcon />} fullWidth sx={{ justifyContent: 'flex-start', color: 'text.primary', borderColor: 'divider' }}>support@imc.gov.in</Button>
                            </Box>
                        </Paper>
                    </Grid>

                </Grid>

            </Box>
        </Box>
    );
}
