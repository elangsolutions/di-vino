import { OrderStatus } from '../../generated/graphql';

type StatusMeta = {
    /** Shown to customers and admins alike. */
    label: string;
    /** Wording for the button that moves an order *into* this status. */
    action: string;
    color: string;
};

export const orderStatusMeta: Record<OrderStatus, StatusMeta> = {
    [OrderStatus.PendingPayment]: {
        label: 'Pendiente de pago',
        action: 'Marcar pendiente de pago',
        color: 'gold',
    },
    [OrderStatus.Paid]: { label: 'Pagado', action: 'Marcar como pagado', color: 'green' },
    [OrderStatus.Preparing]: { label: 'En preparación', action: 'Preparar', color: 'blue' },
    [OrderStatus.Ready]: { label: 'Listo para entregar', action: 'Marcar listo', color: 'cyan' },
    [OrderStatus.Delivered]: { label: 'Entregado', action: 'Marcar entregado', color: 'purple' },
    [OrderStatus.Closed]: { label: 'Cerrado', action: 'Cerrar pedido', color: 'default' },
    [OrderStatus.Cancelled]: { label: 'Cancelado', action: 'Cancelar pedido', color: 'red' },
};

/** Order in which statuses are presented in filters and summaries. */
export const orderStatusSequence: OrderStatus[] = [
    OrderStatus.PendingPayment,
    OrderStatus.Paid,
    OrderStatus.Preparing,
    OrderStatus.Ready,
    OrderStatus.Delivered,
    OrderStatus.Closed,
    OrderStatus.Cancelled,
];

/** Statuses that still need someone to act on them. */
export const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
    OrderStatus.PendingPayment,
    OrderStatus.Paid,
    OrderStatus.Preparing,
    OrderStatus.Ready,
];

export const pickupLocationNames: Record<string, string> = {
    loc1: 'San Sebastian - Guardia',
    loc2: 'El Canton - Guardia',
};

/**
 * Orders created before the status enum existed carry lowercase values, and
 * anything persisted in localStorage predates it too.
 */
export const getOrderStatusMeta = (status: string): StatusMeta => {
    const normalized = status?.toUpperCase() as OrderStatus;
    return (
        orderStatusMeta[normalized] ?? {
            label: status,
            action: status,
            color: 'default',
        }
    );
};
