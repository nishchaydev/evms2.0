'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';

interface ColorModeContextType {
    mode: 'light' | 'dark';
    toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextType>({
    mode: 'light',
    toggleColorMode: () => { },
});

export const useColorMode = () => useContext(ColorModeContext);

export const ColorModeProvider = ({ children }: { children: React.ReactNode }) => {
    // Initialize from local storage or default to light
    const [mode, setMode] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('themeMode');
            if (savedMode === 'light' || savedMode === 'dark') {
                return savedMode;
            }
        }
        return 'light';
    });

    const colorMode = useMemo(
        () => ({
            mode,
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = prevMode === 'light' ? 'dark' : 'light';
                    localStorage.setItem('themeMode', newMode);
                    return newMode;
                });
            },
        }),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            {children}
        </ColorModeContext.Provider>
    );
};
