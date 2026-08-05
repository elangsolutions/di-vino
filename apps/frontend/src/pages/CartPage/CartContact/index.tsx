import { useState } from 'react';
import { Button, Form, Input, Typography, Space } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { CREATE_ORDER } from './queries';
import { clearCart, selectCartItems } from '../../../store/cart/slice';
import { selectDelivery, resetDelivery } from '../../../store/delivery/slice';
import { addOngoingOrder } from '../../../store/orders/slice';
import { useNotify } from '../../../context/NotificationContext';

const { Title, Text } = Typography;

interface ContactFormData {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
}

type CartContactProps = {
    onCompleted: () => void;
};

const CartContact = ({ onCompleted }: CartContactProps) => {
    const dispatch = useDispatch();
    const { notifySuccess, notifyError } = useNotify();
    const cartItems = useSelector(selectCartItems);
    const delivery = useSelector(selectDelivery);
    const [submitted, setSubmitted] = useState(false);

    const { control, handleSubmit } = useForm<ContactFormData>({
        defaultValues: {
            customerName: '',
            customerEmail: '',
            customerPhone: '',
        },
    });

    const [createOrder, { loading }] = useMutation(CREATE_ORDER);

    const onSubmit = async (formData: ContactFormData) => {
        try {
            const items = cartItems
                .filter((item: { product?: { name?: string; price?: number } }) => item.product)
                .map((item: { productId: string; quantity: number; product: { name: string; price: number } }) => ({
                    productId: item.productId,
                    title: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                }));

            if (!items.length) {
                notifyError('Pedido vacío', 'Agregá productos antes de confirmar el contacto.');
                return;
            }

            const deliveryType = delivery.deliveryType === 'pickup' ? 'PICKUP' : 'ADDRESS';

            const { data } = await createOrder({
                variables: {
                    input: {
                        state: 'OPEN',
                        userId: formData.customerEmail,
                        customerName: formData.customerName.trim(),
                        customerEmail: formData.customerEmail.trim(),
                        customerPhone: formData.customerPhone.trim(),
                        items,
                        delivery: {
                            type: deliveryType,
                            locationId: delivery.pickup.locationId || null,
                            address:
                                delivery.deliveryType === 'delivery'
                                    ? {
                                          street: delivery.delivery.street,
                                          city: delivery.delivery.city,
                                          postalCode: delivery.delivery.zip,
                                          province: '',
                                      }
                                    : null,
                        },
                    },
                },
            });

            const order = data?.createOrder;
            if (order) {
                dispatch(
                    addOngoingOrder({
                        id: order._id,
                        externalReference: order.external_reference,
                        status: order.status,
                        customerName: order.customerName,
                        customerEmail: order.customerEmail,
                        customerPhone: order.customerPhone,
                        deliveryType,
                        locationId: order.delivery?.locationId ?? delivery.pickup.locationId,
                        items: order.items ?? items,
                        createdAt: order.createdAt ?? new Date().toISOString(),
                    }),
                );
            }

            dispatch(clearCart());
            dispatch(resetDelivery());
            setSubmitted(true);
            notifySuccess('Pedido confirmado', 'Tu pedido quedó registrado. Podés seguirlo en Mis pedidos.');
            onCompleted();
        } catch (error) {
            notifyError(
                'No se pudo guardar el contacto',
                error instanceof Error ? error.message : 'Error desconocido',
            );
        }
    };

    return (
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <Title level={4} style={{ marginBottom: 8 }}>
                ¿Cómo te contactamos?
            </Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                Dejanos tu nombre, email y teléfono por si necesitamos avisarte por cualquier
                problema con el pedido.
            </Text>

            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <Form.Item label="Nombre" required>
                    <Controller
                        name="customerName"
                        control={control}
                        rules={{ required: 'Requerido' }}
                        render={({ field, fieldState }) => (
                            <>
                                <Input {...field} placeholder="Tu nombre" size="large" />
                                {fieldState.error && (
                                    <Text type="danger" style={{ fontSize: 12 }}>
                                        {fieldState.error.message}
                                    </Text>
                                )}
                            </>
                        )}
                    />
                </Form.Item>

                <Form.Item label="Email" required>
                    <Controller
                        name="customerEmail"
                        control={control}
                        rules={{
                            required: 'Requerido',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Email inválido',
                            },
                        }}
                        render={({ field, fieldState }) => (
                            <>
                                <Input {...field} type="email" placeholder="tu@email.com" size="large" />
                                {fieldState.error && (
                                    <Text type="danger" style={{ fontSize: 12 }}>
                                        {fieldState.error.message}
                                    </Text>
                                )}
                            </>
                        )}
                    />
                </Form.Item>

                <Form.Item label="Teléfono / WhatsApp" required>
                    <Controller
                        name="customerPhone"
                        control={control}
                        rules={{
                            required: 'Requerido',
                            minLength: { value: 8, message: 'Ingresá un teléfono válido' },
                        }}
                        render={({ field, fieldState }) => (
                            <>
                                <Input {...field} placeholder="Ej: 11 1234 5678" size="large" />
                                {fieldState.error && (
                                    <Text type="danger" style={{ fontSize: 12 }}>
                                        {fieldState.error.message}
                                    </Text>
                                )}
                            </>
                        )}
                    />
                </Form.Item>

                <Form.Item>
                    <Space style={{ width: '100%' }} direction="vertical">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            disabled={submitted}
                            block
                            size="large"
                            style={{ height: 44 }}
                        >
                            Guardar y finalizar
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CartContact;
