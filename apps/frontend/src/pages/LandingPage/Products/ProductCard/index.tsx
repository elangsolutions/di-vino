import {Button, Card, Col, Space} from "antd";
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import {JSX} from "react";
import {useDisclosure} from "../../../../components/hooks/useDisclosure.tsx";
import ProductCardModal from "../ProductCardModal";
import {Product} from "../../../../generated/graphql.ts";
import NO_IMAGE from "../../../../assets/place_holder.png";
import {RootState} from "@reduxjs/toolkit/query";
import {useDispatch, useSelector} from "react-redux";
import {decrement, increment} from "../../../../store/cart/slice.ts";

type ProductCardProps = {
    product: Product
}

const ProductCard: (props: ProductCardProps) => JSX.Element = (props: ProductCardProps) => {

    const {product} = props;
    const {isOpen, close, open} = useDisclosure()
    const dispatch = useDispatch();
    const quantity = useSelector((state: RootState) => state.cart.quantities[product._id] || 0);

    const handleIncrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(increment({ productId: product._id }));
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(decrement({ productId: product._id }));
    };
    return <Col xs={12} sm={8} md={6} key={product._id}>
        <Card onClick={open}
              hoverable
              cover={<img alt={product.name} src={product.image||NO_IMAGE}/>}
        >
            <Card.Meta
                title={product.name}
                description={
                    <>
                        <div style={{ fontWeight: 'bold' }}>${product.price}.-</div>
                        <div style={{ color: 'gray' }}>{product.details}</div> {/* Extra line */}
                    </>
                }
            />
            <Space style={{ marginTop: 12 }}>
                <Button
                    icon={<MinusOutlined />}
                    onClick={handleDecrement}
                    disabled={quantity === 0}
                />
                <span>{quantity}</span>
                <Button icon={<PlusOutlined />} onClick={handleIncrement} />
            </Space>
        </Card>
        <ProductCardModal isOpen={isOpen} close={close} product={product}/>
    </Col>
}

export default ProductCard