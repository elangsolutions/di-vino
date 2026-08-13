import {Button, Card, Col, Space} from "antd";
import {PlusOutlined, MinusOutlined} from '@ant-design/icons';
import {JSX} from "react";
import {useDisclosure} from "../../../../components/hooks/useDisclosure.tsx";
import ProductCardModal from "../ProductCardModal";
import {Product} from "../../../../generated/graphql.ts";
import { RootState } from "../../../../store/store";
import {useDispatch, useSelector} from "react-redux";
import {decrement, increment} from "../../../../store/cart/slice.ts";
import {getProductImage, priceFormat} from "../../../../utils";

type ProductCardProps = {
    product: Product
}

const ProductCard: (props: ProductCardProps) => JSX.Element = (props: ProductCardProps) => {

    const {product} = props;
    const {isOpen, close, open} = useDisclosure()
    const dispatch = useDispatch();
    const quantity = useSelector((state: RootState) => state.cart.quantities[product._id] || 0);

    const handleIncrement = (e: React.MouseEvent, amount = 1) => {
        e.stopPropagation();
        dispatch(increment({productId: product._id, amount}));
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(decrement({productId: product._id}));
    };
    return <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
        <Card onClick={open}
              hoverable
              cover={
                  <div style={{width: '100%', aspectRatio: '4 / 3', overflow: 'hidden'}}>
                      <img
                          alt={product.name}
                          src={getProductImage(product.image, product.category)}
                          style={{width: '100%', height: '100%', objectFit: 'cover'}}
                      />
                  </div>
              }
              style={{minWidth: '200px', maxWidth: '400px'}}
        >
            <Card.Meta
                title={product.name}
                description={
                    <>
                        <div style={{fontWeight: 'bold'}}>
                            {product.activeItemPrice
                                ? `$${priceFormat(product.activeItemPrice.price)}.-`
                                : null}
                        </div>
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
            <div className="product-card-actions" style={{marginTop: 12, width: '100%'}}>
                <Space style={{display: 'flex', width: '100%'}}>
                    <Button
                        size="large"
                        icon={<MinusOutlined/>}
                        onClick={handleDecrement}
                        disabled={quantity === 0}
                    />
                    <span style={{minWidth: 20, textAlign: 'center', display: 'inline-block'}}>{quantity}</span>
                    <Button
                        size="large"
                        type="primary"
                        icon={<PlusOutlined/>}
                        onClick={(e) => handleIncrement(e)}
                    />
                </Space>
                <Space size={8} style={{marginTop: 8, display: 'flex', width: '100%'}}>
                    <Button size="small" onClick={(e) => handleIncrement(e, 6)}>
                        +6
                    </Button>
                    <Button size="small" onClick={(e) => handleIncrement(e, 10)}>
                        +10
                    </Button>
                </Space>
            </div>
        </Card>
        <ProductCardModal isOpen={isOpen} close={close} product={product}/>
    </Col>
}

export default ProductCard