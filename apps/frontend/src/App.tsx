import './App.css';
import LandingPage from "./pages/LandingPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import {
    ConfigProvider,
    App as AntdApp,
    Layout,
    Row,
    theme as antdTheme,
    Typography,
} from "antd";
import {FC, useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {AuthProvider} from "./context/AuthContext";
import {PrivateRoute} from "./components/routes/PrivateRoute";
import InstanceFormPage from "./pages/AdminPage/AddInstance";
import ProductForm from "./pages/AdminPage/Products/ProductForm";
import {Provider} from 'react-redux';
import {store} from './store/store';
import ProductListPage from "./pages/AdminPage/Products/ProductList";
import {NotificationProvider} from "./context/NotificationContext";

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
                                <Title level={3}>Di Vino</Title>
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
                        </Routes>
                    </Layout>
                </Router>
            </AuthProvider>
        </Provider>
    );
};

export default App;
