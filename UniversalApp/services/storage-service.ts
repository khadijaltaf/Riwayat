
export const storageService = {
    async uploadFile(uri: string, bucket: string = 'kitchen-media', contentType: string = 'image/jpeg') {
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const ext = uri.split('.').pop() || 'jpg';
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
            const filePath = `${fileName}`;

            console.log(`[MockStorage] Uploaded ${uri} to ${bucket}/${filePath}`);

            return {
                publicUrl: 'https://via.placeholder.com/600x400', // Return a valid dummy image URL
                filePath: filePath,
                error: null
            };
        } catch (error: any) {
            console.error('Storage upload error:', error);
            return { publicUrl: null, filePath: null, error: error.message };
        }
    },

    async deleteImage(path: string, bucket: string = 'kitchen-media') {
        console.log(`[MockStorage] Deleted ${path} from ${bucket}`);
        return { error: null };
    }
};
