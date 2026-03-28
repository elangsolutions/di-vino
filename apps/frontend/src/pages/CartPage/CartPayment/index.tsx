import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { Alert, Card, Space, Typography, Spin, Button, message } from "antd";
import { useSelector } from "react-redux";
import { selectCartItems, selectCartTotal } from "../../../store/cart/slice";
import { MERCADOPAGO_ENABLED } from "../../../config/payment";
import { CREATE_PAYMENT_PREFERENCE } from "./queries";

const { Title, Text } = Typography;

const CartPayment = () => {
    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [createPaymentPreference] = useMutation(CREATE_PAYMENT_PREFERENCE, {
        onCompleted: (data) => {
            const qrBase64 = data.createPaymentPreference.qrCodeBase64;
            setQrCode(qrBase64);
            setLoading(false);
            message.success("QR generado exitosamente");
        },
        onError: (error) => {
            message.error("Error al crear el QR de pago");
            console.error("Error:", error);
            setLoading(false);
        },
    });

    useEffect(() => {
        if (cartTotal > 0 && cartItems.length > 0) {
            generateQR();
        } else {
            setQrCode(null);
        }
    }, [cartTotal, cartItems.length]);

    const generateQR = async () => {
        setLoading(true);
        const orderId = `order_${Date.now()}`;
        const description = `Pedido - ${cartItems.length} items`;

        await createPaymentPreference({
            variables: {
                amount: cartTotal,
                description: description,
                orderId: orderId,
            },
        });
    };

    if (!MERCADOPAGO_ENABLED) {
        return (
            <Alert
                type="warning"
                showIcon
                message="Pago con Mercado Pago no disponible por el momento"
                description="Estamos trabajando en esta opción. Podés continuar con tu pedido y coordinar el pago por otro medio."
                style={{ maxWidth: 480, margin: "0 auto" }}
            />
        );
    }

    if (cartTotal === 0 || cartItems.length === 0) {
        return (
            <Alert
                type="info"
                showIcon
                message="Carrito vacío"
                description="Agrega productos a tu carrito para continuar con el pago"
                style={{ maxWidth: 480, margin: "0 auto" }}
            />
        );
    }

    return (
        <Card
            style={{
                maxWidth: 500,
                margin: "0 auto",
                textAlign: "center",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
        >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Title level={4} style={{ marginBottom: 0 }}>
                    Escaneá el QR para pagar
                </Title>

                <div style={{
                    backgroundColor: '#fafafa',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0'
                }}>
                    <Text strong style={{ fontSize: 18, color: '#5ea18b' }}>
                        Total a pagar: ${cartTotal.toLocaleString('es-AR')}
                    </Text>
                </div>

                {loading ? (
                    <div style={{ padding: "40px 20px" }}>
                        <Spin tip="Generando QR..." />
                    </div>
                ) : qrCode ? (
                    <>
                        <div style={{ 
                            textAlign: "center", 
                            padding: "20px",
                            backgroundColor: '#f5f5f5',
                            borderRadius: '8px',
                            border: '1px solid #e8e8e8'
                        }}>
                            <img
                                src={qrCode}
                                alt="QR Code de Pago"
                                style={{ 
                                    maxWidth: 280, 
                                    height: "auto",
                                    borderRadius: '4px'
                                }}
                            />
                        </div>
                        <Button 
                            type="primary" 
                            onClick={generateQR}
                            style={{ width: '100%', height: 44 }}
                        >
                            Generar Nuevo QR
                        </Button>
                    </>
                ) : (
                    <Button 
                        type="primary" 
                        onClick={generateQR} 
                        loading={loading}
                        style={{ width: '100%', height: 44 }}
                    >
                        Generar QR
                    </Button>
                )}

                <Text type="secondary" style={{ fontSize: 13 }}>
                    Una vez confirmada tu compra tu Orden se prepara para el despacho en la fecha solicitada
                </Text>
            </Space>
        </Card>
    );
};

export default CartPayment;
