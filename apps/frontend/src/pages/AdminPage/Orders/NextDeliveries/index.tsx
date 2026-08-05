import { useMemo } from 'react';
import { Alert, Badge, Card, Empty, Space, Tag, Typography } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, HomeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
// Registers the locale without changing dayjs' global default.
import 'dayjs/locale/es';
import {
    ACTIVE_ORDER_STATUSES,
    getOrderStatusMeta,
    pickupLocationNames,
} from '../../../../components/Order/constants';
import { formatCurrency, Order, orderTotal } from '../types';

const { Text, Title } = Typography;

const DAYS_AHEAD = 14;

const dayHeading = (date: dayjs.Dayjs) => {
    const today = dayjs().startOf('day');
    const diff = date.startOf('day').diff(today, 'day');
    if (diff === 0) return 'Hoy';
    if (diff === 1) return 'Mañana';

    const formatted = date.locale('es').format('dddd D [de] MMMM');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

type DeliveryGroup = {
    key: string;
    date: dayjs.Dayjs;
    orders: Order[];
};

const scheduledDateOf = (order: Order) => {
    if (!ACTIVE_ORDER_STATUSES.includes(order.status)) return null;
    const scheduled = order.delivery.scheduledDate;
    if (!scheduled) return null;
    const date = dayjs(scheduled);
    return date.isValid() ? date : null;
};

/** Still-active orders whose delivery slot has already passed. */
const findOverdue = (orders: Order[]): Order[] => {
    const today = dayjs().startOf('day');
    return orders
        .filter((order) => scheduledDateOf(order)?.isBefore(today))
        .sort(
            (a, b) =>
                dayjs(a.delivery.scheduledDate).valueOf() -
                dayjs(b.delivery.scheduledDate).valueOf(),
        );
};

const groupUpcomingDeliveries = (orders: Order[]): DeliveryGroup[] => {
    const from = dayjs().startOf('day');
    const to = from.add(DAYS_AHEAD, 'day').endOf('day');

    const upcoming = orders.filter((order) => {
        const date = scheduledDateOf(order);
        return Boolean(date && !date.isBefore(from) && !date.isAfter(to));
    });

    const groups = new Map<string, DeliveryGroup>();
    upcoming.forEach((order) => {
        const date = dayjs(order.delivery.scheduledDate);
        const key = date.format('YYYY-MM-DD');
        if (!groups.has(key)) {
            groups.set(key, { key, date: date.startOf('day'), orders: [] });
        }
        groups.get(key)!.orders.push(order);
    });

    return Array.from(groups.values())
        .sort((a, b) => a.date.valueOf() - b.date.valueOf())
        .map((group) => ({
            ...group,
            orders: group.orders.sort(
                (a, b) =>
                    dayjs(a.delivery.scheduledDate).valueOf() -
                    dayjs(b.delivery.scheduledDate).valueOf(),
            ),
        }));
};

const deliveryPlace = (order: Order) => {
    if (order.delivery.type === 'PICKUP') {
        return pickupLocationNames[order.delivery.locationId ?? ''] ?? 'Punto de retiro';
    }
    const address = order.delivery.address;
    return address ? `${address.street}, ${address.city}` : 'Envío a domicilio';
};

const DeliveryRow = ({ order, showDate = false }: { order: Order; showDate?: boolean }) => {
    const meta = getOrderStatusMeta(order.status);
    const scheduled = dayjs(order.delivery.scheduledDate);
    const time = order.delivery.timeSlot || scheduled.format('HH:mm');
    const when = showDate ? `${scheduled.format('DD/MM')} ${time}` : time;

    return (
        <div
            style={{
                display: 'flex',
                gap: 12,
                alignItems: 'baseline',
                padding: '8px 0',
                borderTop: '1px solid #f5f5f5',
                flexWrap: 'wrap',
            }}
        >
            <Text strong style={{ minWidth: showDate ? 90 : 48 }}>
                {when}
            </Text>
            <Text style={{ minWidth: 140, flex: 1 }}>{order.customerName || 'Sin nombre'}</Text>
            <Text type="secondary" style={{ flex: 2, minWidth: 180 }}>
                {order.delivery.type === 'PICKUP' ? <EnvironmentOutlined /> : <HomeOutlined />}{' '}
                {deliveryPlace(order)}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
                {order.external_reference}
            </Text>
            <Text strong>{formatCurrency(orderTotal(order))}</Text>
            <Tag color={meta.color} style={{ marginInlineEnd: 0 }}>
                {meta.label}
            </Tag>
        </div>
    );
};

const NextDeliveries = ({ orders }: { orders: Order[] }) => {
    const groups = useMemo(() => groupUpcomingDeliveries(orders), [orders]);
    const overdue = useMemo(() => findOverdue(orders), [orders]);
    const total = groups.reduce((sum, group) => sum + group.orders.length, 0);

    return (
        <Card
            title={
                <Space>
                    <CalendarOutlined />
                    Próximas entregas
                    {total > 0 && <Badge count={total} color="#5ea18b" />}
                </Space>
            }
            style={{ marginBottom: 24 }}
            styles={{ body: { paddingTop: groups.length || overdue.length ? 8 : 24 } }}
        >
            {overdue.length > 0 && (
                <Alert
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                    message={`${overdue.length} ${
                        overdue.length === 1 ? 'pedido vencido' : 'pedidos vencidos'
                    } sin entregar`}
                    description={
                        <div>
                            {overdue.map((order) => (
                                <DeliveryRow key={order._id} order={order} showDate />
                            ))}
                        </div>
                    }
                />
            )}

            {!groups.length ? (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={`No hay entregas agendadas en los próximos ${DAYS_AHEAD} días`}
                />
            ) : (
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    {groups.map((group) => (
                        <div key={group.key}>
                            <Title level={5} style={{ marginBottom: 4 }}>
                                {dayHeading(group.date)}{' '}
                                <Text type="secondary" style={{ fontWeight: 400, fontSize: 13 }}>
                                    · {group.orders.length}{' '}
                                    {group.orders.length === 1 ? 'pedido' : 'pedidos'}
                                </Text>
                            </Title>
                            {group.orders.map((order) => (
                                <DeliveryRow key={order._id} order={order} />
                            ))}
                        </div>
                    ))}
                </Space>
            )}
        </Card>
    );
};

export default NextDeliveries;
