import { gql } from '@apollo/client';

export const GET_ITEM_PRICES = gql`
  query GetItemPrices {
    itemPrices {
      _id
      productId
      price
      fromDate
      toDate
      stock
      promotionCodes
    }
  }
`;

export const GET_ITEM_PRICES_BY_PRODUCT = gql`
  query GetItemPricesByProduct($productId: String!) {
    itemPricesByProduct(productId: $productId) {
      _id
      productId
      price
      fromDate
      toDate
      stock
      promotionCodes
    }
  }
`;

export const GET_ITEM_PRICE = gql`
  query GetItemPrice($id: String!) {
    itemPrice(id: $id) {
      _id
      productId
      price
      fromDate
      toDate
      stock
      promotionCodes
    }
  }
`;

export const ADD_ITEM_PRICE = gql`
  mutation AddItemPrice($input: AddItemPriceInput!) {
    addItemPrice(input: $input) {
      _id
      productId
      price
      fromDate
      toDate
      stock
      promotionCodes
    }
  }
`;

export const DELETE_ITEM_PRICE = gql`
  mutation DeleteItemPrice($input: RemoveItemPriceInput!) {
    deleteItemPrice(input: $input) {
      _id
    }
  }
`;
