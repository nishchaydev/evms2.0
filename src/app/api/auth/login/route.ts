import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, signJWT } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                role: {
                    include: {
                        permissions: true
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await comparePassword(password, user.password);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Single Session Enforcement: Increment session version
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { sessionVersion: { increment: 1 } }
        });

        // Flatten permissions
        const permissionNames = user.role.permissions.map(p => p.name);

        // Generate Token
        const token = await signJWT({
            userId: user.id,
            username: user.username,
            role: user.role.name,
            department: user.department,
            permissions: permissionNames,
            version: updatedUser.sessionVersion // Embed version in token
        });

        // Create Response with Cookie
        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                role: user.role.name,
                department: user.department,
                name: user.name,
                permissions: permissionNames
            },
            redirect: user.role.name === 'SUPER_ADMIN' ? '/super-admin' : user.role.name === 'ADMIN' ? '/admin' : '/officer',
        });

        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
