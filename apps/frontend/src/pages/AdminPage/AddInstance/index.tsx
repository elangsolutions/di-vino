// pages/InstanceFormPage.tsx
import { Typography } from "antd";
import { useParams } from "react-router-dom";
import { ReactNode } from "react";

interface InstanceFormPageProps {
    entityName: string;
    renderForm: (id?: string) => ReactNode;
}

const InstanceFormPage = ({ entityName, renderForm }: InstanceFormPageProps) => {
    const { id } = useParams<{ id?: string }>();
    const isEdit = Boolean(id);

    return (
        <div style={{ maxWidth: 400, margin: "auto", padding: 24 }}>
            <Typography.Title level={3}>
                {isEdit ? `Editar ${capitalize(entityName)} #${id}` : `Agregar ${capitalize(entityName)}`}
            </Typography.Title>
            {renderForm && (isEdit && !id ? null : renderForm(id))}
        </div>
    );
};

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

export default InstanceFormPage;
