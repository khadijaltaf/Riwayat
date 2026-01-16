
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
};

const MOCK_USERS: UserProfile[] = [
    {
        id: '1',
        phone: '03001122334',
        pin: '1234',
        fullName: 'Test Chef',
        kitchenName: "Ananya's Kitchen",
    },
    {
        id: '2',
        phone: '03330000000',
        pin: '1234',
        fullName: 'Chef Ahmad',
        kitchenName: 'Mama Kitchen',
    },
];

export const authMock = {
    login: async (phone: string, pin: string) => {
        return new Promise<{ user?: UserProfile; error?: string }>((resolve) => {
            setTimeout(() => {
                const user = MOCK_USERS.find(u => (u.phone === phone || u.phone === `+92${phone.replace(/^0/, '')}`) && u.pin === pin);
                if (user) {
                    resolve({ user });
                } else {
                    resolve({ error: 'Invalid phone number or PIN' });
                }
            }, 1000);
        });
    },

    register: async (details: Partial<UserProfile>) => {
        return new Promise<{ user?: UserProfile; error?: string }>((resolve) => {
            setTimeout(() => {
                const newUser: UserProfile = {
                    id: Math.random().toString(36).substr(2, 9),
                    phone: details.phone || '',
                    ...details,
                };
                MOCK_USERS.push(newUser);
                resolve({ user: newUser });
            }, 1500);
        });
    }
};
