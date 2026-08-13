import { Button, Modal, Typography } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Product } from "../../../../generated/graphql.ts";
import { RootState } from "../../../../store/store";
import { decrement, increment } from "../../../../store/cart/slice.ts";
import { getProductImage, priceFormat } from "../../../../utils";
import { describeCatalogOffer, Promotion } from "../../../../components/Promotion/utils";
import "../ProductCard/styles.css";
import "./styles.css";

const { Title, Text } = Typography;

type ProductCardModalProps = {
    isOpen: boolean;
    close: () => void;
    product: Product;
    bulkPromotion?: Promotion;
    productPromotion?: Promotion;
};

const ProductCardModal = ({ isOpen, close, product, bulkPromotion, productPromotion }: ProductCardModalProps) => {
    const dispatch = useDispatch();
    const quantity = useSelector((state: RootState) => state.cart.quantities[product._id] || 0);
    const unitsPerBulk = product.unitsPerBulk && product.unitsPerBulk >= 2
        ? product.unitsPerBulk
        : undefined;

    return (
        <Modal
            open={isOpen}
            onCancel={close}
            footer={null}
            centered
            className="product-modal"
        >
            <div className="product-modal-container">
                <img
                    className="product-modal-image"
                    alt={product.name}
                    src={getProductImage(product.image, product.category)}
                />
                <Title level={4} style={{ margin: '4px 0 0' }}>
                    {product.name}
                </Title>
                {product.activeItemPrice && (
                    <Text strong style={{ fontSize: 18, color: '#5ea18b' }}>
                        ${priceFormat(product.activeItemPrice.price)}.-
                    </Text>
                )}
                {productPromotion && (
                    <Text style={{ display: 'block', color: '#5ea18b' }}>
                        {describeCatalogOffer(productPromotion)}
                    </Text>
                )}
                {bulkPromotion && (
                    <Text style={{ display: 'block', color: '#5ea18b' }}>
                        {describeCatalogOffer(bulkPromotion)}
                    </Text>
                )}
                {product.details && (
                    <p className="product-modal-details">{product.details}</p>
                )}
                <div className="product-card-actions">
                    <div className="product-card-qty">
                        <Button
                            size="small"
                            icon={<MinusOutlined />}
                            onClick={() => dispatch(decrement({ productId: product._id }))}
                            disabled={quantity === 0}
                        />
                        <span className="product-card-qty-value">{quantity}</span>
                        <Button
                            size="small"
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => dispatch(increment({ productId: product._id }))}
                        />
                    </div>
                    {unitsPerBulk ? (
                        <div className="product-card-cajas">
                            <Button
                                size="small"
                                onClick={() => dispatch(decrement({ productId: product._id, amount: unitsPerBulk }))}
                                disabled={quantity === 0}
                            >
                                -Cajas
                            </Button>
                            <Button
                                size="small"
                                onClick={() => dispatch(increment({ productId: product._id, amount: unitsPerBulk }))}
                            >
                                +Cajas
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>
        </Modal>
    );
};

export default ProductCardModal;
