'use server';

import { prisma } from './prisma';
import { cookies } from 'next/headers';
import { verifyJWT } from './auth';

export async function logAudit(
    action: string,
    details: string,
    ipAddress: string = '127.0.0.1' // In real app, we'd parse headers()
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        let userId: string | null = null;
        let name: string = 'System';

        if (token) {
            const payload = await verifyJWT(token);
            if (payload) {
                userId = payload.id as string;
                name = payload.name as string;
            }
        }

        await prisma.auditLog.create({
            data: {
                action,
                details: `${name} (${userId || 'Guest'}): ${details}`, // Combining for clearer reading in raw variable
                userId: userId, // Link to User model if exists
                ipAddress: ipAddress
            }
        });

    } catch (error) {
        console.error('Audit Log Failed:', error);
        // We do not throw error here to avoid blocking the main action
    }
}
