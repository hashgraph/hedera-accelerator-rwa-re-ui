export enum StorageKeys {
    Expenses = 'Expenses',
    Payments = 'Payments',
};

export const storageService = {
    storeItem: <T>(key: StorageKeys, item: T) => {
        localStorage.setItem(key, JSON.stringify(item));
    },
    restoreItem: async<T>(key: StorageKeys): Promise<T | null> => {
        const item = localStorage.getItem(key);

        if (item) {
            return JSON.parse(item);
        }

        return null;
    },
};
