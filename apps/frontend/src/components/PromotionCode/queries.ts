import { gql } from '@apollo/client';

export const GET_PROMOTION_CODES = gql`
  query GetPromotionCodes {
    promotionCodes {
      _id
      code
      fromDate
      toDate
      percentage
      scope
      productId
    }
  }
`;

export const GET_PROMOTION_CODE = gql`
  query GetPromotionCode($id: String!) {
    promotionCode(id: $id) {
      _id
      code
      fromDate
      toDate
      percentage
      scope
      productId
    }
  }
`;

export const ADD_PROMOTION_CODE = gql`
  mutation AddPromotionCode($input: AddPromotionCodeInput!) {
    addPromotionCode(input: $input) {
      _id
      code
      fromDate
      toDate
      percentage
      scope
      productId
    }
  }
`;

export const DELETE_PROMOTION_CODE = gql`
  mutation DeletePromotionCode($input: RemovePromotionCodeInput!) {
    deletePromotionCode(input: $input) {
      _id
      code
    }
  }
`;

export const VALIDATE_PROMOTION_CODE = gql`
  mutation ValidatePromotionCode($input: ValidatePromotionCodeInput!) {
    validatePromotionCode(input: $input) {
      valid
      message
      originalTotal
      discountAmount
      finalTotal
      promotionCode {
        _id
        code
        percentage
        scope
        productId
      }
    }
  }
`;
