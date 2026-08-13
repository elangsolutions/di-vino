import { useState } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { Card, List, Typography, Button, Spin, Space, Modal, Grid, Tag } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { GET_PROMOTIONS, DELETE_PROMOTION } from "../../../../components/Promotion/queries";
import { GET_PRODUCTS } from "../../../../components/Product/queries";
import { GET_CATEGORIES } from "../../../../components/Category/queries";
import {
    Promotion,
    describeReward,
    promotionTypeLabel,
} from "../../../../components/Promotion/utils";
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

const PromotionListPage = () => {
    const { notifySuccess, notifyError } = useNotify();
    const [promotionToDelete, setPromotionToDelete] = useState<Promotion | null>(null);
    const { data, loading, error, refetch } = useQuery(GET_PROMOTIONS);
    const { data: productsData } = useQuery(GET_PRODUCTS);
    const { data: categoriesData } = useQuery(GET_CATEGORIES);
    const [deletePromotion, { loading: deleting }] = useMutation(DELETE_PROMOTION, {
        refetchQueries: [{ query: GET_PROMOTIONS }],
        awaitRefetchQueries: true,
    });
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const products: { _id: string; name: string }[] = productsData?.products || [];
    const categories: { _id: string; name: string }[] = categoriesData?.categories || [];

    const getProductName = (productId?: string | null) => {
        if (!productId) return null;
        return products.find((product) => product._id === productId)?.name ?? productId;
    };

    const getCategoryName = (promotion: Promotion) => {
        if (promotion.categoryName) return promotion.categoryName;
        if (!promotion.categoryId) return null;
        return categories.find((category) => category._id === promotion.categoryId)?.name
            ?? promotion.categoryId;
    };

    const scopeLabel = (promotion: Promotion) => {
        if (promotion.type === "PRODUCT" || promotion.scope === "PRODUCT") {
            return `Producto: ${getProductName(promotion.productId) ?? "—"}`;
        }
        if (promotion.scope === "CATEGORY") {
            return `Categoría: ${getCategoryName(promotion) ?? "—"}`;
        }
        return "Pedido completo";
    };

    const isActive = (promotion: Promotion) => {
        const now = dayjs();
        return now.isAfter(dayjs(promotion.fromDate)) && now.isBefore(dayjs(promotion.toDate));
    };

    if (loading) return <Spin style={{ display: "block", margin: "2rem auto" }} />;
    if (error) return <p>Error al cargar promociones: {error.message}</p>;

    const promotions: Promotion[] = data?.promotions || [];

    const closeDeleteModal = () => {
        if (!deleting) {
            setPromotionToDelete(null);
        }
    };

    const handleConfirmDelete = async () => {
        if (!promotionToDelete) return;

        try {
            const result = await deletePromotion({
                variables: { input: { _id: promotionToDelete._id } },
            });

            if (!result.data?.deletePromotion) {
                throw new Error("No se pudo eliminar la promoción.");
            }

            notifySuccess(
                "Promoción eliminada",
                `"${promotionToDelete.name}" se eliminó correctamente.`,
            );
            setPromotionToDelete(null);
            await refetch();
        } catch (err) {
            notifyError(
                "No se pudo eliminar la promoción",
                getApolloErrorMessage(err, "Error desconocido"),
            );
        }
    };

    return (
        <div style={{ padding: isMobile ? 2 : 24 }}>
            <Typography.Title level={2}>Promociones</Typography.Title>
            <Typography.Paragraph type="secondary">
                Volumen (caja), descuento por producto o código promocional. Cada una puede ser
                porcentaje o precio fijo, con vigencia.
            </Typography.Paragraph>

            <List
                grid={{ gutter: 16, column: isMobile ? 1 : 2 }}
                dataSource={promotions}
                renderItem={(promotion) => (
                    <List.Item>
                        <Card
                            title={
                                <Space wrap>
                                    <span>{promotion.name}</span>
                                    <Tag>{promotionTypeLabel[promotion.type]}</Tag>
                                    {isActive(promotion) ? (
                                        <Tag color="green">Activo</Tag>
                                    ) : (
                                        <Tag>Inactivo</Tag>
                                    )}
                                </Space>
                            }
                            extra={
                                <Space>
                                    <Link to={`/admin/promotions/${promotion._id}`}>Editar</Link>
                                    <Button
                                        type="link"
                                        danger
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setPromotionToDelete(promotion);
                                        }}
                                        style={{ padding: 0 }}
                                    >
                                        Eliminar
                                    </Button>
                                </Space>
                            }
                        >
                            {promotion.code && (
                                <p><strong>Código:</strong> {promotion.code}</p>
                            )}
                            <p><strong>Beneficio:</strong> {describeReward(promotion)}</p>
                            <p><strong>Alcance:</strong> {scopeLabel(promotion)}</p>
                            <p>
                                <strong>Vigencia:</strong>{" "}
                                {dayjs(promotion.fromDate).format("DD/MM/YYYY")} –{" "}
                                {dayjs(promotion.toDate).format("DD/MM/YYYY")}
                            </p>
                        </Card>
                    </List.Item>
                )}
            />

            <Button type="primary" style={{ marginTop: 16 }}>
                <Link to="/admin/promotions/new">Agregar promoción</Link>
            </Button>

            <Modal
                open={Boolean(promotionToDelete)}
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
                    ¿Estás seguro de que querés eliminar la promoción{" "}
                    <strong>{promotionToDelete?.name}</strong>?
                </p>
            </Modal>
        </div>
    );
};

export default PromotionListPage;
