import { useEffect, useState } from 'react';
import { Alert, Button, Empty, Layout, Space, Tag, Typography } from 'antd';
import {
    ArrowLeftOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    ReloadOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import { useApolloClient } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    hideOngoingOrder,
    OngoingOrder,
    restoreOngoingOrder,
    selectHiddenOrders,
    selectOngoingOrders,
    setOngoingOrderIssue,
    updateOngoingOrderStatus,
} from '../../store/orders/slice';
import ReportIssueModal, { issueReasonLabels } from './ReportIssueModal';
import { GET_ORDER } from './queries';
import { getOrderStatusMeta, pickupLocationNames } from '../../components/Order/constants';

const { Title, Text } = Typography;
const { Content, Header } = Layout;

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0,
    }).format(value);

const OrderCard = ({
    order,
    refreshing,
    onRefresh,
    onReportIssue,
    onHide,
    onRestore,
}: {
    order: OngoingOrder;
    refreshing: boolean;
    onRefresh: () => void;
    onReportIssue: () => void;
    onHide?: () => void;
    onRestore?: () => void;
}) => {
    const meta = getOrderStatusMeta(order.status);
    const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryLabel =
        order.deliveryType === 'PICKUP'
            ? `Retiro: ${pickupLocationNames[order.locationId ?? ''] ?? 'Punto de retiro'}`
            : 'Envío a domicilio';

    return (
        <div
            style={{
                border: '1px solid #f0f0f0',
                borderRadius: 12,
                padding: 16,
                background: '#fff',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                <div>
                    <Text strong style={{ display: 'block' }}>
                        Pedido {order.externalReference}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {new Date(order.createdAt).toLocaleString('es-AR')}
                    </Text>
                </div>
                <Tag color={meta.color}>{meta.label}</Tag>
            </div>

            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                {deliveryLabel}
            </Text>

            {order.issue && (
                <Alert
                    type="warning"
                    showIcon
                    style={{ marginBottom: 12 }}
                    message={`Problema reportado: ${
                        issueReasonLabels[order.issue.reason] ?? order.issue.reason
                    }`}
                    description={order.issue.message || undefined}
                />
            )}

            <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: 12 }}>
                {order.items.map((item) => (
                    <div
                        key={`${order.id}-${item.productId}`}
                        style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}
                    >
                        <Text>
                            {item.quantity}× {item.title}
                        </Text>
                        <Text>{formatCurrency(item.price * item.quantity)}</Text>
                    </div>
                ))}
            </Space>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text strong>Total</Text>
                <Text strong style={{ color: '#5ea18b' }}>
                    {formatCurrency(total)}
                </Text>
            </div>

            <Space style={{ width: '100%' }} direction="vertical">
                <Button icon={<ReloadOutlined />} loading={refreshing} onClick={onRefresh} block>
                    Actualizar estado
                </Button>
                {onHide && (
                    <Button type="link" icon={<EyeInvisibleOutlined />} onClick={onHide} block>
                        Ocultar de pedidos en curso
                    </Button>
                )}
                {onRestore && (
                    <Button type="link" icon={<EyeOutlined />} onClick={onRestore} block>
                        Volver a mostrar
                    </Button>
                )}
                <Button type="link" icon={<WarningOutlined />} onClick={onReportIssue} block>
                    Tuve un problema
                </Button>
            </Space>
        </div>
    );
};

const OrdersPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const client = useApolloClient();
    const ongoingOrders = useSelector(selectOngoingOrders);
    const hiddenOrders = useSelector(selectHiddenOrders);
    const [refreshingId, setRefreshingId] = useState<string | null>(null);
    const [showHidden, setShowHidden] = useState(false);
    const [reportingOrder, setReportingOrder] = useState<OngoingOrder | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setError(null);
    }, [ongoingOrders.length]);

    const refreshOrder = async (orderId: string) => {
        setRefreshingId(orderId);
        setError(null);
        try {
            const { data } = await client.query({
                query: GET_ORDER,
                variables: { id: orderId },
                fetchPolicy: 'network-only',
            });
            const status = data?.order?.status;
            if (status) {
                dispatch(updateOngoingOrderStatus({ id: orderId, status }));
            }
            const issues = data?.order?.issues ?? [];
            dispatch(
                setOngoingOrderIssue({ id: orderId, issue: issues[issues.length - 1] ?? null }),
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo actualizar el pedido');
        } finally {
            setRefreshingId(null);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#fafafa' }}>
            <Header
                style={{
                    background: '#fff',
                    borderBottom: '1px solid #f0f0f0',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    height: 'auto',
                    lineHeight: 'normal',
                }}
            >
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/')}
                    style={{ padding: 0 }}
                />
                <Title level={3} style={{ margin: 0, fontSize: 20 }}>
                    Mis pedidos
                </Title>
            </Header>

            <Content style={{ padding: 16, maxWidth: 560, margin: '0 auto', width: '100%' }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                    Pedidos en curso guardados en este dispositivo.
                </Text>

                {error && (
                    <Alert
                        type="error"
                        showIcon
                        message={error}
                        style={{ marginBottom: 16 }}
                    />
                )}

                {!ongoingOrders.length ? (
                    <Empty
                        description={
                            hiddenOrders.length
                                ? 'No tenés pedidos en curso visibles'
                                : 'No tenés pedidos en curso'
                        }
                        style={{ marginTop: 48, marginBottom: 24 }}
                    >
                        <Button type="primary" onClick={() => navigate('/')}>
                            Ir a la tienda
                        </Button>
                    </Empty>
                ) : (
                    <Space direction="vertical" size={16} style={{ width: '100%' }}>
                        {ongoingOrders.map((order) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                refreshing={refreshingId === order.id}
                                onRefresh={() => refreshOrder(order.id)}
                                onReportIssue={() => setReportingOrder(order)}
                                onHide={() => dispatch(hideOngoingOrder({ id: order.id }))}
                            />
                        ))}
                    </Space>
                )}

                {hiddenOrders.length > 0 && (
                    <div style={{ marginTop: 24 }}>
                        <Button
                            type="text"
                            icon={showHidden ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                            onClick={() => setShowHidden((prev) => !prev)}
                            block
                        >
                            {showHidden
                                ? 'Ocultar pedidos ocultos'
                                : `Ver pedidos ocultos (${hiddenOrders.length})`}
                        </Button>

                        {showHidden && (
                            <Space
                                direction="vertical"
                                size={16}
                                style={{ width: '100%', marginTop: 16 }}
                            >
                                {hiddenOrders.map((order) => (
                                    <OrderCard
                                        key={order.id}
                                        order={order}
                                        refreshing={refreshingId === order.id}
                                        onRefresh={() => refreshOrder(order.id)}
                                        onReportIssue={() => setReportingOrder(order)}
                                        onRestore={() =>
                                            dispatch(restoreOngoingOrder({ id: order.id }))
                                        }
                                    />
                                ))}
                            </Space>
                        )}
                    </div>
                )}
            </Content>

            <ReportIssueModal
                order={reportingOrder}
                onClose={() => setReportingOrder(null)}
                onReported={(orderId, issue) => dispatch(setOngoingOrderIssue({ id: orderId, issue }))}
            />
        </Layout>
    );
};

export default OrdersPage;
