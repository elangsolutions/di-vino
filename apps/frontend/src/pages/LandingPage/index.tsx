import {FC, useEffect, useState, useMemo} from 'react';
import {Alert, Badge, Col, Layout, Row, Spin, Typography, Select, Slider, Button, Drawer, Space, Divider, Tag} from 'antd';
import {FilterOutlined, ShoppingCartOutlined, CloseOutlined} from '@ant-design/icons';
import './index.css';
import ProductCard from "./Products/ProductCard";
import {useGetAvailableProducts} from "../../components/Product/hooks/useGetAvailableProducts.ts";
import {Product} from "../../generated/graphql.ts";
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {cacheProducts} from "../../store/product/slice.ts";
import {getCartUnitsCount} from "../../store/cart/slice.ts";

const {Title, Text} = Typography;
const {Content, Footer} = Layout;

const currencyFormatter = (val?: number) => {
    if (val == null) return "";
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(val);
};

const LandingPage: FC = () => {
    const {products, loading, error} = useGetAvailableProducts();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const totalItems = useSelector(getCartUnitsCount);

    // --- filter states ---
    const [category, setCategory] = useState<string | null>(null);
    // null = no price filter applied yet; the slider still shows the full computed range.
    const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        if (products) {
            dispatch(cacheProducts(products as any));
        }
    }, [products, dispatch]);

    useEffect(() => {
        let resizeTimeout: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                setIsMobile(window.innerWidth < 768);
            }, 150);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            clearTimeout(resizeTimeout);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleCartClick = () => {
        navigate('/cart');
    };

    const priceBounds = useMemo<[number, number]>(() => {
        if (!products.length) return [0, 100000];
        const prices = products
            .map((p: Product) => p.activeItemPrice?.price)
            .filter((price): price is number => price != null);
        if (!prices.length) return [0, 100000];
        return [Math.min(...prices), Math.max(...prices)];
    }, [products]);

    const activePriceRange = priceRange ?? priceBounds;
    const isPriceFiltered = priceRange != null
        && (priceRange[0] > priceBounds[0] || priceRange[1] < priceBounds[1]);
    const activeFilterCount = (category ? 1 : 0) + (isPriceFiltered ? 1 : 0);

    const clearFilters = () => {
        setCategory(null);
        setPriceRange(null);
    };

    const filteredProducts = useMemo(() => {
        return products.filter((p: Product) => {
            const itemPrice = p.activeItemPrice?.price;
            if (itemPrice == null) return false;

            if (category && p.category !== category) {
                return false;
            }

            if (itemPrice < activePriceRange[0] || itemPrice > activePriceRange[1]) {
                return false;
            }

            return true;
        });
    }, [products, category, activePriceRange]);

    if (loading) return <Spin tip="Cargando..." style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}} />;
    if (error) return <Alert type="error" message="Error cargando productos" description={error.message} />;

    const categories = Array.from(new Set(products.map((p: Product) => p.category)));

    const FilterContent = () => (
        <Space direction="vertical" style={{width: '100%'}} size="large">
            <div>
                <Text strong style={{fontSize: 14}}>Categoría</Text>
                <Select
                    placeholder="Selecciona categoría"
                    size="large"
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
                        {currencyFormatter(activePriceRange[0])} - {currencyFormatter(activePriceRange[1])}
                    </Text>
                </div>
                <div style={{padding: '0 6px', marginTop: 12}}>
                    <Slider
                        range
                        min={priceBounds[0]}
                        max={priceBounds[1]}
                        step={Math.max(1, Math.round((priceBounds[1] - priceBounds[0]) / 20))}
                        value={activePriceRange}
                        onChange={(v) => setPriceRange(v as [number, number])}
                        tooltip={{formatter: currencyFormatter}}
                    />
                </div>
            </div>

            {activeFilterCount > 0 && (
                <Button block onClick={clearFilters}>
                    Limpiar filtros
                </Button>
            )}

            {showMobileFilters && (
                <Button 
                    type="primary" 
                    block 
                    size="large"
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
                    Di Vino
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

            <Content style={{padding: isMobile ? '12px' : '24px'}}>
                <section style={{textAlign: 'center', marginBottom: 32}}>
                    <Title level={2} style={{
                        fontSize: isMobile ? 24 : 32,
                        marginBottom: 8
                    }}>
                        Una nueva forma de disfrutar
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
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 16
                            }}>
                                <Text strong>Filtrar por:</Text>
                                {activeFilterCount > 0 && (
                                    <Button type="text" onClick={clearFilters}>
                                        Limpiar filtros
                                    </Button>
                                )}
                            </div>
                            <Row gutter={[32, 16]} align="top">
                                <Col xs={24} md={8} lg={6}>
                                    <Text type="secondary" style={{fontSize: 12}}>Categoría</Text>
                                    <Select
                                        placeholder="Todas"
                                        style={{ width: '100%', marginTop: 4, minWidth: 160 }}
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
                                <Col xs={24} md={16} lg={18}>
                                    <Text type="secondary" style={{fontSize: 12}}>
                                        Rango de Precio: {currencyFormatter(activePriceRange[0])} - {currencyFormatter(activePriceRange[1])}
                                    </Text>
                                    <Slider
                                        range
                                        min={priceBounds[0]}
                                        max={priceBounds[1]}
                                        step={Math.max(1, Math.round((priceBounds[1] - priceBounds[0]) / 20))}
                                        value={activePriceRange}
                                        onChange={(v) => setPriceRange(v as [number, number])}
                                        tooltip={{formatter: currencyFormatter}}
                                        marks={{
                                            [priceBounds[0]]: currencyFormatter(priceBounds[0]),
                                            [priceBounds[1]]: currencyFormatter(priceBounds[1]),
                                        }}
                                        style={{marginTop: 12}}
                                    />
                                </Col>
                            </Row>
                        </div>
                    ) : (
                        // MOBILE FILTERS BUTTON + ACTIVE FILTER SUMMARY
                        <>
                            <Badge count={activeFilterCount} size="small" offset={[-8, 8]}>
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
                            </Badge>

                            {activeFilterCount > 0 && (
                                <Space size={[8, 8]} wrap style={{marginTop: 12}}>
                                    {category && (
                                        <Tag
                                            closable
                                            closeIcon={<CloseOutlined style={{fontSize: 10}} />}
                                            onClose={() => setCategory(null)}
                                            color="#5ea18b"
                                        >
                                            {category}
                                        </Tag>
                                    )}
                                    {isPriceFiltered && (
                                        <Tag
                                            closable
                                            closeIcon={<CloseOutlined style={{fontSize: 10}} />}
                                            onClose={() => setPriceRange(null)}
                                            color="#5ea18b"
                                        >
                                            {currencyFormatter(activePriceRange[0])} - {currencyFormatter(activePriceRange[1])}
                                        </Tag>
                                    )}
                                </Space>
                            )}
                        </>
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
                © {new Date().getFullYear()} Di Vino - Todos los derechos reservados
            </Footer>
        </>
    );
};

export default LandingPage;

