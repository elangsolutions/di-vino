import { gql } from '@apollo/client';

export const GET_ORDER = gql`
  query GetOrder($id: String!) {
    order(id: $id) {
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
      }
      issues {
        reason
        message
        reportedAt
      }
    }
  }
`;

export const REPORT_ORDER_ISSUE = gql`
  mutation ReportOrderIssue($input: ReportOrderIssueInput!) {
    reportOrderIssue(input: $input) {
      _id
      status
      issues {
        reason
        message
        reportedAt
      }
    }
  }
`;
