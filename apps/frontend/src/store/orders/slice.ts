import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type OngoingOrderItem = {
    productId: string;
    title: string;
    price: number;
    quantity: number;
};

export type OngoingOrderIssue = {
    reason: string;
    message?: string | null;
    reportedAt: string;
};

export type OngoingOrder = {
    id: string;
    externalReference: string;
    status: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryType: 'PICKUP' | 'ADDRESS';
    locationId?: string | null;
    items: OngoingOrderItem[];
    createdAt: string;
    discountAmount?: number | null;
    hidden?: boolean;
    issue?: OngoingOrderIssue | null;
};

interface OrdersState {
    ongoing: OngoingOrder[];
}

const initialState: OrdersState = {
    ongoing: [],
};

const slice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        addOngoingOrder: (state, action: PayloadAction<OngoingOrder>) => {
            const exists = state.ongoing.some((order) => order.id === action.payload.id);
            if (!exists) {
                state.ongoing.unshift(action.payload);
            }
        },
        updateOngoingOrderStatus: (
            state,
            action: PayloadAction<{ id: string; status: string }>,
        ) => {
            const order = state.ongoing.find((item) => item.id === action.payload.id);
            if (order) {
                order.status = action.payload.status;
            }
        },
        setOngoingOrderIssue: (
            state,
            action: PayloadAction<{ id: string; issue: OngoingOrderIssue | null }>,
        ) => {
            const order = state.ongoing.find((item) => item.id === action.payload.id);
            if (order) {
                order.issue = action.payload.issue;
            }
        },
        hideOngoingOrder: (state, action: PayloadAction<{ id: string }>) => {
            const order = state.ongoing.find((item) => item.id === action.payload.id);
            if (order) {
                order.hidden = true;
            }
        },
        restoreOngoingOrder: (state, action: PayloadAction<{ id: string }>) => {
            const order = state.ongoing.find((item) => item.id === action.payload.id);
            if (order) {
                order.hidden = false;
            }
        },
        removeOngoingOrder: (state, action: PayloadAction<{ id: string }>) => {
            state.ongoing = state.ongoing.filter((order) => order.id !== action.payload.id);
        },
        clearOngoingOrders: (state) => {
            state.ongoing = [];
        },
    },
});

export const {
    addOngoingOrder,
    updateOngoingOrderStatus,
    setOngoingOrderIssue,
    hideOngoingOrder,
    restoreOngoingOrder,
    removeOngoingOrder,
    clearOngoingOrders,
} = slice.actions;

export default slice.reducer;

const selectAllOrders = (state: { orders: OrdersState }) => state.orders.ongoing;

export const selectOngoingOrders = createSelector(selectAllOrders, (orders) =>
    orders.filter((order) => !order.hidden),
);

export const selectHiddenOrders = createSelector(selectAllOrders, (orders) =>
    orders.filter((order) => order.hidden),
);

export const selectHasOngoingOrders = (state: { orders: OrdersState }) =>
    selectOngoingOrders(state).length > 0;
