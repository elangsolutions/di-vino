import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Product = {
    _id: string;
    name: string;
    price: number;
    details?: string;
    image?: string;
};


const initialState:Product[] = [];


export const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        cacheProducts: (state, action: PayloadAction<Product[]>) => {
            for (const product of action.payload) {
                const productInCacheIndex = state.findIndex(prd=> prd._id === product._id );

                if (productInCacheIndex === -1) {
                    state.push(product);
                }
                else  {
                    state[productInCacheIndex] = product;
                }
            }
        },
    },
});

export const { cacheProducts } = productsSlice.actions;

export default productsSlice.reducer;
