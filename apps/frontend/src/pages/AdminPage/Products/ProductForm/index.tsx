import { Button, Form, Input, InputNumber, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_PRODUCT, GET_PRODUCT } from "../../../../components/Product/queries.ts";
import { useEffect, useState } from "react";
import {useNotify} from "../../../../context/NotificationContext";

interface ProductFormData {
    name: string;
    details: string;
    category: string;
    price: number;
    image?: string;
}

const ProductForm = ({ productId }: { productId?: string }) => {
    const { control, handleSubmit, reset } = useForm<ProductFormData>();
    const [addProduct, { loading }] = useMutation(ADD_PRODUCT);
    const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
    const { notifySuccess, notifyError } = useNotify();
    const { data, loading : fetching } = useQuery(GET_PRODUCT, {
        variables: { id: productId },
        skip: !productId,
    });

    useEffect(() => {
        if (data?.product) {
            reset({
                name: data.product.name,
                price: data.product.price,
                details: data.product.details,
                category: data.product.category,
                image: data.product.image,
            });
            setImagePreview(data.product.image);
        }
    }, [data, reset]);

    const onSubmit = async (formData: ProductFormData) => {
        try {
            await addProduct({
                variables: {
                    input: {
                        _id: productId === 'new' ? undefined: productId,
                        name: formData.name,
                        details: formData.details,
                        category: formData.category,
                        price: formData.price,
                        image: formData.image || null,
                    },
                },
            });

            notifySuccess("Éxito", "Producto creado con éxito");

        } catch (error) {
            notifyError("Error al agregar producto", error.name);
        }
    };

    return (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} style={{ maxWidth: 500 }}>
            <Form.Item label="Nombre de producto" required>
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Requerido" }}
                    render={({ field }) => <Input {...field} />}
                />
            </Form.Item>

            <Form.Item label="Detalles del producto" required>
                <Controller
                    name="details"
                    control={control}
                    render={({ field }) => <Input.TextArea {...field} autoSize />}
                />
            </Form.Item>

            <Form.Item label="Categoría" required>
                <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Requerido" }}
                    render={({ field }) => (
                        <Select {...field} placeholder="Selecciona una categoría" allowClear>
                            <Select.Option value="vino">Vino</Select.Option>
                            <Select.Option value="cerveza">Cerveza</Select.Option>
                            <Select.Option value="licor">Licor</Select.Option>
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

            <Form.Item label="Imagen (URL opcional)">
                <Controller
                    name="image"
                    control={control}
                    render={({ field: { onChange, ...rest } }) => (
                        <>
                            <Input
                                {...rest}
                                onChange={(e) => {
                                    const url = e.target.value;
                                    setImagePreview(url);
                                    onChange(url);
                                }}
                            />
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Vista previa"
                                    style={{ width: "100%", marginTop: 10, borderRadius: 4 }}
                                />
                            )}
                        </>
                    )}
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    {productId ? "Actualizar producto" : "Agregar producto"}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ProductForm;
