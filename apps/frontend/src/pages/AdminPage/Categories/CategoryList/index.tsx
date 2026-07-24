// pages/CategoryListPage.tsx
import { useQuery, useMutation } from "@apollo/client";
import {Card, List, Typography, Button, Spin, Space, Modal, message, Grid} from "antd";
import { Link } from "react-router-dom";
import { GET_CATEGORIES, DELETE_CATEGORY } from "../../../../components/Category/queries";
import { Category } from "../types";

const { confirm } = Modal;

const CategoryListPage = () => {

    const { data, loading, error, refetch } = useQuery(GET_CATEGORIES);
    const [deleteCategory] = useMutation(DELETE_CATEGORY);
    const { useBreakpoint } = Grid;

    const screens = useBreakpoint();

    const isMobile = !screens.md;

    if (loading) return <Spin style={{ display: "block", margin: "2rem auto" }} />;
    if (error) return <p>Error al cargar categorías: {error.message}</p>;

    const categories: Category[] = data?.categories || [];

    const handleDelete = (category: Category) => {
        confirm({
            title: "¿Estás seguro de eliminar esta categoría?",
            content: `Categoría: ${category.name}`,
            okText: "Eliminar",
            okType: "danger",
            cancelText: "Cancelar",
            async onOk() {
                try {
                    await deleteCategory({
                        variables: { input: { _id: category._id } },
                    });
                    message.success("Categoría eliminada correctamente");
                    refetch(); // refresh the category list
                } catch (err) {
                    message.error(`Error al eliminar: ${err instanceof Error ? err.message : "desconocido"}`);
                }
            },
        });
    };

    return (
        <div style={{ padding: isMobile ? 2 : 24 }}>
            <Typography.Title level={2}>Categorías</Typography.Title>

            <List
                grid={{ gutter: 16, column: isMobile ? 1 : 2 }}
                dataSource={categories}
                renderItem={(category) => (
                    <List.Item>
                        <Card
                            title={category.name}
                            extra={
                                <Space>
                                    <Link to={`/admin/categories/${category._id}`}>Editar</Link>
                                    <a
                                        onClick={() => handleDelete(category)}
                                        style={{ color: "red", cursor: "pointer" }}
                                    >
                                        Eliminar
                                    </a>
                                </Space>
                            }
                        >
                            <p>{category.description || "Sin descripción"}</p>
                        </Card>
                    </List.Item>
                )}
            />

            <Button type="primary" style={{ marginTop: 16 }}>
                <Link to="/admin/categories/new">Agregar Categoría</Link>
            </Button>
        </div>
    );
};

export default CategoryListPage;
