
import React, { createContext, useContext, useState } from 'react';

type OnboardingData = {
    kitchenName: string;
    description: string;
    address: string;
    city: string;
    categories: string[];
    cnic: string;
};

type OnboardingContextType = {
    data: OnboardingData;
    updateData: (updates: Partial<OnboardingData>) => void;
    resetData: () => void;
};

const initialData: OnboardingData = {
    kitchenName: '',
    description: '',
    address: '',
    city: '',
    categories: [],
    cnic: '',
};

const OnboardingContext = createContext<OnboardingContextType>({
    data: initialData,
    updateData: () => { },
    resetData: () => { },
});

export const useOnboarding = () => useContext(OnboardingContext);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<OnboardingData>(initialData);

    const updateData = (updates: Partial<OnboardingData>) => {
        setData((prev) => ({ ...prev, ...updates }));
    };

    const resetData = () => {
        setData(initialData);
    };

    return (
        <OnboardingContext.Provider value={{ data, updateData, resetData }}>
            {children}
        </OnboardingContext.Provider>
    );
}
