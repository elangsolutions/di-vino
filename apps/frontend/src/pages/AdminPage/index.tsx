// pages/AdminPage.tsx
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../../components/Product/queries";
import { Button, Layout, Menu, List, Typography, Card, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import {Product} from "../../generated/graphql.ts";

const { Sider, Content } = Layout;
const { Title } = Typography;

const AdminPage = () => {
    const navigate = useNavigate();

    const { data, loading, error } = useQuery(GET_PRODUCTS);

    if (loading) return <Spin style={{ margin: 100 }} />;
    if (error) return <p>Error loading products: {error.message}</p>;

    const products = data?.products ?? [];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider breakpoint="lg" collapsedWidth="0">
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['productos']}>
                    <Menu.Item key="productos">Productos</Menu.Item>
                </Menu>
            </Sider>

            <Layout>
                <Content style={{ margin: '24px 16px' }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                        <Title level={3}>Productos</Title>
                        <Button type="primary" onClick={() => navigate("/admin/add")}>
                            Agregar
                        </Button>
                    </div>

                    <List
                        grid={{ gutter: 16, column: 1 }}
                        dataSource={products}
                        renderItem={(item:Product) => (
                            <List.Item>
                                <Card
                                    title={item.name}
                                    extra={
                                        <Button
                                            size="small"
                                            onClick={() => navigate(`/admin/edit/${item.id}`)}
                                        >
                                            Editar
                                        </Button>
                                    }
                                >
                                    Categoría: {item.category} <br />
                                    Precio: ${item.price}
                                </Card>
                            </List.Item>
                        )}
                    />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminPage;
