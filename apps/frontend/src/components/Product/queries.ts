import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      _id
      name
      details
      category
      image
      unitsPerBulk
      activeItemPrice {
        _id
        price
        stock
        fromDate
        toDate
      }
    }
  }
`;

export const GET_AVAILABLE_PRODUCTS = gql`
  query GetAvailableProducts {
    availableProducts {
      _id
      name
      details
      category
      image
      unitsPerBulk
      activeItemPrice {
        _id
        price
        stock
        fromDate
        toDate
        promotionCodes
      }
    }
  }
`;

export const ADD_PRODUCT = gql`
  mutation AddProduct($input: AddProductInput!) {
    addProduct(input: $input) {
      _id
      name
      details
      category
      price
      image
      unitsPerBulk
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    product(id: $id) {
      _id
      name
      price
      category
      details
      image
      unitsPerBulk
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($input: RemoveProductInput!) {
    deleteProduct(input: $input) {
      _id
      name
    }
  }
`;