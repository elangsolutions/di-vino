

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('app_state');
        if (serializedState === null) return undefined; // Let reducers use initialState
        return JSON.parse(serializedState);
    } catch (err) {
        console.warn('Failed to load state from localStorage', err);
        return undefined;
    }
};

export const saveState = (state: any) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('app_state', serializedState);
    } catch (err) {
        console.warn('Failed to save state to localStorage', err);
    }
};
