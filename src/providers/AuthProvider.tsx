'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getSession } from '@/lib/auth-actions';

interface User {
    userId: string;
    username: string;
    role: string;
    permissions: string[];
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    hasPermission: (permission: string) => boolean;
    hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    hasPermission: () => false,
    hasRole: () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const session = await getSession();
                setUser(session);
            } catch (error) {
                // Ignore error, just no user
            } finally {
                setLoading(false);
            }
        }
        loadUser();
    }, []);

    const hasPermission = (permission: string) => {
        if (!user) return false;
        if (user.role === 'SUPER_ADMIN') return true;
        return user.permissions.includes(permission);
    };

    const hasRole = (role: string) => {
        if (!user) return false;
        return user.role === role;
    };

    return (
        <AuthContext.Provider value={{ user, loading, hasPermission, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
