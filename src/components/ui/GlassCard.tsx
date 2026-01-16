'use client';

import { Paper, PaperProps, styled } from '@mui/material';
import { motion } from 'framer-motion';

// Styled Paper for Glass Effect
const GlassPaper = styled(Paper)(({ theme }) => ({
    background: theme.palette.mode === 'dark'
        ? 'rgba(30, 41, 59, 0.7)'
        : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    borderRadius: 16, // theme.shape.borderRadius * 2 generally
    border: '1px solid',
    borderColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(255, 255, 255, 0.4)',
    boxShadow: theme.shadows[1],
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
        borderColor: theme.palette.primary.main, // Subtle highlight on hover
    }
}));

// Motion wrapper to allow animation props if needed
const MotionGlassPaper = motion(GlassPaper) as any;

interface GlassCardProps extends PaperProps {
    delay?: number;
    hoverEffect?: boolean;
    component?: any; // To support Link usage
    href?: string;
}

export default function GlassCard({ children, delay = 0, hoverEffect = true, sx, ...props }: GlassCardProps) {
    return (
        <MotionGlassPaper
            elevation={0}
            // @ts-ignore - framer motion props
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            sx={{
                ...sx,
                // Disable hover transform if hoverEffect is false
                ...(!hoverEffect && {
                    '&:hover': {
                        transform: 'none',
                        boxShadow: (theme: any) => theme.shadows[1],
                        borderColor: (theme: any) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.4)',
                    }
                })
            }}
            {...props}
        >
            {children}
        </MotionGlassPaper>
    );
}
