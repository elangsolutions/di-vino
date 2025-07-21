import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
    quantities: Record<string, number>; // key = product.id
}

const initialState: CartState = {
    quantities: {},
};

const slice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        increment: (state, action: PayloadAction<{ productId: string }>) => {
            debugger
            const id = action.payload.productId;
            state.quantities[id] = (state.quantities[id] || 0) + 1;
        },
        decrement: (state, action: PayloadAction<{ productId: string }>) => {
            const id = action.payload.productId;
            const current = state.quantities[id] || 0;
            state.quantities[id] = current > 0 ? current - 1 : 0;
        },
        remove: (state, action: PayloadAction<{ productId: string }>) => {
            const id = action.payload.productId;
            delete state.quantities[id]
        },
    },
});

export const { increment, decrement, remove } = slice.actions;
export default slice.reducer;
