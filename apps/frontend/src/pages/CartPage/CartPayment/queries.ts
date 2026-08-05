import { gql } from "@apollo/client";

export const PAYMENT_CONFIG = gql`
    query PaymentConfig {
        paymentConfig {
            mode
            bypassPayment
        }
    }
`;

export const CREATE_PAYMENT_PREFERENCE = gql`
    mutation CreatePaymentPreference($amount: Float!, $description: String!, $orderId: String!) {
        createPaymentPreference(amount: $amount, description: $description, orderId: $orderId) {
            id
            qrCode
            qrCodeBase64
            amount
            description
            externalReference
        }
    }
`;
