'use client';

import { Box, Typography, Paper, Switch, List, ListItem, ListItemText, ListItemSecondaryAction, Divider } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useColorMode } from '@/theme/ThemeContext';
import { useState, useEffect } from 'react';

interface SettingsFormProps {
    initialSettings: any;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
    const { mode, toggleColorMode } = useColorMode();
    const [emailNotifs, setEmailNotifs] = useState(initialSettings?.emailNotifs || true);
    const [smsAlerts, setSmsAlerts] = useState(initialSettings?.smsAlerts || false);
    const [loading, setLoading] = useState(false);

    const saveSettings = async (email: boolean, sms: boolean) => {
        try {
            const { updateUserSettings } = await import('@/lib/settings-actions');
            await updateUserSettings({ emailNotifs: email, smsAlerts: sms });
        } catch (e) {
            console.error("Failed to save settings", e);
        }
    };

    const toggleEmail = () => {
        const newVal = !emailNotifs;
        setEmailNotifs(newVal);
        saveSettings(newVal, smsAlerts);
    };

    const toggleSms = () => {
        const newVal = !smsAlerts;
        setSmsAlerts(newVal);
        saveSettings(emailNotifs, newVal);
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ maxWidth: 'md', mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>

                {/* Header */}
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>Settings</Typography>
                    <Typography variant="body1" color="text.secondary">Manage system preferences and notifications.</Typography>
                </Box>

                <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', overflow: 'hidden' }}>
                    <List>
                        <ListItem sx={{ p: 3 }}>
                            <ListItemText primary="Email Notifications" secondary="Receive emails for new report submissions" />
                            <ListItemSecondaryAction>
                                <Switch checked={emailNotifs} onChange={toggleEmail} />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem sx={{ p: 3 }}>
                            <ListItemText primary="SMS Alerts" secondary="Receive urgent alerts via SMS" />
                            <ListItemSecondaryAction>
                                <Switch checked={smsAlerts} onChange={toggleSms} />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem sx={{ p: 3 }}>
                            <ListItemText primary="Dark Mode" secondary="Toggle dark mode theme" />
                            <ListItemSecondaryAction>
                                <Switch checked={mode === 'dark'} onChange={toggleColorMode} />
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </Paper>
            </Box>
        </Box>
    );
}
