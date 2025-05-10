import { Button, Form, Input, InputNumber, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { ADD_PRODUCT } from "../../../../components/Product/queries.ts";

interface ProductFormData {
    name: string;
    category: string;
    price: number;
    image?: string;
}

const ProductForm = ({ productId }: { productId?: string }) => {
    const { control, handleSubmit } = useForm<ProductFormData>();
    const [addProduct, { loading }] = useMutation(ADD_PRODUCT);

    const onSubmit = async (data: ProductFormData) => {
        try {
            await addProduct({
                variables: {
                    input: {
                        name: data.name,
                        category: data.category,
                        price: data.price,
                        image: data.image || null,
                    },
                },
            });
            // Redirect or show success message here
            alert("Producto agregado exitosamente");
        } catch (error) {
            console.error("Error al agregar producto:", error);
        }
    };

    return (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <Form.Item label="Nombre de producto">
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Requerido" }}
                    render={({ field }) => <Input {...field} />}
                />
            </Form.Item>

            <Form.Item label="Categoría">
                <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Requerido" }}
                    render={({ field }) => (
                        <Select {...field} placeholder="Selecciona una categoría">
                            <Select.Option value="vino">Vino</Select.Option>
                            <Select.Option value="cerveza">Cerveza</Select.Option>
                            <Select.Option value="licor">Licor</Select.Option>
                        </Select>
                    )}
                />
            </Form.Item>

            <Form.Item label="Precio">
                <Controller
                    name="price"
                    control={control}
                    rules={{ required: "Requerido" }}
                    render={({ field }) => <InputNumber {...field} style={{ width: "100%" }} />}
                />
            </Form.Item>

            <Form.Item label="Imagen (opcional)">
                <Controller
                    name="image"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loading}>
                {productId ? "Actualizar" : "Agregar"}
            </Button>
        </Form>
    );
};

export default ProductForm;
