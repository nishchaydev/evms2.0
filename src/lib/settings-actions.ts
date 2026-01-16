'use server';

import { prisma } from './prisma';
import { getSession } from './auth-actions';
import { revalidatePath } from 'next/cache';

export async function getUserSettings() {
    try {
        const session = await getSession();
        if (!session?.userId) return null;

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { preferences: true }
        });

        // Default settings
        const defaultSettings = {
            emailNotifs: true,
            smsAlerts: false
        };

        if (user?.preferences) {
            return { ...defaultSettings, ...(user.preferences as any) };
        }

        return defaultSettings;
    } catch (error) {
        console.error('Error fetching user settings:', error);
        return {
            emailNotifs: true,
            smsAlerts: false
        };
    }
}

export async function updateUserSettings(settings: { emailNotifs: boolean; smsAlerts: boolean }) {
    try {
        const session = await getSession();
        if (!session?.userId) return { success: false, message: 'Unauthorized' };

        await prisma.user.update({
            where: { id: session.userId },
            data: {
                preferences: settings
            }
        });

        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error) {
        console.error('Error updating user settings:', error);
        return { success: false, message: 'Failed to update settings' };
    }
}
