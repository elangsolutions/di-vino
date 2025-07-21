import React, {useMemo} from 'react';
import {Card, Row, Col, Button, Typography, Divider} from 'antd';
import {MinusOutlined, PlusOutlined, DeleteOutlined} from '@ant-design/icons';
import {useSelector} from "react-redux";

// Dummy product cart type
type Product = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};

// Props could be passed from a Redux selector or context
interface CartProps {
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onRemove: (id: string) => void;
}

const CartList: React.FC<CartProps> = ({onIncrease, onDecrease, onRemove}) => {

    const {productList, cart} = useSelector((state) => state);

    const cartWithDetails = useMemo(() => {
        return Object.entries(cart.quantities).map(item => {
            const product = productList.find(prd => prd._id === item[0]);
            if (!product) {
                return null;
            }
            return {id: item[0], quantity: item[1], price: product.price, name: product.name}
        }).filter(Boolean)
    }, [productList, cart])

    const total = cartWithDetails.reduce((sum, p) => sum + p.price * p.quantity, 0);

    return (
        <Card title="Listita" bordered style={{maxWidth: 600, margin: '0 auto'}}>
            {cartWithDetails.map((product) => (
                <Row key={product.id} gutter={16} align="start" style={{marginBottom: 12}}>
                    <Col span={10} style={{textAlign: 'start'}}>
                        <Typography.Text>{product.name}</Typography.Text>
                    </Col>
                    <Col span={10}>
                        <Button
                            icon={<MinusOutlined/>}
                            onClick={() => onDecrease(product.id)}
                            size="small"
                            disabled={product.quantity <= 1}
                        />
                        <span style={{margin: '0 8px'}}>{product.quantity}</span>
                        <Button
                            icon={<PlusOutlined/>}
                            onClick={() => onIncrease(product.id)}
                            size="small"
                            style={{marginRight: 8}}
                        />
                        <Button
                            icon={<DeleteOutlined/>}
                            onClick={() => onRemove(product.id)}
                            size="small"
                            danger
                        />
                    </Col>
                    <Col span={4} style={{textAlign: 'end'}}>
                        <Typography.Text strong>
                            ${(product.price * product.quantity).toFixed(2)}
                        </Typography.Text>
                    </Col>
                </Row>
            ))}
            <Divider/>
            <Row justify="end">
                <Col>
                    <Typography.Title level={5}>Total: ${total.toFixed(2)}</Typography.Title>
                </Col>
            </Row>
        </Card>
    );
};

export default CartList;
