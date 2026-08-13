import {Button, Card, Col} from "antd";
import {PlusOutlined, MinusOutlined} from '@ant-design/icons';
import {JSX} from "react";
import {useDisclosure} from "../../../../components/hooks/useDisclosure.tsx";
import ProductCardModal from "../ProductCardModal";
import {Product} from "../../../../generated/graphql.ts";
import { RootState } from "../../../../store/store";
import {useDispatch, useSelector} from "react-redux";
import {decrement, increment} from "../../../../store/cart/slice.ts";
import {getProductImage, priceFormat} from "../../../../utils";
import { describeCatalogOffer, Promotion } from "../../../../components/Promotion/utils";
import "./styles.css";

type ProductCardProps = {
    product: Product
    bulkPromotion?: Promotion
    productPromotion?: Promotion
}

const ProductCard: (props: ProductCardProps) => JSX.Element = (props: ProductCardProps) => {

    const {product, bulkPromotion, productPromotion} = props;
    const {isOpen, close, open} = useDisclosure()
    const dispatch = useDispatch();
    const quantity = useSelector((state: RootState) => state.cart.quantities[product._id] || 0);
    const unitsPerBulk = product.unitsPerBulk && product.unitsPerBulk >= 2
        ? product.unitsPerBulk
        : undefined;

    const handleIncrement = (e: React.MouseEvent, amount = 1) => {
        e.stopPropagation();
        dispatch(increment({productId: product._id, amount}));
    };

    const handleDecrement = (e: React.MouseEvent, amount = 1) => {
        e.stopPropagation();
        dispatch(decrement({productId: product._id, amount}));
    };
    return <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
        <Card onClick={open}
              hoverable
              className="product-card"
              cover={
                  <div style={{width: '100%', aspectRatio: '4 / 3', overflow: 'hidden'}}>
                      <img
                          alt={product.name}
                          src={getProductImage(product.image, product.category)}
                          style={{width: '100%', height: '100%', objectFit: 'cover'}}
                      />
                  </div>
              }
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
                        {productPromotion && (
                            <div style={{color: '#5ea18b', fontSize: 12, fontWeight: 600}}>
                                {describeCatalogOffer(productPromotion)}
                            </div>
                        )}
                        {bulkPromotion && (
                            <div style={{color: '#5ea18b', fontSize: 12, fontWeight: 600}}>
                                {describeCatalogOffer(bulkPromotion)}
                            </div>
                        )}
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
            <div className="product-card-actions">
                <div className="product-card-qty">
                    <Button
                        size="small"
                        icon={<MinusOutlined/>}
                        onClick={handleDecrement}
                        disabled={quantity === 0}
                    />
                    <span className="product-card-qty-value">{quantity}</span>
                    <Button
                        size="small"
                        type="primary"
                        icon={<PlusOutlined/>}
                        onClick={(e) => handleIncrement(e)}
                    />
                </div>
                {unitsPerBulk ? (
                    <div className="product-card-cajas">
                        <Button
                            size="small"
                            onClick={(e) => handleDecrement(e, unitsPerBulk)}
                            disabled={quantity === 0}
                        >
                            -Cajas
                        </Button>
                        <Button
                            size="small"
                            onClick={(e) => handleIncrement(e, unitsPerBulk)}
                        >
                            +Cajas
                        </Button>
                    </div>
                ) : null}
            </div>
        </Card>
        <ProductCardModal
            isOpen={isOpen}
            close={close}
            product={product}
            bulkPromotion={bulkPromotion}
            productPromotion={productPromotion}
        />
    </Col>
}

export default ProductCard