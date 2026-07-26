// pages/ItemPriceListPage.tsx
import { useQuery, useMutation } from "@apollo/client";
import { Card, List, Typography, Button, Spin, Space, Modal, message, Grid, Select, Tag } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { GET_ITEM_PRICES, DELETE_ITEM_PRICE } from "../../../../components/ItemPrice/queries";
import { GET_PRODUCTS } from "../../../../components/Product/queries";
import { ItemPrice } from "../types";
import { priceFormat } from "../../../../utils";

const { confirm } = Modal;

const isCurrentlyActive = (itemPrice: ItemPrice) => {
    const now = dayjs();
    return !now.isBefore(dayjs(itemPrice.fromDate)) && !now.isAfter(dayjs(itemPrice.toDate));
};

const ItemPriceListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const productIdFilter = searchParams.get("productId") ?? undefined;

    const { data, loading, error, refetch } = useQuery(GET_ITEM_PRICES);
    const { data: productsData } = useQuery(GET_PRODUCTS);
    const [deleteItemPrice] = useMutation(DELETE_ITEM_PRICE);
    const { useBreakpoint } = Grid;

    const screens = useBreakpoint();
    const isMobile = !screens.md;

    if (loading) return <Spin style={{ display: "block", margin: "2rem auto" }} />;
    if (error) return <p>Error al cargar precios: {error.message}</p>;

    const products: { _id: string; name: string }[] = productsData?.products || [];
    const productNameById = new Map(products.map((p) => [p._id, p.name]));

    const allItemPrices: ItemPrice[] = data?.itemPrices || [];
    const itemPrices = productIdFilter
        ? allItemPrices.filter((itemPrice) => itemPrice.productId === productIdFilter)
        : allItemPrices;

    const handleDelete = (itemPrice: ItemPrice) => {
        confirm({
            title: "¿Estás seguro de eliminar este precio?",
            content: `Producto: ${productNameById.get(itemPrice.productId) || itemPrice.productId}`,
            okText: "Eliminar",
            okType: "danger",
            cancelText: "Cancelar",
            async onOk() {
                try {
                    await deleteItemPrice({ variables: { input: { _id: itemPrice._id } } });
                    message.success("Precio eliminado correctamente");
                    refetch();
                } catch (err) {
                    message.error(`Error al eliminar: ${err instanceof Error ? err.message : "desconocido"}`);
                }
            },
        });
    };

    return (
        <div style={{ padding: isMobile ? 2 : 24 }}>
            <Typography.Title level={2}>Precios por período</Typography.Title>

            <Select
                allowClear
                placeholder="Filtrar por producto"
                style={{ width: 280, marginBottom: 16 }}
                value={productIdFilter}
                onChange={(value) => setSearchParams(value ? { productId: value } : {})}
            >
                {products.map((product) => (
                    <Select.Option key={product._id} value={product._id}>
                        {product.name}
                    </Select.Option>
                ))}
            </Select>

            <List
                grid={{ gutter: 16, column: isMobile ? 1 : 2 }}
                dataSource={itemPrices}
                renderItem={(itemPrice) => (
                    <List.Item>
                        <Card
                            title={productNameById.get(itemPrice.productId) || itemPrice.productId}
                            extra={
                                <Space>
                                    <Link to={`/admin/item-prices/${itemPrice._id}`}>Editar</Link>
                                    <a
                                        onClick={() => handleDelete(itemPrice)}
                                        style={{ color: "red", cursor: "pointer" }}
                                    >
                                        Eliminar
                                    </a>
                                </Space>
                            }
                        >
                            <p>
                                Precio: ${priceFormat(itemPrice.price)}{" "}
                                {isCurrentlyActive(itemPrice) && <Tag color="green">Vigente</Tag>}
                            </p>
                            <p>Stock: {itemPrice.stock}</p>
                            <p>
                                Del {dayjs(itemPrice.fromDate).format("DD/MM/YYYY")} al{" "}
                                {dayjs(itemPrice.toDate).format("DD/MM/YYYY")}
                            </p>
                            <p>
                                {itemPrice.promotionCodes && itemPrice.promotionCodes.length > 0
                                    ? itemPrice.promotionCodes.map((code) => <Tag key={code}>{code}</Tag>)
                                    : "Sin códigos de promoción"}
                            </p>
                        </Card>
                    </List.Item>
                )}
            />

            <Button type="primary" style={{ marginTop: 16 }}>
                <Link
                    to={
                        productIdFilter
                            ? `/admin/item-prices/new?productId=${productIdFilter}`
                            : "/admin/item-prices/new"
                    }
                >
                    Agregar Precio
                </Link>
            </Button>
        </div>
    );
};

export default ItemPriceListPage;
