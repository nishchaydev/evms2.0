'use client';
import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const getTheme = (mode: 'light' | 'dark') => createTheme({
    typography: {
        fontFamily: roboto.style.fontFamily,
        h1: { fontSize: '2.5rem', fontWeight: 600, color: mode === 'light' ? '#263238' : '#fff' },
        h2: { fontSize: '2rem', fontWeight: 600, color: mode === 'light' ? '#263238' : '#fff' },
        h6: { fontWeight: 600 },
        button: { fontWeight: 600 },
    },
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // Light Mode Palette (UX4G Inspired)
                primary: {
                    main: '#0A2647', // Deep Navy Blue (Government/Official)
                    light: '#2C5F8D',
                    dark: '#051628',
                    contrastText: '#ffffff',
                },
                secondary: {
                    main: '#FF9933', // Saffron Accent (India)
                    light: '#FFB870',
                    dark: '#C77000',
                    contrastText: '#000000',
                },
                background: {
                    default: '#F5F7FA', // Cool Grey/White background
                    paper: '#ffffff',
                },
                text: {
                    primary: '#1A1A1A', // Sharp Black for readability
                    secondary: '#555555',
                },
                success: {
                    main: '#138808', // India Green
                },
                warning: {
                    main: '#FF9933', // India Saffron
                },
                error: {
                    main: '#D32F2F', // Standard Red
                },
                info: {
                    main: '#0288D1', // Info Blue
                }
            }
            : {
                // Dark Mode Palette
                primary: {
                    main: '#90caf9',
                    light: '#e3f2fd',
                    dark: '#42a5f5',
                    contrastText: 'rgba(0, 0, 0, 0.87)',
                },
                secondary: {
                    main: '#ce93d8',
                    light: '#f3e5f5',
                    dark: '#ab47bc',
                    contrastText: 'rgba(0, 0, 0, 0.87)',
                },
                background: {
                    default: '#121212',
                    paper: '#1e1e1e',
                },
                text: {
                    primary: '#fff',
                    secondary: 'rgba(255, 255, 255, 0.7)',
                },
            }),
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: mode === 'light' ? '#0A2647' : '#272727', // Official Navy
                    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.1)', // Subtle shadow
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 4, // Slightly sharper corners (Professional)
                    fontWeight: 600,
                    paddingTop: 8,
                    paddingBottom: 8,
                },
                containedPrimary: {
                    backgroundColor: mode === 'light' ? '#0A2647' : '#90caf9',
                    '&:hover': {
                        backgroundColor: mode === 'light' ? '#051628' : '#42a5f5',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 8, // Standard radius
                    boxShadow: mode === 'light'
                        ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' // Clean, subtle shadow
                        : '0 1px 3px 0 rgb(0 0 0 / 0.5)',
                    border: mode === 'light' ? '1px solid #E5E7EB' : 'none', // Defining border
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none', // Remove default material overlay
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: mode === 'light' ? '#F3F4F6' : '#333', // Distinct header background
                    color: mode === 'light' ? '#111827' : '#fff',
                    fontWeight: 700,
                },
                root: {
                    borderColor: mode === 'light' ? '#E5E7EB' : '#444',
                }
            }
        }
    },
});

export default getTheme;
