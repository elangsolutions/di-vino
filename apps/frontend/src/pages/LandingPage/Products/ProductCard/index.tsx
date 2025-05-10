import {Card, Col} from "antd";
import {JSX} from "react";
import {useDisclosure} from "../../../../components/hooks/useDisclosure.tsx";
import ProductCardModal from "../ProductCardModal";
import {Product} from "../../../../generated/graphql.ts";
import NO_IMAGE from "../../../../assets/place_holder.png";

type ProductCardProps = {
    product: Product
}

const ProductCard: (props: ProductCardProps) => JSX.Element = (props: ProductCardProps) => {

    const {product} = props;
    const {isOpen, close, open} = useDisclosure()
    return <Col xs={12} sm={8} md={6} key={product._id}>
        <Card onClick={open}
              hoverable
              cover={<img alt={product.name} src={product.image||NO_IMAGE}/>}
        >
            <Card.Meta title={product.name} description={product.price}/>
        </Card>
        <ProductCardModal isOpen={isOpen} close={close} product={product}/>
    </Col>
}

export default ProductCard