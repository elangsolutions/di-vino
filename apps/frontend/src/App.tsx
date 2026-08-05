import './App.css';
import LandingPage from "./pages/LandingPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import {Layout} from "antd";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import {AuthProvider} from "./context/AuthContext";
import {PrivateRoute} from "./components/routes/PrivateRoute";
import InstanceFormPage from "./pages/AdminPage/AddInstance";
import ProductForm from "./pages/AdminPage/Products/ProductForm";
import {Provider} from 'react-redux';
import {store} from './store/store';
import ProductListPage from "./pages/AdminPage/Products/ProductList";
import CategoryListPage from "./pages/AdminPage/Categories/CategoryList";
import CategoryForm from "./pages/AdminPage/Categories/CategoryForm";
import ItemPriceListPage from "./pages/AdminPage/ItemPrices/ItemPriceList";
import ItemPriceForm from "./pages/AdminPage/ItemPrices/ItemPriceForm";
import PromotionCodeListPage from "./pages/AdminPage/PromotionCodes/PromotionCodeList";
import PromotionCodeForm from "./pages/AdminPage/PromotionCodes/PromotionCodeForm";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";


const App = () => {

    return (
        <Provider store={store}>
            <AuthProvider>
                <Router>
                    <Layout>
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

                                <Route path="categories" element={<CategoryListPage/>}/>
                                <Route
                                    path="/admin/categories/:id"
                                    element={
                                        <PrivateRoute>
                                            <InstanceFormPage
                                                entityName="categoría"
                                                renderForm={(id) => <CategoryForm categoryId={id}/>}
                                            />
                                        </PrivateRoute>
                                    }
                                />

                                <Route path="item-prices" element={<ItemPriceListPage/>}/>
                                <Route
                                    path="/admin/item-prices/:id"
                                    element={
                                        <PrivateRoute>
                                            <InstanceFormPage
                                                entityName="precio"
                                                renderForm={(id) => <ItemPriceForm itemPriceId={id}/>}
                                            />
                                        </PrivateRoute>
                                    }
                                />

                                <Route path="promotion-codes" element={<PromotionCodeListPage/>}/>
                                <Route
                                    path="/admin/promotion-codes/:id"
                                    element={
                                        <PrivateRoute>
                                            <InstanceFormPage
                                                entityName="código promocional"
                                                renderForm={(id) => <PromotionCodeForm promotionCodeId={id}/>}
                                            />
                                        </PrivateRoute>
                                    }
                                />
                            </Route>
                            <Route path='cart' element={<CartPage />}/>
                            <Route path='orders' element={<OrdersPage />}/>
                        </Routes>
                    </Layout>
                </Router>
            </AuthProvider>
        </Provider>
    );
};

export default App;
