import { Layout, Menu } from "antd";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const { Sider, Content } = Layout;

const AdminPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider breakpoint="lg" collapsedWidth="0">
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname.split("/")[2] || "products"]}
                    onClick={({ key }) => navigate(`/admin/${key}`)}
                >
                    <Menu.Item key="products">Productos</Menu.Item>
                    <Menu.Item key="categories">Categorías</Menu.Item>
                </Menu>
            </Sider>

            <Layout>
                <Content style={{ margin: '24px 16px' }}>
                    <Outlet /> {/* Here nested routes render */}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminPage;
