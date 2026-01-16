'use client';

import Link, { LinkProps } from 'next/link';
import { Button, ButtonProps, Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material';
import { forwardRef } from 'react';

// Wrapper for MUI Button using Next.js Link
export const LinkButton = forwardRef<HTMLButtonElement, ButtonProps & { href: string }>(
    function LinkButton({ href, ...props }, ref) {
        return <Button component={Link} href={href} {...props} ref={ref} />;
    }
);

// Wrapper for MUI Link using Next.js Link
// Note: We use the behavior of Next.js Link wrapping the MUI Link for styling if we want full MUI features,
// OR we pass Link as component. Passing Link as component is standard for MUI v5/v6 + Next.js App Router IF done in client component.
export const MuiNextLink = forwardRef<HTMLAnchorElement, MuiLinkProps & { href: string }>(
    function MuiNextLink({ href, ...props }, ref) {
        return <MuiLink component={Link} href={href} {...props} ref={ref} />;
    }
);

import { ListItemButton, ListItemButtonProps, IconButton, IconButtonProps } from '@mui/material';

// Safe Sidebar Link for Layouts
export const SidebarLink = forwardRef<HTMLDivElement, ListItemButtonProps & { href: string }>(
    function SidebarLink({ href, ...props }, ref) {
        return <ListItemButton component={Link} href={href} {...props} ref={ref} />;
    }
);

// Safe IconButton Link
export const LinkIconButton = forwardRef<HTMLButtonElement, IconButtonProps & { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>>(
    function LinkIconButton({ href, ...props }, ref) {
        return <IconButton component={Link} href={href} {...props} ref={ref} />;
    }
);
