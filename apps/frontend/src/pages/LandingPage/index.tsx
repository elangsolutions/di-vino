import {FC, useEffect, useState, useMemo} from 'react';
import {Alert, Badge, Col, Layout, Row, Spin, Typography, Select, Slider, Radio} from 'antd';
import './index.css';
import ProductCard from "./Products/ProductCard";
import {useGetProducts} from "../../components/Product/hooks/useGetProducts.ts";
import {Product} from "../../generated/graphql.ts";
import {ShoppingFilled, ShoppingOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import type {RootState} from '../../store/store';
import {cacheProducts} from "../../store/product/slice.ts";

const {Title} = Typography;
const {Content, Footer} = Layout;

const quantitySum = (quantities: Record<string, number>) =>
    Object.values(quantities).reduce((sum, q) => sum + q, 0);



const currencyFormatter = (val?: number) => {
    if (val == null) return "";
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(val);
};
const LandingPage: FC = () => {
    const {products, loading, error} = useGetProducts();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartQuantities = useSelector((state: RootState) => state.cart.quantities);
    const totalItems = quantitySum(cartQuantities);

    // --- filter states ---
    const [category, setCategory] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
    const [availability, setAvailability] = useState<'all' | 'inStock'>('all');

    useEffect(() => {
        if (products) {
            dispatch(cacheProducts(products));
        }
    }, [products, dispatch]);

    const handleCartClick = () => {
        navigate('/cart');
    };

    const filteredProducts = useMemo(() => {
        return products.filter((p: Product) => {
            let pass = true;

            if (category && p.category !== category) {
                pass = false;
            }

            if (p.price < priceRange[0] || p.price > priceRange[1]) {
                pass = false;
            }

            return pass;
        });
    }, [products, category, priceRange, availability]);

    if (loading) return <Spin tip="Cargando..." />;
    if (error) return <Alert type="error" message="Error cargando productos" description={error.message} />;

    // extract unique categories dynamically
    const categories = Array.from(new Set(products.map((p: Product) => p.category)));

    return (
        <>
            <Content>
                <section>
                    <Row style={{width: 300, margin: '0 auto'}} justify="center" align="middle">
                        <Col>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12}}>
                                <Col>
                                    <Title level={2}>Una nueva forma de comprar!</Title>
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
                                            />
                                        )}
                                    </Badge>
                                </Col>
                            </div>
                        </Col>
                    </Row>
                </section>

                {/* --- FILTERS --- */}
                <section style={{margin: '24px 0'}}>
                    <Row gutter={16} justify="center">
                        <Col>
                            <Select
                                placeholder="Categoría"
                                style={{ width: 200 }}
                                value={category || 'Todas'}
                                onChange={(value) => setCategory(value === 'Todas' ? null : value)}
                            >
                                <Select.Option value="Todas">Todas</Select.Option>
                                {categories.map((cat) => (
                                    <Select.Option key={cat} value={cat}>
                                        {cat}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col>
                            <Slider
                                range
                                min={0}
                                step={5000}
                                max={100000}
                                value={priceRange}
                                onChange={(v) => setPriceRange(v as [number, number])}
                                tooltip={{
                                    formatter: currencyFormatter,
                                }}
                                marks={{
                                    0: currencyFormatter(0),
                                    50000: currencyFormatter(50000),
                                    100000: currencyFormatter(100000),
                                }}
                                style={{width:'300px'}}
                            />
                        </Col>
                    </Row>
                </section>

                {/* --- PRODUCTS --- */}
                <section>
                    <Row gutter={[16, 16]} style={{margin: '16px 0'}}>
                        {filteredProducts.map((product: Product) => (
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
