import { useMemo, useState } from 'react';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import {
    Alert,
    Button,
    Card,
    Descriptions,
    Empty,
    Grid,
    Input,
    Modal,
    Segmented,
    Space,
    Spin,
    Table,
    Tag,
    Tooltip,
    Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    EnvironmentOutlined,
    HomeOutlined,
    ReloadOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { GET_ORDERS, UPDATE_ORDER_STATUS } from '../../../../components/Order/queries';
import {
    ACTIVE_ORDER_STATUSES,
    getOrderStatusMeta,
    orderStatusSequence,
    pickupLocationNames,
} from '../../../../components/Order/constants';
import { OrderStatus } from '../../../../generated/graphql';
import { useNotify } from '../../../../context/NotificationContext';
import NextDeliveries from '../NextDeliveries';
import { formatCurrency, Order, orderTotal } from '../types';

const { Text, Title } = Typography;

const getApolloErrorMessage = (err: unknown, fallback: string) => {
    if (err instanceof ApolloError) {
        return err.graphQLErrors[0]?.message || err.message || fallback;
    }
    if (err instanceof Error) {
        return err.message;
    }
    return fallback;
};

type StatusFilter = 'ACTIVE' | 'ALL' | OrderStatus;

const deliveryPlace = (order: Order) => {
    if (order.delivery.type === 'PICKUP') {
        return pickupLocationNames[order.delivery.locationId ?? ''] ?? 'Punto de retiro';
    }
    const address = order.delivery.address;
    return address
        ? `${address.street}, ${address.city} (${address.postalCode})`
        : 'Envío a domicilio';
};

const scheduledLabel = (order: Order) => {
    const { scheduledDate, timeSlot } = order.delivery;
    if (!scheduledDate) return null;
    const date = dayjs(scheduledDate);
    if (!date.isValid()) return null;
    return `${date.format('DD/MM/YYYY')} · ${timeSlot || date.format('HH:mm')}`;
};

const OrderListPage = () => {
    const { notifySuccess, notifyError } = useNotify();
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;

    const [statusFilter, setStatusFilter] = useState<StatusFilter>('ACTIVE');
    const [search, setSearch] = useState('');
    const [pendingTransition, setPendingTransition] = useState<{
        order: Order;
        status: OrderStatus;
    } | null>(null);

    const { data, loading, error, refetch } = useQuery(GET_ORDERS, {
        fetchPolicy: 'cache-and-network',
    });
    const [updateOrderStatus, { loading: updating }] = useMutation(UPDATE_ORDER_STATUS);

    const orders: Order[] = useMemo(() => data?.orders ?? [], [data]);

    const counts = useMemo(() => {
        const byStatus = new Map<string, number>();
        orders.forEach((order) => {
            byStatus.set(order.status, (byStatus.get(order.status) ?? 0) + 1);
        });
        return byStatus;
    }, [orders]);

    const visibleOrders = useMemo(() => {
        const term = search.trim().toLowerCase();
        return orders.filter((order) => {
            if (statusFilter === 'ACTIVE' && !ACTIVE_ORDER_STATUSES.includes(order.status)) {
                return false;
            }
            if (statusFilter !== 'ACTIVE' && statusFilter !== 'ALL' && order.status !== statusFilter) {
                return false;
            }
            if (!term) return true;
            return [
                order.external_reference,
                order.customerName,
                order.customerEmail,
                order.customerPhone,
            ]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(term));
        });
    }, [orders, statusFilter, search]);

    const applyTransition = async (order: Order, status: OrderStatus) => {
        try {
            await updateOrderStatus({ variables: { input: { orderId: order._id, status } } });
            notifySuccess(
                'Estado actualizado',
                `El pedido ${order.external_reference} pasó a "${getOrderStatusMeta(status).label}".`,
            );
            setPendingTransition(null);
        } catch (err) {
            notifyError(
                'No se pudo actualizar el pedido',
                getApolloErrorMessage(err, 'Error desconocido'),
            );
        }
    };

    const requestTransition = (order: Order, status: OrderStatus) => {
        if (status === OrderStatus.Cancelled) {
            setPendingTransition({ order, status });
            return;
        }
        void applyTransition(order, status);
    };

    const statusOptions = useMemo(
        () => [
            { label: `Activos (${orders.filter((o) => ACTIVE_ORDER_STATUSES.includes(o.status)).length})`, value: 'ACTIVE' },
            ...orderStatusSequence.map((status) => ({
                label: `${getOrderStatusMeta(status).label} (${counts.get(status) ?? 0})`,
                value: status,
            })),
            { label: `Todos (${orders.length})`, value: 'ALL' },
        ],
        [orders, counts],
    );

    const columns: ColumnsType<Order> = [
        {
            title: 'Pedido',
            dataIndex: 'external_reference',
            key: 'reference',
            render: (_, order) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{order.external_reference}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Creado {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}
                    </Text>
                    {order.issues.length > 0 && (
                        <Tooltip
                            title={
                                order.issues[order.issues.length - 1].message ||
                                'El cliente reportó un problema'
                            }
                        >
                            <Tag icon={<WarningOutlined />} color="warning">
                                Problema reportado
                            </Tag>
                        </Tooltip>
                    )}
                </Space>
            ),
        },
        {
            title: 'Cliente',
            key: 'customer',
            responsive: ['md'],
            render: (_, order) => (
                <Space direction="vertical" size={0}>
                    <Text>{order.customerName || 'Sin nombre'}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {order.customerPhone || order.customerEmail}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Entrega',
            key: 'delivery',
            sorter: (a, b) =>
                dayjs(a.delivery.scheduledDate ?? 0).valueOf() -
                dayjs(b.delivery.scheduledDate ?? 0).valueOf(),
            render: (_, order) => {
                const scheduled = scheduledLabel(order);
                return (
                    <Space direction="vertical" size={0}>
                        <Text>
                            {order.delivery.type === 'PICKUP' ? (
                                <EnvironmentOutlined />
                            ) : (
                                <HomeOutlined />
                            )}{' '}
                            {deliveryPlace(order)}
                        </Text>
                        {scheduled ? (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {scheduled}
                            </Text>
                        ) : (
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Sin fecha agendada
                            </Text>
                        )}
                    </Space>
                );
            },
        },
        {
            title: 'Total',
            key: 'total',
            align: 'right',
            responsive: ['sm'],
            sorter: (a, b) => orderTotal(a) - orderTotal(b),
            render: (_, order) => <Text strong>{formatCurrency(orderTotal(order))}</Text>,
        },
        {
            title: 'Estado',
            key: 'status',
            render: (_, order) => {
                const meta = getOrderStatusMeta(order.status);
                return <Tag color={meta.color}>{meta.label}</Tag>;
            },
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, order) => {
                if (!order.allowedTransitions.length) {
                    return (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Sin acciones
                        </Text>
                    );
                }
                return (
                    <Space wrap size={4}>
                        {order.allowedTransitions.map((status) => {
                            const isCancel = status === OrderStatus.Cancelled;
                            return (
                                <Button
                                    key={status}
                                    size="small"
                                    type={isCancel ? 'link' : 'primary'}
                                    danger={isCancel}
                                    disabled={updating}
                                    onClick={() => requestTransition(order, status)}
                                >
                                    {getOrderStatusMeta(status).action}
                                </Button>
                            );
                        })}
                    </Space>
                );
            },
        },
    ];

    if (loading && !orders.length) {
        return <Spin style={{ display: 'block', margin: '2rem auto' }} />;
    }

    return (
        <div style={{ padding: isMobile ? 2 : 24 }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                    flexWrap: 'wrap',
                    marginBottom: 16,
                }}
            >
                <Title level={2} style={{ margin: 0 }}>
                    Pedidos
                </Title>
                <Button icon={<ReloadOutlined />} onClick={() => refetch()} loading={loading}>
                    Actualizar
                </Button>
            </div>

            {error && (
                <Alert
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                    message="No se pudieron cargar los pedidos"
                    description={error.message}
                />
            )}

            <NextDeliveries orders={orders} />

            <Card>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Segmented
                            options={statusOptions}
                            value={statusFilter}
                            onChange={(value) => setStatusFilter(value as StatusFilter)}
                            style={{ overflowX: 'auto', maxWidth: '100%' }}
                        />
                        <Input.Search
                            allowClear
                            placeholder="Buscar por pedido, nombre o teléfono"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: isMobile ? '100%' : 320 }}
                        />
                    </Space>

                    <Table<Order>
                        rowKey="_id"
                        columns={columns}
                        dataSource={visibleOrders}
                        loading={loading}
                        scroll={{ x: 'max-content' }}
                        pagination={{ pageSize: 20, hideOnSinglePage: true }}
                        locale={{
                            emptyText: (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="No hay pedidos para este filtro"
                                />
                            ),
                        }}
                        expandable={{
                            expandedRowRender: (order) => (
                                <Descriptions
                                    size="small"
                                    column={1}
                                    styles={{ label: { width: 140 } }}
                                >
                                    <Descriptions.Item label="Productos">
                                        <Space direction="vertical" size={0}>
                                            {order.items.map((item) => (
                                                <Text key={item.productId}>
                                                    {item.quantity}× {item.title} —{' '}
                                                    {formatCurrency(item.price * item.quantity)}
                                                </Text>
                                            ))}
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Contacto">
                                        {[order.customerName, order.customerEmail, order.customerPhone]
                                            .filter(Boolean)
                                            .join(' · ') || 'Sin datos'}
                                    </Descriptions.Item>
                                    {order.issues.length > 0 && (
                                        <Descriptions.Item label="Problemas">
                                            <Space direction="vertical" size={0}>
                                                {order.issues.map((issue, index) => (
                                                    <Text key={`${order._id}-issue-${index}`}>
                                                        {dayjs(issue.reportedAt).format(
                                                            'DD/MM/YYYY HH:mm',
                                                        )}{' '}
                                                        · {issue.reason}
                                                        {issue.message ? ` — ${issue.message}` : ''}
                                                    </Text>
                                                ))}
                                            </Space>
                                        </Descriptions.Item>
                                    )}
                                </Descriptions>
                            ),
                        }}
                    />
                </Space>
            </Card>

            <Modal
                open={Boolean(pendingTransition)}
                title="Cancelar pedido"
                okText="Sí, cancelar"
                okType="danger"
                cancelText="Volver"
                confirmLoading={updating}
                onOk={() =>
                    pendingTransition &&
                    applyTransition(pendingTransition.order, pendingTransition.status)
                }
                onCancel={() => !updating && setPendingTransition(null)}
                destroyOnClose
            >
                <p>
                    ¿Seguro que querés cancelar el pedido{' '}
                    <strong>{pendingTransition?.order.external_reference}</strong>?
                </p>
                <p style={{ color: '#8c8c8c', marginBottom: 0 }}>
                    Un pedido cancelado no puede volver a otro estado.
                </p>
            </Modal>
        </div>
    );
};

export default OrderListPage;
