import { gql } from "@apollo/client";


export const CREATE_CATEGORY = gql`
  mutation CreateCategory ($category: CategoryType!) {
    createCategory(category: $category) {
      id
      name
      color
      icon
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory ($category: CategoryType!) {
    updateCategory(category: $category) {
      id 
      name
      color
      icon
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory ($deleteCategoryId: Float!) {
    deleteCategory (id: $deleteCategoryId) {
      name  
      icon 
    }
  }
`;
