import { Modal } from "antd";
import { Product } from "../../../../generated/graphql.ts";
import NO_IMAGE from "../../../../assets/place_holder.png";
import "./styles.css";

type ProductCardModalProps = {
    isOpen: boolean;
    close: () => void;
    product: Product;
};

const ProductCardModal = ({ isOpen, close, product }: ProductCardModalProps) => {
    return (
        <Modal
            open={isOpen}
            onCancel={close}
            footer={null}
            closeIcon={false}
            centered
            className="product-modal"
        >
            <div className="product-modal-container">
                <img
                    className="product-modal-image"
                    alt={product.name}
                    src={product.image || NO_IMAGE}
                />
                {product.details && (
                    <p className="product-modal-details">{product.details}</p>
                )}
            </div>
        </Modal>
    );
};

export default ProductCardModal;
