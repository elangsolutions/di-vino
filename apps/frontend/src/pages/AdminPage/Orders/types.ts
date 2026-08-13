import { OrderStatus } from '../../../generated/graphql';

export interface OrderItem {
    productId: string;
    title: string;
    price: number;
    quantity: number;
}

export interface OrderIssue {
    reason: string;
    message?: string | null;
    reportedAt: string;
}

export interface OrderAddress {
    street: string;
    city: string;
    postalCode: string;
    province: string;
}

export interface OrderDelivery {
    type: 'PICKUP' | 'ADDRESS';
    locationId?: string | null;
    scheduledDate?: string | null;
    timeSlot?: string | null;
    address?: OrderAddress | null;
}

export interface Order {
    _id: string;
    external_reference: string;
    status: OrderStatus;
    allowedTransitions: OrderStatus[];
    customerName?: string | null;
    customerEmail?: string | null;
    customerPhone?: string | null;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
    delivery: OrderDelivery;
    issues: OrderIssue[];
    discountAmount?: number | null;
}

export const orderTotal = (order: Order) => {
    const itemsTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return Math.max(0, itemsTotal - (order.discountAmount || 0));
};

export const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0,
    }).format(value);
