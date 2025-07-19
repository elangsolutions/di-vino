// pages/ProductListPage.tsx
import { useQuery } from "@apollo/client";
import { Card, List, Typography, Button, Spin } from "antd";
import { Link } from "react-router-dom";
import { GET_PRODUCTS } from "../../../../components/Product/queries";
import { Product } from "../types";

const ProductListPage = () => {
    const { data, loading, error } = useQuery(GET_PRODUCTS);

    if (loading) return <Spin style={{ display: "block", margin: "2rem auto" }} />;
    if (error) return <p>Error al cargar productos: {error.message}</p>;

    const products: Product[] = data?.products || [];

    return (
        <div style={{ padding: 24 }}>
            <Typography.Title level={2}>Productos</Typography.Title>

            <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={products}
                renderItem={(product) => (
                    <List.Item>
                        <Card
                            title={product.name}
                            extra={<Link to={`/admin/products/${product._id}`}>Editar</Link>}
                        >
                            <div>
                            <p>Precio: ${product.price}</p>
                            <p>{product.details}</p>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />

            <Button type="primary" style={{ marginTop: 16 }}>
                <Link to="/admin/products/new">Agregar Producto</Link>
            </Button>
        </div>
    );
};

export default ProductListPage;
