'use server';

import { prisma } from './prisma';
import { hashPassword } from './auth';

export async function createPasswordRequest(username: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return { success: false, message: 'User not found.' };
        }

        // Check if there is already a pending request
        const existing = await prisma.passwordRequest.findFirst({
            where: {
                userId: user.id,
                status: 'PENDING'
            }
        });

        if (existing) {
            return { success: true, message: 'Request already pending.' };
        }

        await prisma.passwordRequest.create({
            data: {
                userId: user.id,
                status: 'PENDING'
            }
        });

        return { success: true, message: 'Request submitted successfully.' };

    } catch (error) {
        console.error('Create Request Error:', error);
        return { success: false, message: 'Failed to submit request.' };
    }
}

export async function getPendingRequests() {
    try {
        return await prisma.passwordRequest.findMany({
            where: { status: 'PENDING' },
            include: {
                user: {
                    select: {
                        name: true,
                        username: true,
                        role: { select: { name: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error('Get Requests Error:', error);
        return [];
    }
}

export async function resolvePasswordRequest(requestId: string, newPassword: string, action: 'APPROVE' | 'REJECT') {
    try {
        if (action === 'REJECT') {
            await prisma.passwordRequest.update({
                where: { id: requestId },
                data: { status: 'REJECTED' }
            });
            return { success: true, message: 'Request rejected.' };
        }

        // Approve case
        const request = await prisma.passwordRequest.findUnique({
            where: { id: requestId },
            include: { user: true }
        });

        if (!request) return { success: false, message: 'Request not found.' };

        const hashedPassword = await hashPassword(newPassword);

        // Update User Password
        await prisma.user.update({
            where: { id: request.userId },
            data: { password: hashedPassword }
        });

        // Update Request Status
        await prisma.passwordRequest.update({
            where: { id: requestId },
            data: { status: 'RESOLVED' }
        });

        return { success: true, message: 'Password updated successfully.' };

    } catch (error) {
        console.error('Resolve Request Error:', error);
        return { success: false, message: 'Failed to process request.' };
    }
}
