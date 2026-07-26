import React, {useMemo} from 'react';
import {Card, Button, Typography, Divider, Empty} from 'antd';
import {MinusOutlined, PlusOutlined, DeleteOutlined} from '@ant-design/icons';
import {useSelector} from "react-redux";
import {getProductImage, priceFormat} from "../../../utils";
import {RootState} from "../../../store/store";

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
        return Object.entries(cart.quantities)
            .filter(([, qty]) => (qty as number) > 0)
            .map(item => {
                const product = productList.find((prd: any) => prd._id === item[0]);
                if (!product) {
                    return null;
                }
                return {
                    id: item[0],
                    quantity: item[1],
                    price: product.price,
                    name: product.name,
                    image: getProductImage(product.image, product.category),
                };
            }).filter((p) => p !== null) as {
                id: string; quantity: number; price: number; name: string; image?: string;
            }[];
    }, [productList, cart])

    const total = cartWithDetails.reduce((sum, p) => sum + p.price * p.quantity, 0);

    if (cartWithDetails.length === 0) {
        return (
            <Card style={{maxWidth: 600, margin: '0 auto'}}>
                <Empty description="Tu carrito está vacío" />
            </Card>
        );
    }

    return (
        <Card title="Tu pedido" style={{maxWidth: 600, margin: '0 auto'}} styles={{body: {padding: 12}}}>
            {cartWithDetails.map((product) => (
                <div
                    key={product.id}
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 4px',
                        borderBottom: '1px solid #f0f0f0',
                    }}
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        style={{
                            width: 48,
                            height: 48,
                            objectFit: 'cover',
                            borderRadius: 8,
                            flexShrink: 0,
                        }}
                    />

                    <div style={{flex: '1 1 140px', minWidth: 140}}>
                        <Typography.Text style={{display: 'block'}}>{product.name}</Typography.Text>
                        <Typography.Text strong style={{fontSize: 13, color: '#5ea18b'}}>
                            ${priceFormat(product.price * product.quantity)}
                        </Typography.Text>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            marginLeft: 'auto',
                        }}
                    >
                        <Button
                            icon={<MinusOutlined/>}
                            onClick={() => onDecrease(product.id)}
                            size="large"
                            disabled={product.quantity <= 1}
                        />
                        <span style={{minWidth: 20, textAlign: 'center'}}>{product.quantity}</span>
                        <Button
                            type="primary"
                            icon={<PlusOutlined/>}
                            onClick={() => onIncrease(product.id)}
                            size="large"
                        />
                        <Button
                            icon={<DeleteOutlined/>}
                            onClick={() => onRemove(product.id)}
                            size="large"
                            danger
                        />
                    </div>
                </div>
            ))}
            <Divider style={{margin: '12px 0'}}/>
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <Typography.Title level={5} style={{margin: 0}}>
                    Total: ${priceFormat(total)}
                </Typography.Title>
            </div>
        </Card>
    );
};

export default CartList;
