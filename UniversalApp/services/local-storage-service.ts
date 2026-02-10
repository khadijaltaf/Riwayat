import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    THEME: 'app_theme',
    ONBOARDING_PROGRESS: 'onboarding_progress',
    SEARCH_HISTORY: 'search_history',
    SESSION: 'auth_session',
    REMEMBERED_PHONE: 'remembered_phone'
};

export const localStorageService = {
    // Theme Management
    async getTheme() {
        return await AsyncStorage.getItem(KEYS.THEME) || 'system';
    },
    async setTheme(theme: 'light' | 'dark' | 'system') {
        await AsyncStorage.setItem(KEYS.THEME, theme);
    },

    // Onboarding Progress Persistence
    async saveOnboardingProgress(data: any) {
        const existing = await this.getOnboardingProgress();
        const updated = { ...existing, ...data };
        await AsyncStorage.setItem(KEYS.ONBOARDING_PROGRESS, JSON.stringify(updated));
    },
    async getOnboardingProgress() {
        const data = await AsyncStorage.getItem(KEYS.ONBOARDING_PROGRESS);
        return data ? JSON.parse(data) : {};
    },
    async clearOnboardingProgress() {
        await AsyncStorage.removeItem(KEYS.ONBOARDING_PROGRESS);
    },

    // Search History
    async getSearchHistory(): Promise<string[]> {
        const data = await AsyncStorage.getItem(KEYS.SEARCH_HISTORY);
        return data ? JSON.parse(data) : [];
    },
    async addToSearchHistory(query: string) {
        let history = await this.getSearchHistory();
        history = [query, ...history.filter(q => q !== query)].slice(0, 5);
        await AsyncStorage.setItem(KEYS.SEARCH_HISTORY, JSON.stringify(history));
    },
    async clearSearchHistory() {
        await AsyncStorage.removeItem(KEYS.SEARCH_HISTORY);
    },

    // Remember Me
    async getRememberedPhone() {
        return await AsyncStorage.getItem(KEYS.REMEMBERED_PHONE);
    },
    async saveRememberedPhone(phone: string) {
        await AsyncStorage.setItem(KEYS.REMEMBERED_PHONE, phone);
    },
    async clearRememberedPhone() {
        await AsyncStorage.removeItem(KEYS.REMEMBERED_PHONE);
    }
};
