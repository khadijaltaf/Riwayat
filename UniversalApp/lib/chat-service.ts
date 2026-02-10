import { api, ChatMessage } from '@/lib/api-client';

export type { ChatMessage };

export const chatService = {
    /**
     * Fetch message history for a conversation
     */
    async getMessages(conversationId: string) {
        try {
            const { data, error } = await api.chat.getMessages(conversationId);

            if (error) throw error;
            return data as ChatMessage[];
        } catch (e) {
            console.warn('Failed to fetch messages from API, returning empty array:', e);
            // Return empty array so UI doesn't crash
            return [];
        }
    },

    /**
     * Send a new message
     */
    async sendMessage(msg: Partial<ChatMessage>) {
        try {
            const { data, error } = await api.chat.sendMessage(msg);

            if (error) throw error;

            // In our mock, data is an array
            return data[0] as ChatMessage;
        } catch (e) {
            console.warn('Message send failed, using local mock:', e);
            // Return a mock message object so the UI can update
            return {
                id: Math.random().toString(),
                conversation_id: msg.conversation_id!,
                sender_phone: msg.sender_phone!,
                content: msg.content,
                image_url: msg.image_url,
                audio_url: msg.audio_url,
                created_at: new Date().toISOString()
            } as ChatMessage;
        }
    },

    /**
     * Subscribe to new messages in real-time
     * (Mock implementation)
     */
    subscribeToMessages(conversationId: string, onNewMessage: (payload: any) => void) {
        console.log(`[Mock] Subscribed to chat:${conversationId}`);
        // Mock subscription object
        return {
            unsubscribe: () => {
                console.log(`[Mock] Unsubscribed from chat:${conversationId}`);
            }
        };
    },

    /**
     * Get all conversations for the current user
     */
    async getConversations(userPhone: string) {
        try {
            const { data, error } = await api.chat.getConversations(userPhone);

            if (error) throw error;
            return data;
        } catch (e) {
            console.warn('Failed to fetch conversations:', e);
            return [];
        }
    },

    /**
     * Find or create a conversation between two users
     */
    async getOrCreateConversation(p1: string, p2: string) {
        try {
            const { data, error } = await api.chat.getOrCreateConversation(p1, p2);

            if (error) throw error;
            return data.id;
        } catch (e) {
            console.warn('Failed to get/create conversation, using mock ID:', e);
            return `mock_${p1}_${p2}`;
        }
    }
};
