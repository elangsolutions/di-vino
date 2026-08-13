import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
    quantities: Record<string, number>;
}

const initialState: CartState = {
    quantities: {},
};

const slice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        increment: (state, action: PayloadAction<{ productId: string; amount?: number }>) => {
            const id = action.payload.productId;
            const amount = action.payload.amount && action.payload.amount > 0
                ? Math.floor(action.payload.amount)
                : 1;
            state.quantities[id] = (state.quantities[id] || 0) + amount;
        },
        decrement: (state, action: PayloadAction<{ productId: string }>) => {
            const id = action.payload.productId;
            const current = state.quantities[id] || 0;
            if (current <= 1) {
                delete state.quantities[id];
            } else {
                state.quantities[id] = current - 1;
            }
        },
        remove: (state, action: PayloadAction<{ productId: string }>) => {
            const id = action.payload.productId;
            delete state.quantities[id]
        },
        clearCart: (state) => {
            state.quantities = {};
        },
    },
});

export const { increment, decrement, remove, clearCart } = slice.actions;
export default slice.reducer;

// Counts distinct products actually in the cart (quantity > 0), not stale/zeroed keys.
export const getCartItemsCount = (state: any) =>
    Object.values(state.cart.quantities as Record<string, number>).filter((qty) => qty > 0).length;

export const getCartUnitsCount = (state: any) =>
    Object.values(state.cart.quantities as Record<string, number>).reduce(
        (sum: number, qty) => sum + (qty as number),
        0
    );

export const selectCartItems = (state: any) => {
    const quantities = state.cart.quantities;
    const products = state.productList;
    
    return Object.entries(quantities)
        .filter(([_, qty]: any) => qty > 0)
        .map(([productId, quantity]: any) => {
            const product = products.find((p: any) => p._id === productId);
            return {
                productId,
                quantity,
                product,
            };
        });
};

export const selectCartTotal = (state: any) => {
    const cartItems = selectCartItems(state);
    return cartItems.reduce((total, item: any) => {
        const price = item.product?.price || 0;
        return total + (price * item.quantity);
    }, 0);
};
