import { gql } from '@apollo/client';

export const PROMOTION_FIELDS = gql`
  fragment PromotionFields on Promotion {
    _id
    name
    type
    fromDate
    toDate
    rewardType
    percentage
    fixedPrice
    scope
    productId
    categoryId
    categoryName
    code
  }
`;

export const GET_PROMOTIONS = gql`
  ${PROMOTION_FIELDS}
  query GetPromotions {
    promotions {
      ...PromotionFields
    }
  }
`;

export const GET_PROMOTION = gql`
  ${PROMOTION_FIELDS}
  query GetPromotion($id: String!) {
    promotion(id: $id) {
      ...PromotionFields
    }
  }
`;

export const GET_ACTIVE_PROMOTIONS = gql`
  ${PROMOTION_FIELDS}
  query GetActivePromotions {
    activePromotions {
      ...PromotionFields
    }
  }
`;

export const ADD_PROMOTION = gql`
  ${PROMOTION_FIELDS}
  mutation AddPromotion($input: AddPromotionInput!) {
    addPromotion(input: $input) {
      ...PromotionFields
    }
  }
`;

export const DELETE_PROMOTION = gql`
  mutation DeletePromotion($input: RemovePromotionInput!) {
    deletePromotion(input: $input) {
      _id
      name
    }
  }
`;

export const EVALUATE_PROMOTIONS = gql`
  ${PROMOTION_FIELDS}
  query EvaluatePromotions($input: EvaluatePromotionsInput!) {
    evaluatePromotions(input: $input) {
      originalTotal
      discountAmount
      finalTotal
      applications {
        matchingQuantity
        boxes
        remainderQuantity
        unitsPerBulk
        originalSubtotal
        promotionalSubtotal
        discountAmount
        promotion {
          ...PromotionFields
        }
      }
    }
  }
`;

export const VALIDATE_PROMOTION_CODE = gql`
  ${PROMOTION_FIELDS}
  mutation ValidatePromotionCode($input: ValidatePromotionCodeInput!) {
    validatePromotionCode(input: $input) {
      valid
      message
      originalTotal
      discountAmount
      finalTotal
      promotion {
        ...PromotionFields
      }
    }
  }
`;
