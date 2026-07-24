import React, { useEffect } from 'react';
import {
    Alert,
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
    Tooltip,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import {
    setDeliveryType as setDeliveryTypeAction,
    setPickupDetails,
    setDeliveryDetails,
} from '../../../store/delivery/slice.ts';

const { Title, Text } = Typography;
const { Option } = Select;

const pickupLocations = [
    { id: 'loc1', name: 'San Sebastian - Guardia', timeSlots: ['10:00', '16:00'] },
    { id: 'loc2', name: 'El Canton - Guardia', timeSlots: ['10:00',  '16:00'] },
];

// height:'auto' + minHeight (instead of a fixed height) lets the label wrap to a
// second line on narrow screens without overflowing or clipping.
const radioButtonStyle: React.CSSProperties = {
    minHeight: 44,
    height: 'auto',
    lineHeight: 1.3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    whiteSpace: 'normal',
    padding: '8px 12px',
};

const CartDelivery: React.FC = () => {
    const dispatch = useDispatch();
    const delivery = useSelector((state: RootState) => state.delivery);
    const { deliveryType, pickup, delivery: deliveryDetails } = delivery;
    const [form] = Form.useForm();

    // Keep the form fields in sync if the user navigates back to this step.
    useEffect(() => {
        form.setFieldsValue({
            street: deliveryDetails.street,
            city: deliveryDetails.city,
            zip: deliveryDetails.zip,
            date: deliveryDetails.date ? dayjs(deliveryDetails.date) : undefined,
            time: deliveryDetails.time ? dayjs(deliveryDetails.time, 'HH:mm') : undefined,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            <div style={{ display: 'flex', width: '100%', marginBottom: 16 }}>
                <Radio.Group
                    value={deliveryType}
                    onChange={(e) => dispatch(setDeliveryTypeAction(e.target.value))}
                    style={{ width: '100%', display: 'flex' }}
                >
                    <span style={{ flex: 1, display: 'flex' }}>
                        <Radio.Button value="pickup" style={{ ...radioButtonStyle, width: '100%' }}>
                            Pickup
                        </Radio.Button>
                    </span>
                    <span style={{ flex: 1, display: 'flex' }}>
                        <Tooltip title="Disponible próximamente">
                            <Radio.Button disabled value="delivery" style={{ ...radioButtonStyle, width: '100%' }}>
                                Envío a domicilio
                            </Radio.Button>
                        </Tooltip>
                    </span>
                </Radio.Group>
            </div>

            {deliveryType === 'pickup' && (
                <>
                    <Row gutter={16} style={{ marginBottom: 16 }}>
                        <Col span={24}>
                            <Text strong>Seleccioná un punto de entrega</Text>
                            <Select
                                placeholder="Sucursal"
                                style={{ width: '100%', marginTop: 4 }}
                                size="large"
                                value={pickup.locationId ?? undefined}
                                onChange={(value) => dispatch(setPickupDetails({ locationId: value }))}
                            >
                                {pickupLocations.map((loc) => (
                                    <Option key={loc.id} value={loc.id}>
                                        {loc.name}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} style={{ marginBottom: 16 }}>
                            <Text strong>Elegí una fecha</Text>
                            <DatePicker
                                placeholder="Fecha futura"
                                style={{ width: '100%', marginTop: 4 }}
                                size="large"
                                disabledDate={disablePastDates}
                                value={pickup.date ? dayjs(pickup.date) : undefined}
                                onChange={(date) =>
                                    dispatch(setPickupDetails({ date: date ? date.toISOString() : null }))
                                }
                            />
                        </Col>
                        <Col xs={24} sm={12}>
                            <Text strong>Elegí un horario</Text>
                            <Select
                                placeholder="Horario"
                                style={{ width: '100%', marginTop: 4 }}
                                size="large"
                                value={pickup.time ?? undefined}
                                onChange={(value) => dispatch(setPickupDetails({ time: value }))}
                            >
                                {pickupLocations[0].timeSlots.map((time, idx) => (
                                    <Option key={idx} value={time}>
                                        {time}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                    {!(pickup.locationId && pickup.date && pickup.time) && (
                        <Text type="secondary" style={{ display: 'block', marginTop: 12, fontSize: 13 }}>
                            Completá sucursal, fecha y horario para continuar.
                        </Text>
                    )}
                    <Alert
                        type="info"
                        showIcon
                        style={{ marginTop: 16 }}
                        message="El pedido puede ser retirado durante el transcurso que el reparto esté despachando, esto puede durar hasta 1 hora, luego se retira el reparto. En caso de tener otro turno, podrá retirarlo en ese horario."
                    />
                </>
            )}

            {deliveryType === 'delivery' && (
                <Form
                    layout="vertical"
                    form={form}
                    onValuesChange={(_, values) => {
                        dispatch(
                            setDeliveryDetails({
                                street: values.street ?? deliveryDetails.street,
                                city: values.city ?? deliveryDetails.city,
                                zip: values.zip ?? deliveryDetails.zip,
                                date: values.date ? values.date.toISOString() : deliveryDetails.date,
                                time: values.time ? values.time.format('HH:mm') : deliveryDetails.time,
                            })
                        );
                    }}
                >
                    <Form.Item label="Calle" name="street" rules={[{ required: true }]}>
                        <Input placeholder="Ej. Av. Corrientes 1234" size="large" />
                    </Form.Item>
                    <Form.Item label="Ciudad" name="city" rules={[{ required: true }]}>
                        <Input placeholder="Ej. Buenos Aires" size="large" />
                    </Form.Item>
                    <Form.Item label="Código Postal" name="zip" rules={[{ required: true }]}>
                        <Input placeholder="Ej. 1425" size="large" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Fecha deseada" name="date">
                                <DatePicker
                                    style={{ width: '100%' }}
                                    size="large"
                                    disabledDate={disablePastDates}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Horario deseado" name="time">
                                <TimePicker format="HH:mm" style={{ width: '100%' }} size="large" />
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
