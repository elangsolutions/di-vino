import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart/slice.ts';
import productsReducer from './product/slice.ts';
import {loadState, saveState} from "./utils.ts";


const preloadedState = loadState();

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        productList: productsReducer,
    } as any,
    preloadedState: preloadedState as any,
    devTools: process.env.NODE_ENV !== 'production',
});

store.subscribe(() => {
    saveState({
        cart: store.getState().cart,
        productList: store.getState().productList,
    });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
