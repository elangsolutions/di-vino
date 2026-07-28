import { Button, DatePicker, Form, Input, InputNumber, Radio, Select, Space } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    ADD_PROMOTION_CODE,
    GET_PROMOTION_CODE,
    GET_PROMOTION_CODES,
} from "../../../../components/PromotionCode/queries";
import { GET_PRODUCTS } from "../../../../components/Product/queries";
import { useNotify } from "../../../../context/NotificationContext";
import { PromotionScope } from "../types";

const { RangePicker } = DatePicker;

interface PromotionCodeFormData {
    code: string;
    dateRange: [Dayjs, Dayjs] | null;
    percentage: number;
    scope: PromotionScope;
    productId?: string;
}

const PromotionCodeForm = ({ promotionCodeId }: { promotionCodeId?: string }) => {
    const navigate = useNavigate();
    const isEdit = Boolean(promotionCodeId) && promotionCodeId !== "new";

    const { control, handleSubmit, reset, watch } = useForm<PromotionCodeFormData>({
        defaultValues: {
            scope: "ORDER",
            dateRange: null,
        },
    });

    const scope = watch("scope");

    const [addPromotionCode, { loading }] = useMutation(ADD_PROMOTION_CODE, {
        refetchQueries: [{ query: GET_PROMOTION_CODES }],
    });
    const { notifySuccess, notifyError } = useNotify();

    const { data, loading: loadingGet } = useQuery(GET_PROMOTION_CODE, {
        variables: { id: promotionCodeId },
        skip: !isEdit,
    });
    const { data: productsData } = useQuery(GET_PRODUCTS);
    const products: { _id: string; name: string }[] = productsData?.products || [];

    useEffect(() => {
        if (data?.promotionCode) {
            reset({
                code: data.promotionCode.code,
                dateRange: [
                    dayjs(data.promotionCode.fromDate),
                    dayjs(data.promotionCode.toDate),
                ],
                percentage: data.promotionCode.percentage,
                scope: data.promotionCode.scope,
                productId: data.promotionCode.productId ?? undefined,
            });
        }
    }, [data, reset]);

    if (loading || loadingGet) return <p>Cargando...</p>;

    const onSubmit = async (formData: PromotionCodeFormData) => {
        if (!formData.dateRange) {
            notifyError("Error al guardar código", "Debes seleccionar un rango de fechas");
            return;
        }

        if (formData.scope === "PRODUCT" && !formData.productId) {
            notifyError("Error al guardar código", "Debes seleccionar un producto");
            return;
        }

        try {
            await addPromotionCode({
                variables: {
                    input: {
                        _id: isEdit ? promotionCodeId : undefined,
                        code: formData.code.trim().toUpperCase(),
                        fromDate: formData.dateRange[0].startOf("day").toISOString(),
                        toDate: formData.dateRange[1].endOf("day").toISOString(),
                        percentage: formData.percentage,
                        scope: formData.scope,
                        productId: formData.scope === "PRODUCT" ? formData.productId : null,
                    },
                },
            });

            notifySuccess(
                "Éxito",
                isEdit ? "Código actualizado con éxito" : "Código creado con éxito",
            );
            navigate("/admin/promotion-codes");
        } catch (error) {
            notifyError(
                "Error al guardar código",
                error instanceof Error ? error.message : "Error desconocido",
            );
        }
    };

    return (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} style={{ maxWidth: 500 }}>
            <Form.Item label="Código" required>
                <Controller
                    name="code"
                    control={control}
                    rules={{ required: "Requerido" }}
                    render={({ field }) => (
                        <Input {...field} placeholder="Ej: VERANO20" style={{ textTransform: "uppercase" }} />
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

            <Form.Item label="Porcentaje de descuento" required>
                <Controller
                    name="percentage"
                    control={control}
                    rules={{ required: "Requerido", min: 1, max: 100 }}
                    render={({ field }) => (
                        <InputNumber
                            {...field}
                            min={1}
                            max={100}
                            addonAfter="%"
                            style={{ width: "100%" }}
                        />
                    )}
                />
            </Form.Item>

            <Form.Item label="Aplicar descuento a" required>
                <Controller
                    name="scope"
                    control={control}
                    render={({ field }) => (
                        <Radio.Group {...field}>
                            <Radio value="ORDER">Pedido completo</Radio>
                            <Radio value="PRODUCT">Producto específico</Radio>
                        </Radio.Group>
                    )}
                />
            </Form.Item>

            {scope === "PRODUCT" && (
                <Form.Item label="Producto" required>
                    <Controller
                        name="productId"
                        control={control}
                        rules={{ required: scope === "PRODUCT" ? "Requerido" : false }}
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
            )}

            <Form.Item>
                <Space>
                    <Button onClick={() => navigate(-1)} loading={loading}>
                        Volver
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {isEdit ? "Actualizar código" : "Agregar código"}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default PromotionCodeForm;
