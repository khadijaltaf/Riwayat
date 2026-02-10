
import { api, Session, User } from '@/lib/api-client';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
    session: Session | null;
    user: User | null;
    isLoading: boolean;
    signInWithOTP: (phone: string) => Promise<{ error: any }>;
    verifyOTP: (phone: string, token: string) => Promise<{ session: Session | null; error: any }>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    isLoading: true,
    signInWithOTP: async () => ({ error: null }),
    verifyOTP: async () => ({ session: null, error: null }),
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const { data } = await api.auth.getSession();
            if (data.session) {
                setSession(data.session);
                setUser(data.session.user);
            }
        } catch (error) {
            console.error('Session check failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithOTP = async (phone: string) => {
        const { error } = await api.auth.signInWithOtp({ phone });
        return { error };
    };

    const verifyOTP = async (phone: string, token: string) => {
        const { data, error } = await api.auth.verifyOtp({ phone, token });
        if (data?.session) {
            setSession(data.session);
            setUser(data.session.user);
        }
        return { session: data?.session, error };
    };

    const signOut = async () => {
        await api.auth.signOut();
        setSession(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ session, user, isLoading, signInWithOTP, verifyOTP, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
