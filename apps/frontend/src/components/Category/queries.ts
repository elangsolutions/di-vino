import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      _id
      name
      description
    }
  }
`;

export const ADD_CATEGORY = gql`
  mutation AddCategory($input: AddCategoryInput!) {
    addCategory(input: $input) {
      _id
      name
      description
    }
  }
`;

export const GET_CATEGORY = gql`
  query GetCategory($id: String!) {
    category(id: $id) {
      _id
      name
      description
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($input: RemoveCategoryInput!) {
    deleteCategory(input: $input) {
      _id
      name
    }
  }
`;
