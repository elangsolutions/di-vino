import { useEffect, useState } from 'react';
import { Input, Modal, Radio, Space, Typography } from 'antd';
import { useMutation } from '@apollo/client';
import { REPORT_ORDER_ISSUE } from '../queries';
import { OngoingOrder, OngoingOrderIssue } from '../../../store/orders/slice';
import { useNotify } from '../../../context/NotificationContext';

const { Text } = Typography;

export const issueReasonOptions = [
    { value: 'OTHER_RECIPIENT', label: 'Recibe otra persona' },
    { value: 'DATE_CHANGE', label: 'Cambio de fecha' },
    { value: 'CANCEL', label: 'Quiero cancelar' },
    { value: 'OTHER', label: 'Otro motivo' },
];

export const issueReasonLabels: Record<string, string> = Object.fromEntries(
    issueReasonOptions.map((option) => [option.value, option.label]),
);

type ReportIssueModalProps = {
    order: OngoingOrder | null;
    onClose: () => void;
    onReported: (orderId: string, issue: OngoingOrderIssue) => void;
};

const ReportIssueModal = ({ order, onClose, onReported }: ReportIssueModalProps) => {
    const { notifySuccess, notifyError } = useNotify();
    const [reason, setReason] = useState<string>(issueReasonOptions[0].value);
    const [message, setMessage] = useState('');
    const [reportOrderIssue, { loading }] = useMutation(REPORT_ORDER_ISSUE);

    useEffect(() => {
        if (order) {
            setReason(issueReasonOptions[0].value);
            setMessage('');
        }
    }, [order]);

    const trimmedMessage = message.trim();
    const messageRequired = reason === 'OTHER';

    const handleSubmit = async () => {
        if (!order) return;
        if (messageRequired && !trimmedMessage) {
            notifyError('Falta el motivo', 'Contanos brevemente qué pasó con tu pedido.');
            return;
        }

        try {
            const { data } = await reportOrderIssue({
                variables: {
                    input: {
                        orderId: order.id,
                        reason,
                        message: trimmedMessage || null,
                    },
                },
            });

            const issues = data?.reportOrderIssue?.issues ?? [];
            const latest = issues[issues.length - 1];
            onReported(order.id, {
                reason: latest?.reason ?? reason,
                message: latest?.message ?? trimmedMessage,
                reportedAt: latest?.reportedAt ?? new Date().toISOString(),
            });

            notifySuccess(
                'Recibimos tu mensaje',
                'Nos vamos a contactar con vos para resolverlo.',
            );
            onClose();
        } catch (error) {
            notifyError(
                'No se pudo enviar tu mensaje',
                error instanceof Error ? error.message : 'Error desconocido',
            );
        }
    };

    return (
        <Modal
            open={Boolean(order)}
            title="Tuve un problema"
            okText="Enviar"
            cancelText="Cancelar"
            confirmLoading={loading}
            onOk={handleSubmit}
            onCancel={onClose}
        >
            {order && (
                <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                    Pedido {order.externalReference}
                </Text>
            )}

            <Radio.Group value={reason} onChange={(event) => setReason(event.target.value)}>
                <Space direction="vertical" size={8}>
                    {issueReasonOptions.map((option) => (
                        <Radio key={option.value} value={option.value}>
                            {option.label}
                        </Radio>
                    ))}
                </Space>
            </Radio.Group>

            {messageRequired && (
                <Input.TextArea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Contanos qué pasó"
                    rows={3}
                    maxLength={500}
                    showCount
                    style={{ marginTop: 16 }}
                />
            )}
        </Modal>
    );
};

export default ReportIssueModal;
