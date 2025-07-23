import { Modal } from "antd";
import {Product} from "../../../generated/graphql.ts";
import NO_IMAGE from "../../../../assets/place_holder.png";

type ProductCardModalProps = {
    isOpen: boolean;
    close: () => void;
    product: Product;
}
const ProductCardModal = (props:ProductCardModalProps)=> {
    const {isOpen, close, product} = props;
    return  <Modal open={isOpen} closeIcon={true} onCancel={close} footer={null}>
        <div>
        <img style={{width:'400px'}} alt={product.name} src={product.image || NO_IMAGE}/>

        </div>
    </Modal>
}

export default ProductCardModal;