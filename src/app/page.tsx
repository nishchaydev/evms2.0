'use client';

import React from 'react';
import { Box, Button, Container, Typography, Paper, Grid, IconButton } from '@mui/material';
import {
  QrCodeScanner as QrCodeScannerIcon,
  PersonSearch as PersonSearchIcon,
  AccountBalance as AccountBalanceIcon,
  ArrowForward as ArrowForwardIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon
} from '@mui/icons-material';
import Link from 'next/link';
import { useColorMode } from '@/theme/ThemeContext';
import PageTransition from '@/components/ui/PageTransition';

export default function Home() {
  const { mode, toggleColorMode } = useColorMode();
  const isLight = mode === 'light';

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', color: 'text.primary' }}>

      {/* Top Navigation Bar */}
      <Box component="nav" sx={{ borderBottom: 2, borderColor: 'divider', bgcolor: 'background.paper', py: 1.5, px: 3 }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AccountBalanceIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>
              Govt. of Madhya Pradesh
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <IconButton onClick={toggleColorMode} sx={{ border: 2, borderColor: 'divider' }}>
              {isLight ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AdminPanelSettingsIcon />}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                Official Login
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>

      <PageTransition>
        <Container maxWidth={false} sx={{ maxWidth: 1400, flexGrow: 1, py: { xs: 6, md: 12 }, display: 'flex', alignItems: 'center' }}>
          <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">

            <Grid item xs={12} md={7}>
              <Box>
                <Typography variant="overline" color="primary">
                  Nagar Nigam Indore (IMC)
                </Typography>
                <Typography variant="h1" sx={{ fontSize: { xs: '3.5rem', sm: '4.5rem', md: '5.5rem' }, mb: 3 }}>
                  <Box component="span" sx={{ color: 'primary.main' }}>Employee</Box><br />
                  Verification<br />
                  System.
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mb: 6, fontWeight: 400, lineHeight: 1.6 }}>
                  The official portal for field verification, roster management, and citizen complaint tracking for the cleanest city in India.
                </Typography>

                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2, borderLeft: 4, borderColor: 'primary.main', pl: 2, py: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, bgcolor: 'success.main', borderRadius: '50%', boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)' }} />
                  <Typography variant="subtitle2" fontWeight={700}>SYSTEM ONLINE • DATABASE SYNCED</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

                <Link href="/verify" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translate(-4px, -4px)',
                        boxShadow: isLight ? '12px 12px 0px 0px #064E3B' : '12px 12px 0px 0px rgba(52, 211, 153, 0.5)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h5" sx={{ mb: 1 }}>Field Scanner</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 250 }}>Instantly verify employee credentials via secure QR scan.</Typography>
                      </Box>
                      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText', display: 'flex' }}>
                        <QrCodeScannerIcon fontSize="large" />
                      </Box>
                    </Box>
                    <ArrowForwardIcon sx={{ mt: 4, opacity: 0.5, display: 'block', ml: 'auto' }} />
                  </Paper>
                </Link>

                <Link href="/public/search" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translate(-4px, -4px)',
                        boxShadow: isLight ? '12px 12px 0px 0px #064E3B' : '12px 12px 0px 0px rgba(52, 211, 153, 0.5)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h5" sx={{ mb: 1 }}>Public Roster</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 250 }}>Search IMC officials by department, name, or employee ID.</Typography>
                      </Box>
                      <Box sx={{ p: 2, bgcolor: 'background.default', border: 2, borderColor: 'primary.main', color: 'primary.main', display: 'flex' }}>
                        <PersonSearchIcon fontSize="large" />
                      </Box>
                    </Box>
                    <ArrowForwardIcon sx={{ mt: 4, opacity: 0.5, display: 'block', ml: 'auto' }} />
                  </Paper>
                </Link>

                <Box sx={{ pt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Have an issue with an employee?</Typography>
                    <Typography variant="body2" color="text.secondary">Citizens can track raised complaints here.</Typography>
                  </Box>
                  <Link href="/public/track" style={{ textDecoration: 'none' }}>
                    <Button
                      variant="text"
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                    >
                      Track Status
                    </Button>
                  </Link>
                </Box>

              </Box>
            </Grid>

          </Grid>
        </Container>
      </PageTransition>

      <Box component="footer" sx={{ mt: 'auto', borderTop: 2, borderColor: 'divider', bgcolor: 'background.paper', py: 4, px: 3 }}>
        <Container maxWidth={false} sx={{ maxWidth: 1400, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
          <Box>
            <Typography variant="h6">EVMS 2.0</Typography>
            <Typography variant="caption" color="text.secondary">© 2026 Indore Municipal Corporation. Official Release.</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Link href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>LEGAL</Link>
            <Link href="#" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>SUPPORT</Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
