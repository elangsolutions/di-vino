// pages/ProductListPage.tsx
import { useQuery, useMutation } from "@apollo/client";
import { Card, List, Typography, Button, Spin, Space, Modal, message } from "antd";
import { Link } from "react-router-dom";
import { GET_PRODUCTS, DELETE_PRODUCT } from "../../../../components/Product/queries";
import { Product } from "../types";
import { priceFormat } from "../../../../utils";

const { confirm } = Modal;

const ProductListPage = () => {
    const { data, loading, error, refetch } = useQuery(GET_PRODUCTS);
    const [deleteProduct] = useMutation(DELETE_PRODUCT);

    if (loading) return <Spin style={{ display: "block", margin: "2rem auto" }} />;
    if (error) return <p>Error al cargar productos: {error.message}</p>;

    const products: Product[] = data?.products || [];

    const handleDelete = (product: Product) => {
        confirm({
            title: "¿Estás seguro de eliminar este producto?",
            content: `Producto: ${product.name}`,
            okText: "Eliminar",
            okType: "danger",
            cancelText: "Cancelar",
            async onOk() {
                try {
                    await deleteProduct({
                        variables: { id: product._id },
                    });
                    message.success("Producto eliminado correctamente");
                    refetch(); // refresh the product list
                } catch (err: any) {
                    message.error(`Error al eliminar: ${err.message}`);
                }
            },
        });
    };

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
                            extra={
                                <Space>
                                    <Link to={`/admin/products/${product._id}`}>Editar</Link>
                                    <a
                                        onClick={() => handleDelete(product)}
                                        style={{ color: "red", cursor: "pointer" }}
                                    >
                                        Eliminar
                                    </a>
                                </Space>
                            }
                        >
                            <div>
                                <p>Precio: ${priceFormat(product.price)}</p>
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
