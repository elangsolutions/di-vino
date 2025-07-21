import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart/slice.ts';
import productsReducer from './product/slice.ts';
import {loadState, saveState} from "./utils.ts";


const preloadedState = loadState();

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        productList:productsReducer,
        devTools: process.env.NODE_ENV !== 'production', // optional
    },
    preloadedState,
});

store.subscribe(() => {
    saveState({
        cart: store.getState().cart,
        products:store.getState(),
    });
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
