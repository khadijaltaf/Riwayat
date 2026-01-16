
import { supabase } from '@/lib/supabase';
import { readAsStringAsync } from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

export const storageService = {
    async uploadImage(uri: string, bucket: string = 'kitchen-media') {
        try {
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
            const filePath = `${fileName}`;

            // 1. Read file as base64
            const base64 = await readAsStringAsync(uri, {
                encoding: 'base64',
            });

            // 2. Convert base64 to ArrayBuffer
            const arrayBuffer = decode(base64);

            // 3. Upload to Supabase
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(filePath, arrayBuffer, {
                    contentType: 'image/jpeg',
                });

            if (error) throw error;

            // 4. Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            return { publicUrl, error: null };
        } catch (error: any) {
            console.error('Storage upload error:', error);
            return { publicUrl: null, error: error.message };
        }
    },

    async deleteImage(path: string, bucket: string = 'kitchen-media') {
        const { error } = await supabase.storage.from(bucket).remove([path]);
        return { error };
    }
};
