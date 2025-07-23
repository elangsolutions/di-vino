import {FC, useEffect} from 'react';
import {Alert, Badge, Col, Layout, Row, Spin, Typography} from 'antd';
import './index.css';
import ProductCard from "./Products/ProductCard";
import {useGetProducts} from "../../components/Product/hooks/useGetProducts.ts";
import {Product} from "../../generated/graphql.ts";
import {ShoppingFilled, ShoppingOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import type {RootState} from '../../store/store';
import {cacheProducts} from "../../store/product/slice.ts";

const {Title, Paragraph} = Typography;
const {Content, Footer} = Layout;

const quantitySum = (quantities: Record<string, number>) =>
    Object.values(quantities).reduce((sum, q) => sum + q, 0);

const LandingPage: FC = () => {
    const {products, loading, error} = useGetProducts();
    const dispatch =useDispatch();
    const navigate = useNavigate();
    const cartQuantities = useSelector((state: RootState) => state.cart.quantities);
    const totalItems = quantitySum(cartQuantities);


    useEffect(() => {
        if (products) {
            dispatch(cacheProducts(products));
        }
    }, [products, dispatch]);
    const handleCartClick = () => {
        navigate('/cart');
    };

    if (loading) return <Spin tip="Cargando..."/>;
    if (error) return <Alert type="error" message="Error cargando productos" description={error.message}/>;


    return (
        <>
            <Content>
                <section>
                    <Row style={{width: 300, margin: '0 auto'}} justify="center" align="middle">
                        <Col>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12}}>
                                <Col>
                                    <Title level={3}>Descubrí una nueva forma de comprar</Title>
                                </Col>
                                <Col>
                                    <Badge count={totalItems} size="small" offset={[2, -2]}>
                                        {totalItems > 0 ? (
                                            <ShoppingFilled
                                                style={{fontSize: 28, cursor: 'pointer'}}
                                                onClick={handleCartClick}
                                            />
                                        ) : (
                                            <ShoppingOutlined
                                                style={{fontSize: 28, cursor: 'pointer'}}
                                                onClick={handleCartClick}
                                            />
                                        )}
                                    </Badge>
                                </Col>
                            </div>
                        </Col>
                    </Row>
                </section>
                <section>
                    <Row gutter={[16, 16]} style={{margin: '16px 0'}}>
                        {products.map((product: Product) => (
                            <ProductCard key={product._id} product={product}/>
                        ))}
                    </Row>
                </section>
            </Content>

            <Footer>© {new Date().getFullYear()} Di-Vino</Footer>
        </>
);

};

export default LandingPage;
