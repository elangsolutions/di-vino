// pages/CategoryListPage.tsx
import { useState } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { Card, List, Typography, Button, Spin, Space, Modal, Grid } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { GET_CATEGORIES, DELETE_CATEGORY } from "../../../../components/Category/queries";
import { Category } from "../types";
import { useNotify } from "../../../../context/NotificationContext";

const getApolloErrorMessage = (err: unknown, fallback: string) => {
    if (err instanceof ApolloError) {
        return err.graphQLErrors[0]?.message || err.message || fallback;
    }
    if (err instanceof Error) {
        return err.message;
    }
    return fallback;
};

const CategoryListPage = () => {
    const { notifySuccess, notifyError } = useNotify();
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const { data, loading, error, refetch } = useQuery(GET_CATEGORIES);
    const [deleteCategory, { loading: deleting }] = useMutation(DELETE_CATEGORY, {
        refetchQueries: [{ query: GET_CATEGORIES }],
        awaitRefetchQueries: true,
    });
    const { useBreakpoint } = Grid;

    const screens = useBreakpoint();
    const isMobile = !screens.md;

    if (loading) return <Spin style={{ display: "block", margin: "2rem auto" }} />;
    if (error) return <p>Error al cargar categorías: {error.message}</p>;

    const categories: Category[] = data?.categories || [];

    const closeDeleteModal = () => {
        if (!deleting) {
            setCategoryToDelete(null);
        }
    };

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return;

        try {
            const result = await deleteCategory({
                variables: { input: { _id: categoryToDelete._id } },
            });

            if (!result.data?.deleteCategory) {
                throw new Error("No se pudo eliminar la categoría.");
            }

            notifySuccess(
                "Categoría eliminada",
                `"${categoryToDelete.name}" se eliminó correctamente.`,
            );
            setCategoryToDelete(null);
            await refetch();
        } catch (err) {
            notifyError(
                "No se pudo eliminar la categoría",
                getApolloErrorMessage(err, "Error desconocido"),
            );
        }
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
                                    <Button
                                        type="link"
                                        danger
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setCategoryToDelete(category);
                                        }}
                                        style={{ padding: 0 }}
                                    >
                                        Eliminar
                                    </Button>
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

            <Modal
                open={Boolean(categoryToDelete)}
                title={
                    <Space>
                        <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
                        Confirmar eliminación
                    </Space>
                }
                okText="Sí, eliminar"
                okType="danger"
                cancelText="Cancelar"
                confirmLoading={deleting}
                onOk={handleConfirmDelete}
                onCancel={closeDeleteModal}
                destroyOnClose
            >
                <p>
                    ¿Estás seguro de que querés eliminar la categoría{" "}
                    <strong>{categoryToDelete?.name}</strong>?
                </p>
                <p style={{ color: "#8c8c8c", marginBottom: 0 }}>
                    Esta acción no se puede deshacer. Si la categoría tiene productos asociados,
                    la eliminación será rechazada.
                </p>
            </Modal>
        </div>
    );
};

export default CategoryListPage;
