import './App.css';
import LandingPage from "./pages/LandingPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import {
    ConfigProvider,
    Layout,
    Row,
    theme as antdTheme,
    Typography,
} from "antd";
import { FC, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute } from "./components/routes/PrivateRoute";
import InstanceFormPage from "./pages/AdminPage/AddInstance";
import ProductForm from "./pages/AdminPage/Products/ProductForm";
import { Provider } from 'react-redux';
import { store } from './store/store';
const { Title } = Typography;
const { Header } = Layout;

const App: FC = () => {
    const [isDarkMode] = useState<boolean>(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);

    return (
        <Provider store={store}>
        <ConfigProvider
            theme={{
                algorithm: isDarkMode
                    ? antdTheme.darkAlgorithm
                    : antdTheme.defaultAlgorithm,
            }}
        >
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
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route
                                path="/admin"
                                element={
                                    <PrivateRoute>
                                        <AdminPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/admin/add"
                                element={
                                    <PrivateRoute>
                                        <InstanceFormPage
                                            entityName="producto"
                                            renderForm={() => <ProductForm />}
                                        />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/admin/edit/:id"
                                element={
                                    <PrivateRoute>
                                        <InstanceFormPage
                                            entityName="producto"
                                            renderForm={(id) => <ProductForm productId={id} />}
                                        />
                                    </PrivateRoute>
                                }
                            />

                        </Routes>
                    </Layout>
                </Router>
            </AuthProvider>
        </ConfigProvider>
        </Provider>
    );
};

export default App;
