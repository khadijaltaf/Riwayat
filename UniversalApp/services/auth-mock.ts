
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Mock Authentication Service
 * This will be replaced by real Supabase/API calls in the future.
 */

export type UserProfile = {
    id: string;
    phone: string;
    fullName?: string;
    kitchenName?: string;
    pin?: string;
    ownerName?: string;
};

const SESSION_KEY = 'riwayat_user_session';
const USERS_STORAGE_KEY = 'riwayat_registered_users';

const MOCK_USERS: UserProfile[] = [
    {
        id: '1',
        phone: '03001122334',
        pin: '1234',
        fullName: 'Test Chef',
        kitchenName: "Ananya's Kitchen",
        ownerName: 'Test Chef'
    },
    {
        id: '2',
        phone: '03330000000',
        pin: '1234',
        fullName: 'Chef Ahmad',
        kitchenName: 'Mama Kitchen',
        ownerName: 'Chef Ahmad'
    },
];

export const authMock = {
    getUsers: async (): Promise<UserProfile[]> => {
        const stored = await AsyncStorage.getItem(USERS_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return MOCK_USERS;
    },

    saveUsers: async (users: UserProfile[]) => {
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    },

    login: async (phone: string, pin: string) => {
        const users = await authMock.getUsers();
        const cleanPhone = phone.replace(/^0/, '');
        const user = users.find(u => {
            const uPhone = u.phone.replace(/^0/, '').replace(/^\+92/, '');
            return uPhone === cleanPhone && u.pin === pin;
        });

        if (user) {
            await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
            return { user };
        } else {
            return { error: 'Invalid phone number or PIN' };
        }
    },

    register: async (details: Partial<UserProfile>) => {
        const users = await authMock.getUsers();
        const newUser: UserProfile = {
            id: Math.random().toString(36).substr(2, 9),
            phone: details.phone || '',
            ...details,
        };
        users.push(newUser);
        await authMock.saveUsers(users);
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
        return { user: newUser };
    },

    getCurrentUser: async (): Promise<UserProfile | null> => {
        const session = await AsyncStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    },

    setCurrentUser: async (user: UserProfile) => {
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
    },

    logout: async () => {
        await AsyncStorage.removeItem(SESSION_KEY);
    }
};
