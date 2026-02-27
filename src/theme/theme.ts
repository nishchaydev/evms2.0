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
        h1: { fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.02em' },
        h2: { fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.01em' },
        h3: { fontSize: '2rem', fontWeight: 800 },
        h6: { fontWeight: 700 },
        button: { fontWeight: 700, letterSpacing: '0.05em' },
        overline: { fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' },
    },
    shape: {
        borderRadius: 0, // SHARP EDGES GLOBALLY
    },
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                primary: {
                    main: '#064E3B', // Emerald Dark
                    light: '#059669',
                    dark: '#022C22',
                    contrastText: '#ffffff',
                },
                secondary: {
                    main: '#F59E0B', // Amber/Saffron
                    light: '#FBBF24',
                    dark: '#B45309',
                    contrastText: '#ffffff',
                },
                background: {
                    default: '#F3F4F6',
                    paper: '#ffffff',
                },
                text: {
                    primary: '#111827',
                    secondary: '#4B5563',
                },
                success: { main: '#10B981' },
                warning: { main: '#F59E0B' },
                error: { main: '#EF4444' },
                info: { main: '#3B82F6' }
            }
            : {
                primary: {
                    main: '#34D399', // Emerald Light
                    light: '#6EE7B7',
                    dark: '#059669',
                    contrastText: '#000000',
                },
                secondary: {
                    main: '#FBBF24',
                    light: '#FDE68A',
                    dark: '#D97706',
                    contrastText: '#000000',
                },
                background: {
                    default: '#111827',
                    paper: '#1F2937',
                },
                text: {
                    primary: '#F9FAFB',
                    secondary: '#9CA3AF',
                },
            }),
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: mode === 'light' ? '#064E3B' : '#111827',
                    boxShadow: 'none',
                    borderBottom: `2px solid ${mode === 'light' ? '#059669' : '#374151'}`,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'uppercase',
                    borderRadius: 0,
                    fontWeight: 700,
                    padding: '10px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                containedPrimary: {
                    backgroundColor: mode === 'light' ? '#064E3B' : '#34D399',
                    '&:hover': {
                        backgroundColor: mode === 'light' ? '#022C22' : '#10B981',
                    },
                },
                outlinedPrimary: {
                    borderWidth: '2px',
                    borderColor: mode === 'light' ? '#064E3B' : '#34D399',
                    '&:hover': {
                        borderWidth: '2px',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    boxShadow: 'none',
                    border: `2px solid ${mode === 'light' ? '#E5E7EB' : '#374151'}`,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderRadius: 0,
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: mode === 'light' ? '#E5E7EB' : '#374151',
                    boxShadow: mode === 'light' ? '8px 8px 0px 0px #064E3B' : '8px 8px 0px 0px rgba(52, 211, 153, 0.3)',
                }
            }
        },
        MuiTextField: {
            defaultProps: {
                InputProps: {
                    sx: { borderRadius: 0 }
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: '2px',
                    },
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: mode === 'light' ? '#F3F4F6' : '#111827',
                    color: mode === 'light' ? '#111827' : '#F9FAFB',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                },
                root: {
                    borderColor: mode === 'light' ? '#E5E7EB' : '#374151',
                }
            }
        }
    },
});

export default getTheme;
