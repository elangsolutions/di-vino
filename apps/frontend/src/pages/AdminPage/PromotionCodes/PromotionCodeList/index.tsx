import { useState } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { Card, List, Typography, Button, Spin, Space, Modal, Grid, Tag } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { GET_PROMOTION_CODES, DELETE_PROMOTION_CODE } from "../../../../components/PromotionCode/queries";
import { GET_PRODUCTS } from "../../../../components/Product/queries";
import { PromotionCode } from "../types";
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

const PromotionCodeListPage = () => {
    const { notifySuccess, notifyError } = useNotify();
    const [promotionToDelete, setPromotionToDelete] = useState<PromotionCode | null>(null);
    const { data, loading, error, refetch } = useQuery(GET_PROMOTION_CODES);
    const { data: productsData } = useQuery(GET_PRODUCTS);
    const [deletePromotionCode, { loading: deleting }] = useMutation(DELETE_PROMOTION_CODE, {
        refetchQueries: [{ query: GET_PROMOTION_CODES }],
        awaitRefetchQueries: true,
    });
    const { useBreakpoint } = Grid;

    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const products: { _id: string; name: string }[] = productsData?.products || [];

    const getProductName = (productId?: string) => {
        if (!productId) return null;
        return products.find((p) => p._id === productId)?.name ?? productId;
    };

    const isActive = (promotion: PromotionCode) => {
        const now = dayjs();
        return now.isAfter(dayjs(promotion.fromDate)) && now.isBefore(dayjs(promotion.toDate));
    };

    if (loading) return <Spin style={{ display: "block", margin: "2rem auto" }} />;
    if (error) return <p>Error al cargar códigos promocionales: {error.message}</p>;

    const promotionCodes: PromotionCode[] = data?.promotionCodes || [];

    const closeDeleteModal = () => {
        if (!deleting) {
            setPromotionToDelete(null);
        }
    };

    const handleConfirmDelete = async () => {
        if (!promotionToDelete) return;

        try {
            const result = await deletePromotionCode({
                variables: { input: { _id: promotionToDelete._id } },
            });

            if (!result.data?.deletePromotionCode) {
                throw new Error("No se pudo eliminar el código promocional.");
            }

            notifySuccess(
                "Código eliminado",
                `"${promotionToDelete.code}" se eliminó correctamente.`,
            );
            setPromotionToDelete(null);
            await refetch();
        } catch (err) {
            notifyError(
                "No se pudo eliminar el código",
                getApolloErrorMessage(err, "Error desconocido"),
            );
        }
    };

    return (
        <div style={{ padding: isMobile ? 2 : 24 }}>
            <Typography.Title level={2}>Códigos promocionales</Typography.Title>

            <List
                grid={{ gutter: 16, column: isMobile ? 1 : 2 }}
                dataSource={promotionCodes}
                renderItem={(promotion) => (
                    <List.Item>
                        <Card
                            title={
                                <Space>
                                    <span>{promotion.code}</span>
                                    {isActive(promotion) ? (
                                        <Tag color="green">Activo</Tag>
                                    ) : (
                                        <Tag color="default">Inactivo</Tag>
                                    )}
                                </Space>
                            }
                            extra={
                                <Space>
                                    <Link to={`/admin/promotion-codes/${promotion._id}`}>Editar</Link>
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
                            <p><strong>Descuento:</strong> {promotion.percentage}%</p>
                            <p>
                                <strong>Alcance:</strong>{" "}
                                {promotion.scope === "ORDER"
                                    ? "Pedido completo"
                                    : `Producto: ${getProductName(promotion.productId) ?? "—"}`}
                            </p>
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
                <Link to="/admin/promotion-codes/new">Agregar código</Link>
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
                    ¿Estás seguro de que querés eliminar el código{" "}
                    <strong>{promotionToDelete?.code}</strong>?
                </p>
            </Modal>
        </div>
    );
};

export default PromotionCodeListPage;
