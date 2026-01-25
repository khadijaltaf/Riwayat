
import { supabase } from '@/lib/supabase';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

export const storageService = {
    async uploadFile(uri: string, bucket: string = 'kitchen-media', contentType: string = 'image/jpeg') {
        try {
            const ext = uri.split('.').pop() || 'jpg';
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
            const filePath = `${fileName}`;

            // 1. Read file as base64
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: 'base64',
            });

            if (!base64) throw new Error('Could not read file data');

            // 2. Convert base64 to ArrayBuffer
            const arrayBuffer = decode(base64);

            // 3. Upload to Supabase
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(filePath, arrayBuffer, {
                    contentType: contentType,
                });

            if (error) throw error;

            // 4. Get public URL
            const result = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            const publicUrl = result.data?.publicUrl;

            return { publicUrl, filePath, error: null };
        } catch (error: any) {
            console.error('Storage upload error:', error);
            return { publicUrl: null, filePath: null, error: error.message };
        }
    },

    async deleteImage(path: string, bucket: string = 'kitchen-media') {
        const { error } = await supabase.storage.from(bucket).remove([path]);
        return { error };
    }
};
