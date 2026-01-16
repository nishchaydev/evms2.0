'use client';

import { Box, Button, Container, Typography, Paper, Grid, Divider, IconButton, Card, CardActionArea, CardContent } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HelpIcon from '@mui/icons-material/Help';
import InfoIcon from '@mui/icons-material/Info';
import Link from 'next/link';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorMode } from '@/theme/ThemeContext';
import PageTransition from '@/components/ui/PageTransition';
import GlassCard from '@/components/ui/GlassCard';

export default function Home() {
  const { mode, toggleColorMode } = useColorMode();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box component="header" sx={{ bgcolor: 'primary.main', color: 'white', boxShadow: 1, py: 2 }}>
        <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: { xs: 40, md: 48 }, height: { xs: 40, md: 48 },
              bgcolor: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <AccountBalanceIcon style={{ fontSize: '28px', width: '28px', height: '28px' }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1, opacity: 0.9, fontWeight: 500, fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                Nagar Nigam (IMC)
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                Employee Verification Portal
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {/* Dark Mode Toggle */}
            <IconButton onClick={toggleColorMode} sx={{ color: 'inherit' }}>
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            {/* Help Link */}
            <Box component={Link} href="/public/report" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5, opacity: 0.9, cursor: 'pointer', '&:hover': { opacity: 1 }, color: 'inherit', textDecoration: 'none' }}>
              <HelpIcon style={{ fontSize: '20px', width: '20px', height: '20px' }} />
              <Typography variant="body2" fontWeight={500}>Help</Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container component="main" maxWidth="md" sx={{ flexGrow: 1, py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <PageTransition>
          <Box sx={{ maxWidth: 600, width: '100%', display: 'flex', flexDirection: 'column', gap: 4, mx: 'auto' }}>

            {/* Hero Text */}
            <Box sx={{ textAlign: 'center', mb: { xs: 1, md: 2 } }}>
              <Typography variant="h4" color="text.primary" fontWeight={900} gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
                Welcome to the Verification System
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, px: { xs: 2, md: 0 } }}>
                Select an option below to verify an employee identity using the digital roster.
              </Typography>
            </Box>

            {/* Action Cards */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <GlassCard delay={0.1} sx={{ height: '100%' }}>
                  <CardActionArea component={Link} href="/verify" sx={{ p: { xs: 2, md: 3 }, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <Box sx={{ width: 64, height: 64, bgcolor: 'rgba(31, 137, 229, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', mb: 2 }}>
                      <QrCodeScannerIcon style={{ fontSize: '32px', width: '32px', height: '32px' }} />
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Scan QR Code</Typography>
                    <Typography variant="body2" color="text.secondary">Use camera to scan ID badge</Typography>
                  </CardActionArea>
                </GlassCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <GlassCard delay={0.2} sx={{ height: '100%' }}>
                  <CardActionArea component={Link} href="/public/search" sx={{ p: { xs: 2, md: 3 }, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <Box sx={{ width: 64, height: 64, bgcolor: 'rgba(31, 137, 229, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', mb: 2 }}>
                      <PersonSearchIcon style={{ fontSize: '32px', width: '32px', height: '32px' }} />
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Search Employee</Typography>
                    <Typography variant="body2" color="text.secondary">Search by name, ID or dept</Typography>
                  </CardActionArea>
                </GlassCard>
              </Grid>
              <Grid item xs={12} sm={4}>
                <GlassCard delay={0.3} sx={{ height: '100%' }}>
                  <CardActionArea component={Link} href="/public/track" sx={{ p: { xs: 2, md: 3 }, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <Box sx={{ width: 64, height: 64, bgcolor: 'rgba(31, 137, 229, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', mb: 2 }}>
                      <InfoIcon style={{ fontSize: '32px', width: '32px', height: '32px' }} />
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>Track Report</Typography>
                    <Typography variant="body2" color="text.secondary">Check report status</Typography>
                  </CardActionArea>
                </GlassCard>
              </Grid>
            </Grid>

            {/* Divider */}
            <Divider sx={{ my: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ bgcolor: 'background.default', px: 1 }}>
                Authorized Personnel Only
              </Typography>
            </Divider>

            {/* Officer Login */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                component={Link}
                href="/login"
                variant="outlined"
                size="large"
                startIcon={<LoginIcon />}
                sx={{ py: 1.5, px: 4, borderRadius: 2, textTransform: 'none', fontWeight: 700, borderColor: 'divider', color: 'text.primary', bgcolor: 'background.paper', '&:hover': { bgcolor: 'grey.50', borderColor: 'primary.main', color: 'primary.main' } }}
              >
                Officer / Admin Login
              </Button>
            </Box>

            {/* Status Card */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'flex', gap: 2 }}>
              <InfoIcon color="primary" style={{ marginTop: '4px', fontSize: '20px', width: '20px', height: '20px' }} />
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">System Status: Online</Typography>
                <Typography variant="caption" color="text.secondary">
                  Database updated: Today, 09:00 AM. Ensure you have an active internet connection.
                </Typography>
              </Box>
            </Paper>

          </Box>
        </PageTransition>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ py: 4, px: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', textAlign: 'center' }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 2 }}>
            {['Privacy Policy', 'Terms of Service', 'Support'].map((text) => (
              <Typography key={text} variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                {text}
              </Typography>
            ))}
          </Box>
          <Typography variant="body2" color="text.secondary">
            © 2024 Nagar Nigam (IMC). All rights reserved.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7 }}>
            Version 2.0.1 • Official Government Portal
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
