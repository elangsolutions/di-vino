import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart/cartSlice';
import {loadState, saveState} from "./utils.ts";


const preloadedState = loadState();

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        devTools: process.env.NODE_ENV !== 'production', // optional
    },
    preloadedState,
});

store.subscribe(() => {
    saveState({
        cart: store.getState().cart, // Persist only the cart slice
    });
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
