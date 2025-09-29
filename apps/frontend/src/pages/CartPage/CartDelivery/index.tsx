import React, { useState } from 'react';
import {
    Card,
    Row,
    Col,
    Typography,
    Radio,
    Select,
    TimePicker,
    DatePicker,
    Form,
    Input,
    Divider,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const pickupLocations = [
    { id: 'loc1', name: 'San Sebastian - Guardia', timeSlots: ['10:00', '16:00'] },
    { id: 'loc2', name: 'El Canton - Guardia', timeSlots: ['10:00',  '16:00'] },
];

const CartDelivery: React.FC = () => {
    const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
    const [form] = Form.useForm();

    // Disable all dates before today
    const disablePastDates = (current: Dayjs) => {
        if (!current) return false;

        const today = dayjs().startOf("day");
        const nextWeekStart = today.add(1, "week").startOf("week"); // Monday next week

        // Disable past dates and this week
        if (current.isBefore(nextWeekStart, "day")) {
            return true;
        }

        // Allow only Friday (5) and Saturday (6)
        const day = current.day(); // Sunday=0 ... Saturday=6
        return !(day === 5 || day === 6);
    };

    return (
        <Card title="Tipo de Entrega" bordered style={{ maxWidth: 600, margin: '0 auto' }}>
            <Row style={{ marginBottom: 16 }}>
                <Col span={24}>
                    <Radio.Group
                        value={deliveryType}
                        onChange={(e) => setDeliveryType(e.target.value)}
                        style={{ width: '100%' }}
                    >
                        <Radio.Button value="pickup" style={{ width: '50%', textAlign: 'center' }}>
                            Pickup
                        </Radio.Button>
                        <Radio.Button disabled={true} value="delivery" style={{ width: '50%', textAlign: 'center' }}>
                            Envío a domicilio
                        </Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>

            {deliveryType === 'pickup' && (
                <>
                    <Row gutter={16} style={{ marginBottom: 16 }}>
                        <Col span={24}>
                            <Text strong>Seleccioná un punto de entrega</Text>
                            <Select placeholder="Sucursal" style={{ width: '100%' }}>
                                {pickupLocations.map((loc) => (
                                    <Option key={loc.id} value={loc.id}>
                                        {loc.name}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Text strong>Elegí una fecha</Text>
                            <DatePicker
                                placeholder = "Fecha futura"
                                style={{ width: '100%' }}
                                disabledDate={disablePastDates}
                            />
                        </Col>
                        <Col span={12}>
                            <Text strong>Elegí un horario</Text>
                            <Select placeholder="Horario" style={{ width: '100%' }}>
                                {pickupLocations[0].timeSlots.map((time, idx) => (
                                    <Option key={idx} value={time}>
                                        {time}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                </>
            )}

            {deliveryType === 'delivery' && (
                <Form layout="vertical" form={form}>
                    <Form.Item label="Calle" name="street" rules={[{ required: true }]}>
                        <Input placeholder="Ej. Av. Corrientes 1234" />
                    </Form.Item>
                    <Form.Item label="Ciudad" name="city" rules={[{ required: true }]}>
                        <Input placeholder="Ej. Buenos Aires" />
                    </Form.Item>
                    <Form.Item label="Código Postal" name="zip" rules={[{ required: true }]}>
                        <Input placeholder="Ej. 1425" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Fecha deseada" name="date">
                                <DatePicker
                                    style={{ width: '100%' }}
                                    disabledDate={disablePastDates}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Horario deseado" name="time">
                                <TimePicker format="HH:mm" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            )}

            <Divider />
            <Row justify="end">
                <Col>
                    <Title level={5}>
                        {deliveryType === 'pickup' ? 'Modalidad: Retiro' : 'Modalidad: Envío'}
                    </Title>
                </Col>
            </Row>
        </Card>
    );
};

export default CartDelivery;
