import {Button, Card, Col, Space} from "antd";
import {PlusOutlined, MinusOutlined} from '@ant-design/icons';
import {JSX} from "react";
import {useDisclosure} from "../../../../components/hooks/useDisclosure.tsx";
import ProductCardModal from "../ProductCardModal";
import {Product} from "../../../../generated/graphql.ts";
import NO_IMAGE from "../../../../assets/place_holder.png";
import { RootState } from "../../../../store/store";
import {useDispatch, useSelector} from "react-redux";
import {decrement, increment} from "../../../../store/cart/slice.ts";
import {priceFormat} from "../../../../utils";

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
        dispatch(increment({productId: product._id}));
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(decrement({productId: product._id}));
    };
    return <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
        <Card onClick={open}
              hoverable
              cover={<img alt={product.name} src={product.image || NO_IMAGE}/>}
              style={{minWidth: '200px', maxWidth: '400px', height: '500px', maxHeight: '500px'}}
        >
            <Card.Meta
                title={product.name}
                description={
                    <>
                        <div style={{fontWeight: 'bold'}}>${priceFormat(product.price)}.-</div>
                        <div
                            style={{
                                color: 'gray',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '100%'
                            }}
                        >
                            {product.details}
                        </div>
                    </>
                }
            />
            <Space style={{marginTop: 12}}>
                <Button
                    icon={<MinusOutlined/>}
                    onClick={handleDecrement}
                    disabled={quantity === 0}
                />
                <span>{quantity}</span>
                <Button type={'primary'} icon={<PlusOutlined/>} onClick={handleIncrement}/>
            </Space>
        </Card>
        <ProductCardModal isOpen={isOpen} close={close} product={product}/>
    </Col>
}

export default ProductCard