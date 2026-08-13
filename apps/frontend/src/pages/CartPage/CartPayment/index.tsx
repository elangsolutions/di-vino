import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { Alert, Card, Space, Typography, Spin, Button, message, Input, Divider, Grid } from "antd";
import { useSelector } from "react-redux";
import { selectCartItems, selectCartTotal } from "../../../store/cart/slice";
import { MERCADOPAGO_ENABLED } from "../../../config/payment";
import { CREATE_PAYMENT_PREFERENCE, PAYMENT_CONFIG } from "./queries";
import { VALIDATE_PROMOTION_CODE } from "../../../components/Promotion/queries";
import { useEvaluatePromotions } from "../../../components/Promotion/useEvaluatePromotions";
import { describeApplication } from "../../../components/Promotion/utils";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface AppliedPromotion {
    code: string;
    discountAmount: number;
    finalTotal: number;
}

type CartPaymentProps = {
    onBypassChange?: (bypass: boolean) => void;
};

const CartPayment = ({ onBypassChange }: CartPaymentProps) => {
    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const { evaluation: promoEvaluation } = useEvaluatePromotions();
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [promoInput, setPromoInput] = useState("");
    const [appliedPromotion, setAppliedPromotion] = useState<AppliedPromotion | null>(null);
    const cartSignatureRef = useRef(`${cartItems.length}:${cartTotal}`);

    const { data: configData, loading: configLoading } = useQuery(PAYMENT_CONFIG);
    const bypassPayment = Boolean(configData?.paymentConfig?.bypassPayment);

    useEffect(() => {
        onBypassChange?.(bypassPayment);
    }, [bypassPayment, onBypassChange]);

    const [validatePromotionCode, { loading: validatingPromo }] = useMutation(VALIDATE_PROMOTION_CODE);
    const [createPaymentPreference] = useMutation(CREATE_PAYMENT_PREFERENCE, {
        onCompleted: (data) => {
            const preference = data.createPaymentPreference;
            setQrCode(preference.qrCodeBase64);
            setPaymentUrl(preference.qrCode || null);
            setLoading(false);
            message.success("QR generado exitosamente");
        },
        onError: (error) => {
            message.error("Error al crear el QR de pago");
            console.error("Error:", error);
            setLoading(false);
        },
    });

    const autoDiscount = Number(promoEvaluation.discountAmount) || 0;
    const totalAfterAuto = Math.max(0, cartTotal - autoDiscount);
    const finalTotal = appliedPromotion
        ? Math.max(0, totalAfterAuto - appliedPromotion.discountAmount)
        : totalAfterAuto;

    const generateQR = async (amount = finalTotal, promoCode?: string) => {
        setLoading(true);
        const orderId = `order_${Date.now()}`;
        const code = promoCode ?? appliedPromotion?.code;
        const description = code
            ? `Pedido - ${cartItems.length} items (${code})`
            : `Pedido - ${cartItems.length} items`;

        await createPaymentPreference({
            variables: {
                amount,
                description,
                orderId,
            },
        });
    };

    useEffect(() => {
        if (bypassPayment || configLoading) {
            setQrCode(null);
            setPaymentUrl(null);
            return;
        }

        const signature = `${cartItems.length}:${cartTotal}:${autoDiscount}`;
        if (signature !== cartSignatureRef.current) {
            cartSignatureRef.current = signature;
            setAppliedPromotion(null);
            setPromoInput("");
        }

        if (cartTotal > 0 && cartItems.length > 0) {
            void generateQR(totalAfterAuto);
            return;
        }

        setQrCode(null);
        setPaymentUrl(null);
        setPromoInput("");
        setAppliedPromotion(null);
        // Intentionally omit generateQR: only regenerate when cart/config inputs change.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartTotal, cartItems.length, autoDiscount, bypassPayment, configLoading]);

    const buildCartItemsInput = () =>
        cartItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product?.price || 0,
        }));

    const handleApplyPromotion = async () => {
        if (!promoInput.trim()) {
            message.warning("Ingresá un código promocional");
            return;
        }

        try {
            const { data } = await validatePromotionCode({
                variables: {
                    input: {
                        code: promoInput.trim(),
                        items: buildCartItemsInput(),
                    },
                },
            });

            const result = data?.validatePromotionCode;
            if (!result?.valid) {
                message.error(result?.message || "Código promocional inválido");
                setAppliedPromotion(null);
                setQrCode(null);
                setPaymentUrl(null);
                return;
            }

            const discountAmount = Number(result.discountAmount) || 0;
            const nextFinalTotal = Math.max(0, totalAfterAuto - discountAmount);

            setAppliedPromotion({
                code: (result.promotion?.code || promoInput).trim().toUpperCase(),
                discountAmount,
                finalTotal: nextFinalTotal,
            });
            setQrCode(null);
            setPaymentUrl(null);
            message.success(result.message || "Código aplicado");
        } catch (error) {
            message.error("Error al validar el código promocional");
            console.error("Error:", error);
        }
    };

    const handleRemovePromotion = () => {
        setAppliedPromotion(null);
        setPromoInput("");
        setQrCode(null);
        setPaymentUrl(null);
    };

    if (configLoading) {
        return (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <Spin tip="Cargando configuración de pago..." />
            </div>
        );
    }

    if (bypassPayment) {
        return (
            <Alert
                type="info"
                showIcon
                message="Modo testing — pago omitido"
                description={
                    <>
                        <Text>
                            El flujo de Mercado Pago está desactivado. Al confirmar el pedido se
                            marcará como <Text strong>pagado</Text>. Continuá con entrega y
                            contacto.
                        </Text>
                        {cartTotal > 0 && (
                            <div style={{ marginTop: 12 }}>
                                {autoDiscount > 0 && (
                                    <div style={{ marginBottom: 4 }}>
                                        <Text type="success">
                                            Promociones: -${autoDiscount.toLocaleString("es-AR")}
                                        </Text>
                                    </div>
                                )}
                                <Text strong style={{ color: "#5ea18b" }}>
                                    Total del pedido: ${finalTotal.toLocaleString("es-AR")}
                                </Text>
                            </div>
                        )}
                    </>
                }
                style={{ maxWidth: 480, margin: "0 auto" }}
            />
        );
    }

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
                    Pago
                </Title>

                <div style={{
                    backgroundColor: '#fafafa',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0',
                    textAlign: 'left',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text>Subtotal</Text>
                        <Text>${cartTotal.toLocaleString('es-AR')}</Text>
                    </div>
                    {promoEvaluation.applications.map((application) => (
                        <div
                            key={application.promotion._id}
                            style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}
                        >
                            <Text type="success">
                                {application.promotion.name} ({describeApplication(application)})
                            </Text>
                            <Text type="success">-${application.discountAmount.toLocaleString('es-AR')}</Text>
                        </div>
                    ))}
                    {appliedPromotion && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text type="success">Descuento ({appliedPromotion.code})</Text>
                            <Text type="success">-${appliedPromotion.discountAmount.toLocaleString('es-AR')}</Text>
                        </div>
                    )}
                    <Divider style={{ margin: '8px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong style={{ fontSize: 16, color: '#5ea18b' }}>Total a pagar</Text>
                        <Text strong style={{ fontSize: 16, color: '#5ea18b' }}>
                            ${finalTotal.toLocaleString('es-AR')}
                        </Text>
                    </div>
                </div>

                <div style={{ textAlign: 'left', width: '100%' }}>
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>
                        Código promocional
                    </Text>
                    <Space.Compact style={{ width: '100%' }}>
                        <Input
                            placeholder="Ej: VERANO20"
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                            disabled={Boolean(appliedPromotion)}
                            onPressEnter={handleApplyPromotion}
                            style={{ textTransform: 'uppercase' }}
                        />
                        {appliedPromotion ? (
                            <Button onClick={handleRemovePromotion}>Quitar</Button>
                        ) : (
                            <Button
                                type="primary"
                                onClick={handleApplyPromotion}
                                loading={validatingPromo}
                            >
                                Aplicar
                            </Button>
                        )}
                    </Space.Compact>
                </div>

                <Title level={5} style={{ marginBottom: 0 }}>
                    {isMobile ? "Pagá con Mercado Pago" : "Escaneá el QR para pagar"}
                </Title>

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
                        {isMobile && paymentUrl && (
                            <Button
                                type="primary"
                                href={paymentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ width: '100%', height: 44 }}
                            >
                                Abrir Mercado Pago
                            </Button>
                        )}
                        <Button
                            type={isMobile ? "default" : "primary"}
                            onClick={() => void generateQR()}
                            style={{ width: '100%', height: 44 }}
                        >
                            Generar Nuevo QR
                        </Button>
                    </>
                ) : (
                    <Button
                        type="primary"
                        onClick={() => void generateQR()}
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
