import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      _id
      name
      price
      category
      image
    }
  }
`;

export const ADD_PRODUCT = gql`
  mutation AddProduct($input: AddProductInput!) {
    addProduct(input: $input) {
      _id
      name
      category
      price
      image
    }
  }
`;
