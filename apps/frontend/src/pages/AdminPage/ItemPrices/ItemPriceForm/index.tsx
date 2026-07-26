import { Button, DatePicker, Form, InputNumber, Select, Space } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ADD_ITEM_PRICE, GET_ITEM_PRICE, GET_ITEM_PRICES } from "../../../../components/ItemPrice/queries";
import { GET_PRODUCTS } from "../../../../components/Product/queries";
import { useNotify } from "../../../../context/NotificationContext";

const { RangePicker } = DatePicker;

interface ItemPriceFormData {
    productId: string;
    price: number;
    dateRange: [Dayjs, Dayjs] | null;
    stock: number;
    promotionCodes: string[];
}

const ItemPriceForm = ({ itemPriceId }: { itemPriceId?: string }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const isEdit = Boolean(itemPriceId) && itemPriceId !== "new";

    const { control, handleSubmit, reset } = useForm<ItemPriceFormData>({
        defaultValues: {
            productId: searchParams.get("productId") ?? undefined,
            dateRange: null,
            promotionCodes: [],
        },
    });

    const [addItemPrice, { loading }] = useMutation(ADD_ITEM_PRICE, {
        refetchQueries: [{ query: GET_ITEM_PRICES }],
    });
    const { notifySuccess, notifyError } = useNotify();

    const { data, loading: loadingGet } = useQuery(GET_ITEM_PRICE, {
        variables: { id: itemPriceId },
        skip: !isEdit,
    });
    const { data: productsData } = useQuery(GET_PRODUCTS);
    const products: { _id: string; name: string }[] = productsData?.products || [];

    useEffect(() => {
        if (data?.itemPrice) {
            reset({
                productId: data.itemPrice.productId,
                price: data.itemPrice.price,
                dateRange: [dayjs(data.itemPrice.fromDate), dayjs(data.itemPrice.toDate)],
                stock: data.itemPrice.stock,
                promotionCodes: data.itemPrice.promotionCodes || [],
            });
        }
    }, [data, reset]);

    if (loading || loadingGet) return <p>Cargando...</p>;

    const onSubmit = async (formData: ItemPriceFormData) => {
        if (!formData.dateRange) {
            notifyError("Error al guardar precio", "Debes seleccionar un rango de fechas");
            return;
        }

        try {
            await addItemPrice({
                variables: {
                    input: {
                        _id: isEdit ? itemPriceId : undefined,
                        productId: formData.productId,
                        price: formData.price,
                        fromDate: formData.dateRange[0].startOf("day").toISOString(),
                        toDate: formData.dateRange[1].endOf("day").toISOString(),
                        stock: formData.stock,
                        promotionCodes: formData.promotionCodes || [],
                    },
                },
            });

            notifySuccess("Éxito", isEdit ? "Precio actualizado con éxito" : "Precio creado con éxito");
            navigate("/admin/item-prices");
        } catch (error) {
            notifyError("Error al guardar precio", error instanceof Error ? error.message : "Error desconocido");
        }
    };

    return (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} style={{ maxWidth: 500 }}>
            <Form.Item label="Producto" required>
                <Controller
                    name="productId"
                    control={control}
                    rules={{ required: "Requerido" }}
                    render={({ field }) => (
                        <Select {...field} placeholder="Selecciona un producto" allowClear>
                            {products.map((product) => (
                                <Select.Option key={product._id} value={product._id}>
                                    {product.name}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                />
            </Form.Item>

            <Form.Item label="Precio" required>
                <Controller
                    name="price"
                    control={control}
                    rules={{ required: "Requerido", min: 0 }}
                    render={({ field }) => (
                        <InputNumber
                            {...field}
                            min={0}
                            style={{ width: "100%" }}
                            formatter={(value) => `$ ${value}`}
                            parser={(value) => parseFloat(value?.replace(/\$\s?|(,*)/g, "") || "0")}
                        />
                    )}
                />
            </Form.Item>

            <Form.Item label="Vigencia (desde - hasta)" required>
                <Controller
                    name="dateRange"
                    control={control}
                    rules={{ required: "Requerido" }}
                    render={({ field }) => (
                        <RangePicker {...field} style={{ width: "100%" }} format="DD/MM/YYYY" />
                    )}
                />
            </Form.Item>

            <Form.Item label="Stock" required>
                <Controller
                    name="stock"
                    control={control}
                    rules={{ required: "Requerido", min: 0 }}
                    render={({ field }) => <InputNumber {...field} min={0} style={{ width: "100%" }} />}
                />
            </Form.Item>

            <Form.Item label="Códigos de promoción (opcional)">
                <Controller
                    name="promotionCodes"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            mode="tags"
                            style={{ width: "100%" }}
                            placeholder="Ej: SUMMER10, VIP"
                            tokenSeparators={[",", " "]}
                        />
                    )}
                />
            </Form.Item>

            <Form.Item>
                <Space>
                    <Button onClick={() => navigate(-1)} loading={loading}>
                        Volver
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {isEdit ? "Actualizar precio" : "Agregar precio"}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default ItemPriceForm;
