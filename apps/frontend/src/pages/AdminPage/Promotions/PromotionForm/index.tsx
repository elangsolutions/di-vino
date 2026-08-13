import { Button, DatePicker, Form, Input, InputNumber, Radio, Select, Space, Typography } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    ADD_PROMOTION,
    GET_PROMOTION,
    GET_PROMOTIONS,
} from "../../../../components/Promotion/queries";
import { GET_PRODUCTS } from "../../../../components/Product/queries";
import { GET_CATEGORIES } from "../../../../components/Category/queries";
import { useNotify } from "../../../../context/NotificationContext";
import {
    PromotionRewardType,
    PromotionScope,
    PromotionType,
} from "../../../../components/Promotion/utils";

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface PromotionFormData {
    name: string;
    type: PromotionType;
    dateRange: [Dayjs, Dayjs] | null;
    rewardType: PromotionRewardType;
    percentage?: number;
    fixedPrice?: number;
    scope?: PromotionScope;
    productId?: string;
    categoryId?: string;
    code?: string;
}

const PromotionForm = ({ promotionId }: { promotionId?: string }) => {
    const navigate = useNavigate();
    const isEdit = Boolean(promotionId) && promotionId !== "new";

    const { control, handleSubmit, reset, watch, setValue } = useForm<PromotionFormData>({
        defaultValues: {
            type: "BULK",
            rewardType: "PERCENTAGE",
            scope: "PRODUCT",
            dateRange: null,
        },
    });

    const type = watch("type");
    const rewardType = watch("rewardType");
    const scope = watch("scope");

    useEffect(() => {
        if (type === "PRODUCT") {
            setValue("scope", "PRODUCT");
        } else if (type === "BULK" && scope === "ORDER") {
            setValue("scope", "PRODUCT");
        }
    }, [type, scope, setValue]);

    const [addPromotion, { loading }] = useMutation(ADD_PROMOTION, {
        refetchQueries: [{ query: GET_PROMOTIONS }],
    });
    const { notifySuccess, notifyError } = useNotify();

    const { data, loading: loadingGet } = useQuery(GET_PROMOTION, {
        variables: { id: promotionId },
        skip: !isEdit,
    });
    const { data: productsData } = useQuery(GET_PRODUCTS);
    const { data: categoriesData } = useQuery(GET_CATEGORIES);
    const products: { _id: string; name: string }[] = productsData?.products || [];
    const categories: { _id: string; name: string }[] = categoriesData?.categories || [];

    useEffect(() => {
        if (data?.promotion) {
            const promotion = data.promotion;
            reset({
                name: promotion.name,
                type: promotion.type,
                dateRange: [dayjs(promotion.fromDate), dayjs(promotion.toDate)],
                rewardType: promotion.rewardType,
                percentage: promotion.percentage ?? undefined,
                fixedPrice: promotion.fixedPrice ?? undefined,
                scope: promotion.scope ?? (promotion.type === "PROMO_CODE" ? "ORDER" : "PRODUCT"),
                productId: promotion.productId ?? undefined,
                categoryId: promotion.categoryId ?? undefined,
                code: promotion.code ?? undefined,
            });
        }
    }, [data, reset]);

    if (loading || loadingGet) return <p>Cargando...</p>;

    const needsProduct =
        type === "PRODUCT" ||
        ((type === "BULK" || type === "PROMO_CODE") && scope === "PRODUCT");
    const needsCategory = (type === "BULK" || type === "PROMO_CODE") && scope === "CATEGORY";

    const onSubmit = async (formData: PromotionFormData) => {
        if (!formData.dateRange) {
            notifyError("Error al guardar promoción", "Debes seleccionar un rango de fechas");
            return;
        }

        try {
            await addPromotion({
                variables: {
                    input: {
                        _id: isEdit ? promotionId : undefined,
                        name: formData.name.trim(),
                        type: formData.type,
                        fromDate: formData.dateRange[0].startOf("day").toISOString(),
                        toDate: formData.dateRange[1].endOf("day").toISOString(),
                        rewardType: formData.rewardType,
                        percentage: formData.rewardType === "PERCENTAGE" ? formData.percentage : null,
                        fixedPrice: formData.rewardType === "FIXED_PRICE" ? formData.fixedPrice : null,
                        scope:
                            formData.type === "PRODUCT"
                                ? "PRODUCT"
                                : formData.scope,
                        productId: needsProduct ? formData.productId : null,
                        categoryId: needsCategory ? formData.categoryId : null,
                        code: formData.type === "PROMO_CODE" ? formData.code?.trim().toUpperCase() : null,
                    },
                },
            });

            notifySuccess(
                "Éxito",
                isEdit ? "Promoción actualizada con éxito" : "Promoción creada con éxito",
            );
            navigate("/admin/promotions");
        } catch (error) {
            notifyError(
                "Error al guardar promoción",
                error instanceof Error ? error.message : "Error desconocido",
            );
        }
    };

    const fixedPriceLabel =
        type === "BULK"
            ? "Precio por caja"
            : type === "PROMO_CODE" && scope === "ORDER"
                ? "Monto fijo de descuento"
                : "Precio promocional por unidad";

    return (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} style={{ maxWidth: 520 }}>
            <Form.Item label="Tipo de promoción" required>
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <Radio.Group {...field}>
                            <Radio.Button value="BULK">Por volumen</Radio.Button>
                            <Radio.Button value="PRODUCT">Por producto</Radio.Button>
                            <Radio.Button value="PROMO_CODE">Código</Radio.Button>
                        </Radio.Group>
                    )}
                />
            </Form.Item>

            <Form.Item label="Nombre" required>
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Requerido" }}
                    render={({ field }) => (
                        <Input {...field} placeholder="Ej: Caja de vinos x6" />
                    )}
                />
            </Form.Item>

            {type === "PROMO_CODE" && (
                <Form.Item label="Código" required>
                    <Controller
                        name="code"
                        control={control}
                        rules={{ required: type === "PROMO_CODE" ? "Requerido" : false }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Ej: VERANO20"
                                style={{ textTransform: "uppercase" }}
                            />
                        )}
                    />
                </Form.Item>
            )}

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

            {type !== "PRODUCT" && (
                <Form.Item label="Aplicar a" required>
                    <Controller
                        name="scope"
                        control={control}
                        render={({ field }) => (
                            <Radio.Group {...field}>
                                {type === "PROMO_CODE" && <Radio value="ORDER">Pedido completo</Radio>}
                                <Radio value="PRODUCT">Producto específico</Radio>
                                <Radio value="CATEGORY">Categoría</Radio>
                            </Radio.Group>
                        )}
                    />
                </Form.Item>
            )}

            {needsProduct && (
                <Form.Item label="Producto" required>
                    <Controller
                        name="productId"
                        control={control}
                        rules={{ required: needsProduct ? "Requerido" : false }}
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

            {needsCategory && (
                <Form.Item label="Categoría" required>
                    <Controller
                        name="categoryId"
                        control={control}
                        rules={{ required: needsCategory ? "Requerido" : false }}
                        render={({ field }) => (
                            <Select {...field} placeholder="Selecciona una categoría" allowClear>
                                {categories.map((category) => (
                                    <Select.Option key={category._id} value={category._id}>
                                        {category.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        )}
                    />
                </Form.Item>
            )}

            <Form.Item label="Beneficio" required>
                <Controller
                    name="rewardType"
                    control={control}
                    render={({ field }) => (
                        <Radio.Group {...field}>
                            <Radio value="PERCENTAGE">Porcentaje de descuento</Radio>
                            <Radio value="FIXED_PRICE">
                                {type === "PROMO_CODE" && scope === "ORDER"
                                    ? "Monto fijo"
                                    : "Precio fijo"}
                            </Radio>
                        </Radio.Group>
                    )}
                />
            </Form.Item>

            {rewardType === "PERCENTAGE" ? (
                <Form.Item label="Porcentaje" required>
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
            ) : (
                <Form.Item label={fixedPriceLabel} required>
                    <Controller
                        name="fixedPrice"
                        control={control}
                        rules={{ required: "Requerido", min: 1 }}
                        render={({ field }) => (
                            <InputNumber {...field} min={1} prefix="$" style={{ width: "100%" }} />
                        )}
                    />
                </Form.Item>
            )}

            {type === "BULK" && (
                <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
                    Las unidades por bulto se configuran en cada producto. Si el cliente lleva más
                    unidades que ese bulto, se cobra el beneficio por cada caja completa y las
                    unidades sueltas al precio unitario. Ejemplo: 7 vinos con caja de 6 = 1 caja + 1
                    unidad.
                </Text>
            )}

            <Form.Item>
                <Space>
                    <Button onClick={() => navigate(-1)} loading={loading}>
                        Volver
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {isEdit ? "Actualizar promoción" : "Agregar promoción"}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default PromotionForm;
