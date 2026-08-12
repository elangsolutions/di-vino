import {FC, useEffect, useState, useMemo} from 'react';
import {Alert, Badge, Layout, Row, Spin, Typography, Slider, Button, Space, Tabs, Input} from 'antd';
import {SearchOutlined, ShoppingCartOutlined, UnorderedListOutlined} from '@ant-design/icons';
import './index.css';
import ProductCard from "./Products/ProductCard";
import {useGetAvailableProducts} from "../../components/Product/hooks/useGetAvailableProducts.ts";
import {Product} from "../../generated/graphql.ts";
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {cacheProducts} from "../../store/product/slice.ts";
import {getCartUnitsCount} from "../../store/cart/slice.ts";
import {selectOngoingOrders} from "../../store/orders/slice.ts";
import OngoingOrdersBanner from "../../components/OngoingOrdersBanner";

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
    const ongoingOrders = useSelector(selectOngoingOrders);

    const [category, setCategory] = useState<string>('all');
    const [search, setSearch] = useState('');
    // null = no price filter applied yet; the slider still shows the full computed range.
    const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
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

    const categories = useMemo(
        () => Array.from(new Set(products.map((p: Product) => p.category))).sort(),
        [products],
    );

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

    const normalizedSearch = search.trim().toLowerCase();

    const filteredProducts = useMemo(() => {
        return products.filter((p: Product) => {
            const itemPrice = p.activeItemPrice?.price;
            if (itemPrice == null) return false;

            if (category !== 'all' && p.category !== category) {
                return false;
            }

            if (itemPrice < activePriceRange[0] || itemPrice > activePriceRange[1]) {
                return false;
            }

            if (normalizedSearch) {
                const haystack = `${p.name} ${p.details ?? ''} ${p.category}`.toLowerCase();
                if (!haystack.includes(normalizedSearch)) {
                    return false;
                }
            }

            return true;
        });
    }, [products, category, activePriceRange, normalizedSearch]);

    const categoryTabs = useMemo(
        () => [
            {key: 'all', label: 'Todos'},
            ...categories.map((cat) => ({key: cat, label: cat})),
        ],
        [categories],
    );

    if (loading) {
        return (
            <Spin
                tip="Cargando..."
                style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}
            />
        );
    }
    if (error) {
        return <Alert type="error" message="Error cargando productos" description={error.message} />;
    }

    const priceStep = Math.max(1, Math.round((priceBounds[1] - priceBounds[0]) / 20));

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

                <Space size={isMobile ? 8 : 16}>
                    <Badge count={ongoingOrders.length} style={{backgroundColor: '#5ea18b'}}>
                        <Button
                            type="text"
                            icon={<UnorderedListOutlined style={{fontSize: isMobile ? 20 : 22, color: '#5ea18b'}} />}
                            onClick={() => navigate('/orders')}
                            style={{padding: 0}}
                            aria-label="Mis pedidos"
                        />
                    </Badge>
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
                            icon={<ShoppingCartOutlined style={{fontSize: isMobile ? 20 : 24, color: '#5ea18b'}} />}
                            onClick={handleCartClick}
                            style={{padding: 0}}
                            aria-label="Carrito"
                        />
                    </Badge>
                </Space>
            </Layout.Header>

            <Content style={{padding: isMobile ? '12px' : '24px'}}>
                <OngoingOrdersBanner />

                <section style={{textAlign: 'center', marginBottom: isMobile ? 20 : 28}}>
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

                <section className="catalog-filters">
                    <Tabs
                        activeKey={category}
                        onChange={setCategory}
                        items={categoryTabs}
                        className="category-tabs"
                        moreIcon={null}
                    />

                    <div className="price-filter">
                        <Input
                            allowClear
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar producto..."
                            prefix={<SearchOutlined style={{color: '#5ea18b'}} />}
                            className="catalog-search"
                            aria-label="Buscar producto"
                        />
                        <div className="price-filter-header">
                            <Text type="secondary" style={{fontSize: 13}}>
                                Precio:{' '}
                                <Text style={{color: '#3d3d3d'}}>
                                    {currencyFormatter(activePriceRange[0])} – {currencyFormatter(activePriceRange[1])}
                                </Text>
                            </Text>
                            {isPriceFiltered && (
                                <Button
                                    type="link"
                                    size="small"
                                    onClick={() => setPriceRange(null)}
                                    style={{padding: 0, height: 'auto', color: '#5ea18b'}}
                                >
                                    Restablecer
                                </Button>
                            )}
                        </div>
                        <Slider
                            range
                            min={priceBounds[0]}
                            max={priceBounds[1]}
                            step={priceStep}
                            value={activePriceRange}
                            onChange={(v) => setPriceRange(v as [number, number])}
                            tooltip={{formatter: currencyFormatter}}
                        />
                    </div>
                </section>

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

            <Footer style={{textAlign: 'center', paddingTop: 32}}>
                © {new Date().getFullYear()} Di Vino - Todos los derechos reservados
            </Footer>
        </>
    );
};

export default LandingPage;
