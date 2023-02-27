import { gql } from "@apollo/client";


export const CREATE_USER = gql`
  mutation CreateUser ($user: UserType!) {
    createUser(user: $user) {
      id
      username 
      email
      roles {
        id
        name
      }  
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser ($user: UserType!) {
    updateUser(user: $user) {
      id
      username 
      email
      roles {
        id
        name
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser ($deleteUserId: Float!) {
    deleteUser (id: $deleteUserId) {
      username   
    }
  }
`;
