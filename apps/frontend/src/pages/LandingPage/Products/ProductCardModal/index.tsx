import {Card, Modal} from "antd";
import {Product} from "../../../generated/graphql.ts";

type ProductCardModalProps = {
    isOpen: boolean;
    close: () => void;
    product: Product;
}
const ProductCardModal = (props:ProductCardModalProps)=> {
    const {isOpen, close, product} = props;
    return  <Modal open={isOpen} onCancel={close} onOk={close} closeIcon={false}>
            <Card style={{ width: '100%' }}
                cover={<img alt={product.name} src={product.image} />}
            >
            </Card>
    </Modal>
}

export default ProductCardModal;