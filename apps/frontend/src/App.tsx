import './App.css';
import LandingPage from "./pages/LandingPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import {Layout, Row, Typography,} from "antd";
import {FC} from "react";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import {AuthProvider} from "./context/AuthContext";
import {PrivateRoute} from "./components/routes/PrivateRoute";
import InstanceFormPage from "./pages/AdminPage/AddInstance";
import ProductForm from "./pages/AdminPage/Products/ProductForm";
import {Provider} from 'react-redux';
import {store} from './store/store';
import ProductListPage from "./pages/AdminPage/Products/ProductList";
import CartPage from "./pages/CartPage";

const {Title} = Typography;
const {Header} = Layout;

const App: FC = () => {

    return (
        <Provider store={store}>
            <AuthProvider>
                <Router>
                    <Layout>
                        <Header
                            style={{
                                display: "flex",
                                justifyContent: "space-around",
                                alignContent: "center",
                                background: "inherit",
                            }}
                        >
                            <Row align={"middle"}>
                                <Title level={1}>Di Vino!</Title>
                            </Row>
                        </Header>
                        <Routes>
                            <Route path="/" element={<LandingPage/>}/>
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route
                                path="/admin"
                                element={
                                    <PrivateRoute>
                                        <AdminPage/>
                                    </PrivateRoute>
                                }
                            >
                                <Route index element={<Navigate to="products" replace/>}/>
                                <Route path="products" element={<ProductListPage/>}/>
                                <Route
                                    path="/admin/add"
                                    element={
                                        <PrivateRoute>
                                            <InstanceFormPage
                                                entityName="producto"
                                                renderForm={() => <ProductForm/>}
                                            />
                                        </PrivateRoute>
                                    }
                                />

                                <Route
                                    path="/admin/products/:id"
                                    element={
                                        <PrivateRoute>
                                            <InstanceFormPage
                                                entityName="producto"
                                                renderForm={(id) => <ProductForm productId={id}/>}
                                            />
                                        </PrivateRoute>
                                    }
                                />
                            </Route>
                            <Route path='cart' element={<CartPage />}/>
                        </Routes>
                    </Layout>
                </Router>
            </AuthProvider>
        </Provider>
    );
};

export default App;
