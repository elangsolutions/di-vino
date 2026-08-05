import { Badge, Button, Typography } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectOngoingOrders } from '../../store/orders/slice';

const { Text } = Typography;

const OngoingOrdersBanner = () => {
    const navigate = useNavigate();
    const ongoingOrders = useSelector(selectOngoingOrders);

    if (!ongoingOrders.length) return null;

    const latest = ongoingOrders[0];

    return (
        <section
            style={{
                marginBottom: 24,
                padding: 16,
                borderRadius: 12,
                border: '1px solid #d9ebe4',
                background: 'linear-gradient(135deg, #f3faf7 0%, #ffffff 100%)',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    flexWrap: 'wrap',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <Badge count={ongoingOrders.length} style={{ backgroundColor: '#5ea18b' }}>
                        <ShoppingOutlined style={{ fontSize: 22, color: '#5ea18b' }} />
                    </Badge>
                    <div style={{ minWidth: 0 }}>
                        <Text strong style={{ display: 'block' }}>
                            Pedido en curso
                        </Text>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            {latest.externalReference} · {latest.items.length} producto
                            {latest.items.length === 1 ? '' : 's'}
                        </Text>
                    </div>
                </div>
                <Button type="primary" onClick={() => navigate('/orders')}>
                    Ver pedidos
                </Button>
            </div>
        </section>
    );
};

export default OngoingOrdersBanner;
