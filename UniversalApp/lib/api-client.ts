import AsyncStorage from '@react-native-async-storage/async-storage';

// Types mimicking the database schema
export interface User {
    id: string;
    phone: string;
}

export interface Session {
    access_token: string;
    refresh_token: string;
    user: User;
}

export interface Profile {
    id: string;
    owner_name: string;
    phone: string;
    email?: string;
    pin_hash?: string;
    role?: string;
    avatar_url: string | null;
    updated_at?: string;
}

export interface Kitchen {
    id: string;
    owner_id: string;
    name: string;
    description: string;
    banner_image_url: string | null;
    status: 'ACTIVE' | 'DRAFT' | 'PENDING';
    chef_bio?: string;
    chef_journey?: string;
    address?: string;
    city?: string;
    area?: string;
    schedule?: any;
    total_sales?: number;
    total_orders?: number;
    [key: string]: any;
}

export interface Feedback {
    id: string;
    status: string;
    created_at: string;
    [key: string]: any;
}

export interface ChatMessage {
    id: string;
    conversation_id: string;
    sender_phone: string;
    content?: string;
    image_url?: string;
    audio_url?: string;
    location_data?: {
        latitude: number;
        longitude: number;
        address: string;
    };
    metadata?: any;
    created_at: string;
}

export interface Conversation {
    id: string;
    participant_1: string;
    participant_2: string;
    last_message: string;
    updated_at: string;
}

export interface Dish {
    id: string;
    kitchen_id: string;
    name: string;
    description: string;
    price: number;
    image_url: string | null;
    is_available: boolean;
    category?: string;
}

export interface Order {
    id: string;
    kitchen_id: string;
    customer_name: string;
    total: number;
    status: 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
    items: any[];
    created_at: string;
}

// Mock Data Store
const MOCK_USER: User = { id: 'user_123', phone: '+1234567890' };
const MOCK_SESSION: Session = {
    access_token: 'mock_access_token',
    refresh_token: 'mock_refresh_token',
    user: MOCK_USER,
};

// Helper for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    auth: {
        signInWithOtp: async ({ phone }: { phone: string }) => {
            await delay(500);
            console.log(`[MockAPI] OTP sent to ${phone}`);
            return { error: null };
        },

        verifyOtp: async ({ phone, token }: { phone: string, token: string }) => {
            await delay(1000);
            // Since client simulates OTP generation, we accept any token here
            // In a real app, this would verify against the Redis/DB stored OTP
            if (token) {
                // Store session
                await AsyncStorage.setItem('auth_session', JSON.stringify(MOCK_SESSION));
                return { data: { session: MOCK_SESSION, user: MOCK_USER }, error: null };
            }
            return { data: { session: null }, error: new Error('Invalid Token') };
        },

        signOut: async () => {
            await delay(200);
            await AsyncStorage.removeItem('auth_session');
            return { error: null };
        },

        getSession: async () => {
            await delay(100);
            const sessionStr = await AsyncStorage.getItem('auth_session');
            if (sessionStr) {
                const session = JSON.parse(sessionStr);
                return { data: { session }, error: null };
            }
            return { data: { session: null }, error: null };
        },

        getUser: async () => {
            await delay(100);
            const sessionStr = await AsyncStorage.getItem('auth_session');
            if (sessionStr) {
                const session = JSON.parse(sessionStr);
                return { data: { user: session.user }, error: null };
            }
            return { data: { user: null }, error: null };
        },
        loginWithPin: async ({ phone, pin }: { phone: string; pin: string }) => {
            await delay(800);
            if (pin === '1234' || pin === '0000') {
                await AsyncStorage.setItem('auth_session', JSON.stringify(MOCK_SESSION));
                return { data: { session: MOCK_SESSION, user: MOCK_USER }, error: null };
            }
            return { data: null, error: { message: 'Invalid PIN' } };
        },
    },

    kitchen: {
        get: async (userId: string) => {
            await delay(500);
            // Return mock kitchen
            return {
                data: {
                    id: 'kitchen_999',
                    owner_id: userId,
                    name: "Mom's Kitchen",
                    description: "Best home cooked meals",
                    banner_image_url: null,
                    status: 'ACTIVE'
                } as Kitchen,
                error: null
            };
        },
        update: async (userId: string, updates: Partial<Kitchen>) => {
            await delay(800);
            console.log(`[MockAPI] Updated kitchen for ${userId}:`, updates);
            return { error: null };
        }
    },

    profile: {
        getByPhone: async (phone: string) => {
            await delay(400);
            // Only simulate existing user for specific test numbers
            if (phone.endsWith('0000')) {
                return {
                    data: {
                        id: 'user_123',
                        owner_name: "Jane Doe",
                        phone: phone,
                        avatar_url: null
                    } as Profile,
                    error: null
                };
            }
            return { data: null, error: null };
        },
        resetPin: async (phone: string, pinHash: string) => {
            await delay(600);
            console.log(`[MockAPI] Reset PIN for ${phone}`);
            return { error: null };
        },
        get: async (userId: string) => {
            await delay(400);
            return {
                data: {
                    id: userId,
                    owner_name: "Jane Doe",
                    phone: "+1234567890",
                    avatar_url: null
                } as Profile,
                error: null
            };
        },
        update: async (userId: string, updates: Partial<Profile>) => {
            await delay(600);
            console.log(`[MockAPI] Updated profile for ${userId}:`, updates);
            return { error: null };
        }
    },

    feedback: {
        list: async () => {
            await delay(600);
            return {
                data: [
                    { id: 'fb_1', status: 'PENDING', created_at: new Date().toISOString(), title: 'Late Delivery' },
                    { id: 'fb_2', status: 'RESOLVED', created_at: new Date().toISOString(), title: 'Cold Food' }
                ] as Feedback[],
                error: null
            };
        },
        get: async (id: string) => {
            await delay(300);
            return {
                data: { id, status: 'PENDING', created_at: new Date().toISOString(), title: 'Issue Detail' } as Feedback,
                error: null
            };
        },
        updateStatus: async (id: string, status: string) => {
            await delay(400);
            console.log(`[MockAPI] Feedback ${id} status updated to ${status}`);
            return { error: null };
        },
        createCompensation: async (data: any) => {
            await delay(700);
            console.log('[MockAPI] Compensation Created:', data);
            return { error: null };
        },
        createDispute: async (data: any) => {
            await delay(700);
            console.log('[MockAPI] Dispute Created:', data);
            return { error: null };
        },
        createExtension: async (data: any) => {
            await delay(700);
            console.log('[MockAPI] Extension Request Created:', data);
            return { error: null };
        }
    },

    chat: {
        getConversations: async (phone: string) => {
            await delay(500);
            return {
                data: [
                    {
                        id: 'conv_1',
                        participant_1: phone,
                        participant_2: '+9876543210',
                        last_message: 'Is the order ready?',
                        updated_at: new Date().toISOString(),
                    },
                    {
                        id: 'conv_2',
                        participant_1: phone,
                        participant_2: '+1234567890',
                        last_message: 'Thank you for the meal!',
                        updated_at: new Date(Date.now() - 86400000).toISOString(),
                    }
                ] as Conversation[],
                error: null
            };
        },
        getMessages: async (conversationId: string) => {
            await delay(400);
            return {
                data: [
                    {
                        id: 'msg_1',
                        conversation_id: conversationId,
                        sender_phone: '+9876543210',
                        content: 'Hello there!',
                        created_at: new Date(Date.now() - 10000).toISOString()
                    },
                    {
                        id: 'msg_2',
                        conversation_id: conversationId,
                        sender_phone: '+1234567890',
                        content: 'Hi! How can I help?',
                        created_at: new Date().toISOString()
                    }
                ] as ChatMessage[],
                error: null
            };
        },
        sendMessage: async (msg: Partial<ChatMessage>) => {
            await delay(300);
            return {
                data: [
                    {
                        ...msg,
                        id: `msg_${Date.now()}`,
                        created_at: new Date().toISOString()
                    }
                ] as ChatMessage[],
                error: null
            };
        },
        getOrCreateConversation: async (p1: string, p2: string) => {
            await delay(400);
            return {
                data: { id: `conv_${p1}_${p2}` },
                error: null
            };
        },
    },

    onboarding: {
        getSession: async (phone: string) => {
            await delay(500);
            return {
                data: {
                    phone,
                    address: '',
                    city: '',
                    area: '',
                    map_link: '',
                    last_otp: '1234',
                    step: 'verify'
                } as any,
                error: null
            };
        },
        updateSession: async (data: any) => {
            await delay(400);
            console.log('[MockAPI] Onboarding Session Updated:', data);
            return { error: null };
        },
        upsertSession: async (data: any) => {
            await delay(400);
            console.log('[MockAPI] Onboarding Session Created/Upserted:', data);
            return { error: null };
        }
    },

    orders: {
        list: async () => {
            await delay(600);
            return {
                data: [
                    { id: 'ORD-515221', customer_name: 'Salman', total: 2500, status: 'PENDING', created_at: new Date().toISOString() },
                    { id: 'ORD-515222', customer_name: 'Ahmad', total: 1800, status: 'ACCEPTED', created_at: new Date().toISOString() },
                ] as Order[],
                error: null
            };
        },
        updateStatus: async (orderId: string, status: Order['status']) => {
            await delay(400);
            console.log(`[MockAPI] Order ${orderId} status updated to ${status}`);
            return { error: null };
        }
    },

    dishes: {
        list: async () => {
            await delay(500);
            return {
                data: [
                    { id: 'd_1', name: 'Butter Chicken', description: 'Rich and creamy chicken curry', price: 1200, is_available: true, image_url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200' },
                    { id: 'd_2', name: 'Garlic Naan', description: 'Freshly baked tandoori naan', price: 150, is_available: true, image_url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200' },
                ] as Dish[],
                error: null
            };
        },
        create: async (dish: Partial<Dish>) => {
            await delay(700);
            console.log('[MockAPI] Dish created:', dish);
            return { data: { ...dish, id: `d_${Date.now()}` } as Dish, error: null };
        },
        update: async (id: string, updates: Partial<Dish>) => {
            await delay(500);
            console.log(`[MockAPI] Dish ${id} updated:`, updates);
            return { error: null };
        }
    }
};
