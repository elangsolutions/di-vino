import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DeliveryType = 'pickup' | 'delivery';

interface DeliveryState {
    deliveryType: DeliveryType;
    pickup: {
        locationId: string | null;
        date: string | null;
        time: string | null;
    };
    delivery: {
        street: string;
        city: string;
        zip: string;
        date: string | null;
        time: string | null;
    };
}

const initialState: DeliveryState = {
    deliveryType: 'pickup',
    pickup: {
        locationId: null,
        date: null,
        time: null,
    },
    delivery: {
        street: '',
        city: '',
        zip: '',
        date: null,
        time: null,
    },
};

const slice = createSlice({
    name: 'delivery',
    initialState,
    reducers: {
        setDeliveryType: (state, action: PayloadAction<DeliveryType>) => {
            state.deliveryType = action.payload;
        },
        setPickupDetails: (state, action: PayloadAction<Partial<DeliveryState['pickup']>>) => {
            state.pickup = { ...state.pickup, ...action.payload };
        },
        setDeliveryDetails: (state, action: PayloadAction<Partial<DeliveryState['delivery']>>) => {
            state.delivery = { ...state.delivery, ...action.payload };
        },
        resetDelivery: () => initialState,
    },
});

export const { setDeliveryType, setPickupDetails, setDeliveryDetails, resetDelivery } = slice.actions;
export default slice.reducer;

export const selectDelivery = (state: any) => state.delivery as DeliveryState;

export const selectIsDeliveryValid = (state: any): boolean => {
    const delivery = state.delivery as DeliveryState;
    if (delivery.deliveryType === 'pickup') {
        return Boolean(delivery.pickup.locationId && delivery.pickup.date && delivery.pickup.time);
    }
    return Boolean(delivery.delivery.street && delivery.delivery.city && delivery.delivery.zip);
};
