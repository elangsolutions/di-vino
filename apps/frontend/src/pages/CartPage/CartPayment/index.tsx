import { QRCodeCanvas } from "qrcode.react";
import {Card, Space, Typography} from "antd";
const { Title, Text, Link } = Typography;

type PaymentQRProps = {
    paymentLink: string;
    amount: number;
};

const CartPayment =({ paymentLink, amount }: PaymentQRProps)=> {
    return (
        <Card
            bordered
            style={{
                maxWidth: 400,
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

                <QRCodeCanvas
                    value={paymentLink}
                    size={220}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                    includeMargin
                />
                <Text>
                    O hacé click{" "}
                    <Link href={paymentLink} target="_blank" rel="noopener noreferrer">
                        aquí
                    </Link>{" "}
                    para pagar <b>${amount}</b>.
                </Text>
                <Text>
                    Una vez confirmada tu compra tu Orden se prepara para el despacho en la fecha solicitada
                </Text>
            </Space>
        </Card>
    );
}

export default CartPayment;
