import { gql } from '@apollo/client';

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderDraftInput!) {
    createOrder(input: $input) {
      _id
      external_reference
      status
      customerName
      customerEmail
      customerPhone
      createdAt
      items {
        productId
        title
        price
        quantity
      }
      delivery {
        type
        locationId
        scheduledDate
        timeSlot
      }
    }
  }
`;
