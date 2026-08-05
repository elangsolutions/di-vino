import { gql } from '@apollo/client';

export const ORDER_FIELDS = gql`
  fragment OrderFields on Order {
    _id
    external_reference
    status
    allowedTransitions
    customerName
    customerEmail
    customerPhone
    createdAt
    updatedAt
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
      address {
        street
        city
        postalCode
        province
      }
    }
    issues {
      reason
      message
      reportedAt
    }
  }
`;

export const GET_ORDERS = gql`
  ${ORDER_FIELDS}
  query GetOrders {
    orders {
      ...OrderFields
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  ${ORDER_FIELDS}
  mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
    updateOrderStatus(input: $input) {
      ...OrderFields
    }
  }
`;
