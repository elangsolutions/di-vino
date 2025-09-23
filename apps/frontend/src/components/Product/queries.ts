import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      _id
      name
      details
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
      details
      category
      price
      image
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