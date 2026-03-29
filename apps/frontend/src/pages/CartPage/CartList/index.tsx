import React, {useMemo} from 'react';
import {Card, Row, Col, Button, Typography, Divider} from 'antd';
import {MinusOutlined, PlusOutlined, DeleteOutlined} from '@ant-design/icons';
import {useSelector} from "react-redux";
import {priceFormat} from "../../../utils";
import { RootState } from "../../../store/store";

interface CartProps {
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onRemove: (id: string) => void;
}

const CartList: React.FC<CartProps> = ({onIncrease, onDecrease, onRemove}) => {

    const {productList, cart} = useSelector((state: RootState) => ({
        productList: state.productList,
        cart: state.cart,
    }));

    const cartWithDetails = useMemo(() => {
        return Object.entries(cart.quantities).map(item => {
            const product = productList.find((prd: any) => prd._id === item[0]);
            if (!product) {
                return null;
            }
            return {id: item[0], quantity: item[1], price: product.price, name: product.name}
        }).filter((p: any) => p !== null)
    }, [productList, cart])

    const total = cartWithDetails.reduce((sum, p: any) => sum + (p?.price ?? 0) * (p?.quantity ?? 0), 0);

    return (
        <Card title="Listita" style={{maxWidth: 600, margin: '0 auto'}}>
            {cartWithDetails.map((product: any) => (
                <Row key={product.id} gutter={16} align="middle" style={{marginBottom: 12}}>
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
                            type="primary"
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
                            ${priceFormat(product.price * product.quantity)}
                        </Typography.Text>
                    </Col>
                </Row>
            ))}
            <Divider/>
            <Row justify="end">
                <Col>
                    <Typography.Title level={5}>Total: ${priceFormat(total)}</Typography.Title>
                </Col>
            </Row>
        </Card>
    );
};

export default CartList;
