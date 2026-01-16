'use client';
import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import getTheme from './theme';
import { ColorModeProvider, useColorMode } from './ThemeContext';

// Inner component to consume context and use state
const ThemeProviderWrapper = ({ children }: { children: React.ReactNode }) => {
    const { mode } = useColorMode();
    const theme = React.useMemo(() => getTheme(mode), [mode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    return (
        <AppRouterCacheProvider>
            <ColorModeProvider>
                <ThemeProviderWrapper>
                    {children}
                </ThemeProviderWrapper>
            </ColorModeProvider>
        </AppRouterCacheProvider>
    );
}
