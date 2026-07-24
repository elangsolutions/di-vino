import { Button, Modal, Space, Typography } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Product } from "../../../../generated/graphql.ts";
import NO_IMAGE from "../../../../assets/place_holder.png";
import { RootState } from "../../../../store/store";
import { decrement, increment } from "../../../../store/cart/slice.ts";
import { priceFormat } from "../../../../utils";
import "./styles.css";

const { Title, Text } = Typography;

type ProductCardModalProps = {
    isOpen: boolean;
    close: () => void;
    product: Product;
};

const ProductCardModal = ({ isOpen, close, product }: ProductCardModalProps) => {
    const dispatch = useDispatch();
    const quantity = useSelector((state: RootState) => state.cart.quantities[product._id] || 0);

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
                    src={product.image || NO_IMAGE}
                />
                <Title level={4} style={{ margin: '4px 0 0' }}>
                    {product.name}
                </Title>
                <Text strong style={{ fontSize: 18, color: '#5ea18b' }}>
                    ${priceFormat(product.price)}.-
                </Text>
                {product.details && (
                    <p className="product-modal-details">{product.details}</p>
                )}
                <Space style={{ marginTop: 16 }}>
                    <Button
                        size="large"
                        icon={<MinusOutlined />}
                        onClick={() => dispatch(decrement({ productId: product._id }))}
                        disabled={quantity === 0}
                    />
                    <Text strong style={{ fontSize: 16, minWidth: 24, display: 'inline-block' }}>
                        {quantity}
                    </Text>
                    <Button
                        size="large"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => dispatch(increment({ productId: product._id }))}
                    />
                </Space>
            </div>
        </Modal>
    );
};

export default ProductCardModal;
