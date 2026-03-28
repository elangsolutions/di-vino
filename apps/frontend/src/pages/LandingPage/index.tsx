import {FC, useEffect, useState, useMemo} from 'react';
import {Alert, Badge, Col, Layout, Row, Spin, Typography, Select, Slider, Button, Drawer, Space, Divider} from 'antd';
import {FilterOutlined, ShoppingCartOutlined} from '@ant-design/icons';
import './index.css';
import ProductCard from "./Products/ProductCard";
import {useGetProducts} from "../../components/Product/hooks/useGetProducts.ts";
import {Product} from "../../generated/graphql.ts";
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import type {RootState} from '../../store/store';
import {cacheProducts} from "../../store/product/slice.ts";

const {Title, Text} = Typography;
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
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        if (products) {
            dispatch(cacheProducts(products as any));
        }
    }, [products, dispatch]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
    }, [products, category, priceRange]);

    if (loading) return <Spin tip="Cargando..." style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}} />;
    if (error) return <Alert type="error" message="Error cargando productos" description={error.message} />;

    const categories = Array.from(new Set(products.map((p: Product) => p.category)));

    const FilterContent = () => (
        <Space direction="vertical" style={{width: '100%'}} size="large">
            <div>
                <Text strong style={{fontSize: 14}}>Categoría</Text>
                <Select
                    placeholder="Selecciona categoría"
                    style={{ width: '100%', marginTop: 8 }}
                    value={category || 'Todas'}
                    onChange={(value) => setCategory(value === 'Todas' ? null : value)}
                >
                    <Select.Option value="Todas">Todas las categorías</Select.Option>
                    {categories.map((cat) => (
                        <Select.Option key={cat} value={cat}>
                            {cat}
                        </Select.Option>
                    ))}
                </Select>
            </div>

            <Divider style={{margin: '8px 0'}} />

            <div>
                <Text strong style={{fontSize: 14}}>Rango de Precio</Text>
                <div style={{marginTop: 12}}>
                    <Text type="secondary" style={{fontSize: 12}}>
                        {currencyFormatter(priceRange[0])} - {currencyFormatter(priceRange[1])}
                    </Text>
                </div>
                <Slider
                    range
                    min={0}
                    step={5000}
                    max={100000}
                    value={priceRange}
                    onChange={(v) => setPriceRange(v as [number, number])}
                    tooltip={{formatter: currencyFormatter}}
                    marks={{
                        0: '$0',
                        50000: '$50k',
                        100000: '$100k',
                    }}
                    style={{marginTop: 12}}
                />
            </div>

            {showMobileFilters && (
                <Button 
                    type="primary" 
                    block 
                    onClick={() => setShowMobileFilters(false)}
                >
                    Aplicar Filtros
                </Button>
            )}
        </Space>
    );

    return (
        <>
            <Layout.Header style={{
                backgroundColor: '#fff',
                borderBottom: '1px solid #f0f0f0',
                padding: isMobile ? '12px 16px' : '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
                <Title level={1} style={{margin: 0, fontSize: isMobile ? 18 : 34}}>
                    Di-Vino
                </Title>

                {!isMobile && (
                    <Badge 
                        count={totalItems} 
                        style={{
                            backgroundColor: '#5ea18b',
                            fontSize: 12,
                            height: 20,
                            width: 20,
                            lineHeight: '20px'
                        }}
                    >
                        <Button
                            type="text"
                            icon={<ShoppingCartOutlined style={{fontSize: 24, color: '#5ea18b'}} />}
                            onClick={handleCartClick}
                            style={{padding: 0}}
                        />
                    </Badge>
                )}
                {isMobile && (
                    <Space size={8}>
                        <Badge count={totalItems} style={{backgroundColor: '#5ea18b'}}>
                            <Button
                                type="text"
                                icon={<ShoppingCartOutlined style={{fontSize: 20, color: '#5ea18b'}} />}
                                onClick={handleCartClick}
                                style={{padding: 0}}
                            />
                        </Badge>
                    </Space>
                )}
            </Layout.Header>

            <Content style={{padding: isMobile ? '16px' : '24px'}}>
                <section style={{textAlign: 'center', marginBottom: 32}}>
                    <Title level={2} style={{
                        fontSize: isMobile ? 24 : 32,
                        marginBottom: 8
                    }}>
                        Una nueva forma de comprar
                    </Title>
                    <Text type="secondary">
                        Descubre nuestra selección premium de vinos
                    </Text>
                </section>

                {/* FILTERS SECTION */}
                <section style={{marginBottom: 32}}>
                    {!isMobile ? (
                        // DESKTOP FILTERS
                        <div style={{
                            backgroundColor: '#fafafa',
                            padding: 20,
                            borderRadius: 8,
                            border: '1px solid #f0f0f0'
                        }}>
                            <Row gutter={[16, 16]} align="middle">
                                <Col flex="auto">
                                    <Text strong>Filtrar por:</Text>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <div>
                                        <Text type="secondary" style={{fontSize: 12}}>Categoría</Text>
                                        <Select
                                            placeholder="Todas"
                                            style={{ width: '100%', marginTop: 4 }}
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
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} md={12}>
                                    <div>
                                        <Text type="secondary" style={{fontSize: 12}}>
                                            Rango de Precio: {currencyFormatter(priceRange[0])} - {currencyFormatter(priceRange[1])}
                                        </Text>
                                        <Slider
                                            range
                                            min={0}
                                            step={5000}
                                            max={100000}
                                            value={priceRange}
                                            onChange={(v) => setPriceRange(v as [number, number])}
                                            tooltip={{formatter: currencyFormatter}}
                                            marks={{
                                                0: '$0',
                                                100000: '$100k',
                                            }}
                                            style={{marginTop: 8}}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    ) : (
                        // MOBILE FILTERS BUTTON
                        <Button
                            icon={<FilterOutlined />}
                            block
                            size="large"
                            onClick={() => setShowMobileFilters(true)}
                            style={{
                                borderColor: '#5ea18b',
                                color: '#5ea18b',
                                height: 44,
                                fontSize: 14,
                                fontWeight: 500
                            }}
                        >
                            Filtros
                        </Button>
                    )}
                </section>

                {/* PRODUCTS GRID */}
                <section>
                    {filteredProducts.length > 0 ? (
                        <Row gutter={[16, 16]}>
                            {filteredProducts.map((product: Product) => (
                                <ProductCard key={product._id} product={product}/>
                            ))}
                        </Row>
                    ) : (
                        <Alert 
                            message="Sin productos" 
                            description="No hay productos que coincidan con los filtros seleccionados"
                            type="info"
                            showIcon
                        />
                    )}
                </section>
            </Content>

            {/* MOBILE FILTERS DRAWER */}
            <Drawer
                title="Filtros"
                placement="bottom"
                onClose={() => setShowMobileFilters(false)}
                open={showMobileFilters}
                height="auto"
                bodyStyle={{padding: 20}}
            >
                <FilterContent />
            </Drawer>

            <Footer style={{textAlign: 'center', paddingTop: 32}}>
                © {new Date().getFullYear()} Di-Vino - Todos los derechos reservados
            </Footer>
        </>
    );
};

export default LandingPage;

