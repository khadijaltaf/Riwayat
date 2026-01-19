import { supabase } from './supabase';

export interface ChatMessage {
    id: string;
    conversation_id: string;
    sender_phone: string;
    content?: string;
    image_url?: string;
    audio_url?: string;
    location_data?: any;
    metadata?: any;
    created_at: string;
}

export const chatService = {
    /**
     * Fetch message history for a conversation
     */
    async getMessages(conversationId: string) {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data as ChatMessage[];
    },

    /**
     * Send a new message
     */
    async sendMessage(msg: Partial<ChatMessage>) {
        const { data, error } = await supabase
            .from('messages')
            .insert([msg])
            .select();

        if (error) throw error;

        // Also update the conversation's last message and timestamp
        await supabase
            .from('conversations')
            .update({
                last_message: msg.content || 'Media attachment',
                updated_at: new Date()
            })
            .eq('id', msg.conversation_id);

        return data[0] as ChatMessage;
    },

    /**
     * Subscribe to new messages in real-time
     */
    subscribeToMessages(conversationId: string, onNewMessage: (payload: any) => void) {
        return supabase
            .channel(`chat:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`
                },
                (payload) => onNewMessage(payload.new)
            )
            .subscribe();
    },

    /**
     * Find or create a conversation between two users
     */
    async getOrCreateConversation(p1: string, p2: string) {
        // Try to find existing
        const { data: existing, error: findError } = await supabase
            .from('conversations')
            .select('*')
            .or(`and(participant_1.eq.${p1},participant_2.eq.${p2}),and(participant_1.eq.${p2},participant_2.eq.${p1})`)
            .maybeSingle();

        if (existing) return existing.id;

        // Create new if not found
        const { data: created, error: createError } = await supabase
            .from('conversations')
            .insert([{ participant_1: p1, participant_2: p2 }])
            .select()
            .single();

        if (createError) throw createError;
        return created.id;
    }
};
