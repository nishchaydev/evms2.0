import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

// Define protected routes and allowed roles
const rolePermissions = {
    '/admin': ['ADMIN', 'SUPER_ADMIN'],
    '/super-admin': ['SUPER_ADMIN'],
    '/officer': ['OFFICER', 'ADMIN', 'SUPER_ADMIN'],
};

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Security Headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(self), microphone=(self), geolocation=(self)');

    const { pathname } = request.nextUrl;

    // 1. Check if the path requires protection
    // Basic check: if it starts with /admin, /super-admin, /officer
    // We can refine this logic

    let requiredRoles: string[] = [];

    if (pathname.startsWith('/super-admin')) {
        requiredRoles = rolePermissions['/super-admin'];
    } else if (pathname.startsWith('/admin')) {
        requiredRoles = rolePermissions['/admin'];
    } else if (pathname.startsWith('/officer')) {
        requiredRoles = rolePermissions['/officer'];
    }

    // If no roles required (public route like /login, /verify, /api/seed), allow
    if (requiredRoles.length === 0) {
        return NextResponse.next();
    }

    // 2. Verify Token
    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await verifyJWT(token);

    if (!payload || !payload.role) {
        // Invalid token
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
    }

    const userRole = payload.role as string;

    // 3. Check Role
    if (!requiredRoles.includes(userRole)) {
        // Initialize unauthorized page or redirect to their dashboard
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // 4. Proceed
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/super-admin/:path*',
        '/officer/:path*',
        // Match other protected routes if needed
    ],
};
