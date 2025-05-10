import {FC} from 'react';
import {Alert, Layout, Row, Spin, Typography} from 'antd';
import './index.css';
import ProductCard from "./Products/ProductCard";
import {useGetProducts} from "../../components/Product/hooks/useGetProducts.ts";
import {Product} from "../../generated/graphql.ts";

const { Title, Paragraph } = Typography;
const { Content, Footer } = Layout;


const LandingPage: FC = () => {
    const { products, loading, error } = useGetProducts();

    if (loading) return <Spin tip="Cargando..." />;
    if (error) return <Alert type="error" message="Error cargando productos" description={error.message} />;

    return (
        <Layout>
            <Content>
                <section>
                    <Title level={3}>Nuestros productos</Title>
                    <Paragraph>Descubrí una nueva forma de comprar</Paragraph>
                </section>
                <section>
                    <Title level={4}>Lo que mas Sale!</Title>
                    <Row gutter={[16, 16]} style={{ margin: '16px 0' }}>
                        {products.map((product:Product) => (
                          <ProductCard product={product} />
                        ))}
                    </Row>
                </section>
            </Content>
            <Footer>
                © {new Date().getFullYear()} Di-Vino
            </Footer>
        </Layout>
    );
};

export default LandingPage;
