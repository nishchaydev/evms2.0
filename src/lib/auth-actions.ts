'use server';

import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma'; // Add prisma import

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    try {
        const payload = await verifyJWT(token);
        if (!payload) return null;

        // Strict Session Check: Verify against DB
        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { sessionVersion: true }
        });

        if (!user || user.sessionVersion !== (payload.version as number)) {
            return null; // Invalid session (likely logged in elsewhere)
        }

        return {
            userId: payload.userId as string,
            username: payload.username as string,
            role: payload.role as string,
            permissions: (payload.permissions as string[]) || []
        };
    } catch (error) {
        return null;
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    redirect('/login');
}
