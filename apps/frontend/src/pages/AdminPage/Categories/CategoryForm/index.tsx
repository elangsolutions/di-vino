import {Button, Form, Input, Space} from "antd";
import {useForm, Controller} from "react-hook-form";
import {useMutation, useQuery} from "@apollo/client";
import {ADD_CATEGORY, GET_CATEGORY, GET_CATEGORIES} from "../../../../components/Category/queries";
import {useEffect} from "react";
import {useNotify} from "../../../../context/NotificationContext";
import {useNavigate} from "react-router-dom";

interface CategoryFormData {
    name: string;
    description?: string;
}

const CategoryForm = ({categoryId}: { categoryId?: string }) => {
    const {control, handleSubmit, reset} = useForm<CategoryFormData>();
    const navigate = useNavigate();
    const [addCategory, {loading}] = useMutation(ADD_CATEGORY, {
        refetchQueries: [{query: GET_CATEGORIES}],
    });
    const {notifySuccess, notifyError} = useNotify();
    const isEdit = Boolean(categoryId) && categoryId !== 'new';
    const {data, loading: loadingGet} = useQuery(GET_CATEGORY, {
        variables: {id: categoryId},
        skip: !isEdit,
    });

    useEffect(() => {
        if (data?.category) {
            reset({
                name: data.category.name,
                description: data.category.description ?? undefined,
            });
        }
    }, [data, reset]);

    if (loading || loadingGet) return <p>Cargando...</p>;

    const onSubmit = async (formData: CategoryFormData) => {
        try {
            await addCategory({
                variables: {
                    input: {
                        _id: isEdit ? categoryId : undefined,
                        name: formData.name,
                        description: formData.description || null,
                    },
                },
            });

            notifySuccess("Éxito", isEdit ? "Categoría actualizada con éxito" : "Categoría creada con éxito");
            navigate('/admin/categories');

        } catch (error) {
            notifyError("Error al guardar categoría", error instanceof Error ? error.message : "Error desconocido");
        }
    };

    return (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} style={{maxWidth: 500}}>
            <Form.Item label="Nombre de categoría" required>
                <Controller
                    name="name"
                    control={control}
                    rules={{required: "Requerido"}}
                    render={({field}) => <Input {...field} />}
                />
            </Form.Item>

            <Form.Item label="Descripción (opcional)">
                <Controller
                    name="description"
                    control={control}
                    render={({field}) => <Input.TextArea {...field} autoSize/>}
                />
            </Form.Item>

            <Form.Item>
                <Space>
                    <Button onClick={() => navigate(-1)} loading={loading}>
                        Volver
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {isEdit ? "Actualizar categoría" : "Agregar categoría"}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default CategoryForm;
