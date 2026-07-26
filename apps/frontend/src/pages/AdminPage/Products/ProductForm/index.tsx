import {Button, Form, Input, Select, Space} from "antd";
import {useForm, Controller} from "react-hook-form";
import {useMutation, useQuery} from "@apollo/client";
import {ADD_PRODUCT, GET_PRODUCT} from "../../../../components/Product/queries.ts";
import {GET_CATEGORIES} from "../../../../components/Category/queries";
import {useEffect, useState} from "react";
import {useNotify} from "../../../../context/NotificationContext";
import {useNavigate} from "react-router-dom";

interface ProductFormData {
    name: string;
    details: string;
    category: string;
    image?: string;
}

const ProductForm = ({productId}: { productId?: string }) => {
    const {control, handleSubmit, reset} = useForm<ProductFormData>();
    const navigate = useNavigate();
    const [addProduct, {loading}] = useMutation(ADD_PRODUCT);
    const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
    const {notifySuccess, notifyError} = useNotify();
    const {data, loading: loadingGet} = useQuery(GET_PRODUCT, {
        variables: {id: productId},
        skip: !productId || productId === 'new',
    });
    const {data: categoriesData} = useQuery(GET_CATEGORIES);
    const categories = categoriesData?.categories || [];


    useEffect(() => {
        if (data?.product) {
            reset({
                name: data.product.name,
                details: data.product.details,
                category: data.product.category,
                image: data.product.image,
            });
            if (data.product.image) {
                setImagePreview(data.product.image);
            }
        }
    }, [data, reset]);
    if (loading || loadingGet) return <p>Cargando...</p>;

    const onSubmit = async (formData: ProductFormData) => {
        try {
            await addProduct({
                variables: {
                    input: {
                        _id: productId === 'new' ? undefined : productId,
                        name: formData.name,
                        details: formData.details,
                        category: formData.category,
                        image: formData.image || null,
                    },
                },
            });

            notifySuccess("Éxito", "Producto creado con éxito");

        } catch (error) {
            notifyError("Error al agregar producto", (error as any)?.message || "Error desconocido");
        }
    };

    return (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} style={{maxWidth: 500}}>
            <Form.Item label="Nombre de producto" required>
                <Controller
                    name="name"
                    control={control}
                    rules={{required: "Requerido"}}
                    render={({field}) => <Input {...field} />}
                />
            </Form.Item>

            <Form.Item label="Detalles del producto" required>
                <Controller
                    name="details"
                    control={control}
                    render={({field}) => <Input.TextArea {...field} autoSize/>}
                />
            </Form.Item>

            <Form.Item label="Categoría" required>
                <Controller
                    name="category"
                    control={control}
                    rules={{required: "Requerido"}}
                    render={({field}) => (
                        <Select {...field} placeholder="Selecciona una categoría" allowClear>
                            {categories.map((cat: {_id: string; name: string}) => (
                                <Select.Option key={cat._id} value={cat.name}>
                                    {cat.name}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                />
            </Form.Item>

            <Form.Item label="Imagen (URL opcional)">
                <Controller
                    name="image"
                    control={control}
                    render={({field: {onChange, ...rest}}) => (
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
                                    style={{width: "100%", marginTop: 10, borderRadius: 4}}
                                />
                            )}
                        </>
                    )}
                />
            </Form.Item>

            <Form.Item>
                <Space>
                    <Button onClick={() => navigate(-1)} loading={loading}>
                        Volver
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {productId ? "Actualizar producto" : "Agregar producto"}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default ProductForm;
