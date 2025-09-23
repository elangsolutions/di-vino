import { Modal } from "antd";
import { Product } from "../../../../generated/graphql.ts";
import NO_IMAGE from "../../../../assets/place_holder.png";

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
            closeIcon={false} // 👈 hide the X button
            centered // 👈 centers modal itself in the screen
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    minHeight: "300px", // gives vertical space for centering
                }}
            >
                <img
                    style={{ width: "400px", marginBottom: "16px" }}
                    alt={product.name}
                    src={product.image || NO_IMAGE}
                />
                {product.details && (
                    <p style={{ maxWidth: "400px" }}>{product.details}</p>
                )}
            </div>
        </Modal>
    );
};

export default ProductCardModal;
