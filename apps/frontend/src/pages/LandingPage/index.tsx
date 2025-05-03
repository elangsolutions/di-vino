import {FC} from 'react';
import { Typography, Row, Col, Card, Button, Layout } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import './index.css';

const { Title, Paragraph } = Typography;
const { Content, Footer } = Layout;

const products = [
    { id: 1, title: 'Wireless Headphones', price: '$99.99', image: 'https://via.placeholder.com/150' },
    { id: 2, title: 'Smart Watch', price: '$149.99', image: 'https://via.placeholder.com/150' },
    { id: 3, title: 'Bluetooth Speaker', price: '$79.99', image: 'https://via.placeholder.com/150' },
    { id: 4, title: 'VR Headset', price: '$199.99', image: 'https://via.placeholder.com/150' },
    { id: 5, title: 'Wireless Headphones', price: '$99.99', image: 'https://via.placeholder.com/150' },
    { id: 6, title: 'Smart Watch', price: '$149.99', image: 'https://via.placeholder.com/150' },
    { id: 7, title: 'Bluetooth Speaker', price: '$79.99', image: 'https://via.placeholder.com/150' },
    { id: 8, title: 'VR Headset', price: '$199.99', image: 'https://via.placeholder.com/150' },
];

const LandingPage: FC = () => {

    return (
        <Layout className="landing-layout">
            <Content style={{ padding: '16px'}}>
                <section className="hero-section">
                    <Title level={3}>Nuestros productos</Title>
                    <Paragraph>Descubrí una nueva forma de comprar</Paragraph>
                    <Button type="primary" icon={<ShoppingOutlined />}>Pedi ahora!</Button>
                </section>
                <section className="catalog-section" style={{ marginTop: '22px' }}>
                    <Title level={4}>Lo que mas Sale!</Title>
                    <Row gutter={[16, 16]}>
                        {products.map(product => (
                            <Col xs={12} sm={8} md={6} key={product.id}>
                                <Card
                                    hoverable
                                    cover={<img alt={product.title} src={product.image} />}
                                    bodyStyle={{ padding: '12px' }}
                                >
                                    <Card.Meta title={product.title} description={product.price} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>
            </Content>

            <Footer style={{ textAlign: 'center', padding: '12px 0' }}>
                © {new Date().getFullYear()} Di-Vino
            </Footer>
        </Layout>
    );
};

export default LandingPage;
