import { gql } from "@apollo/client";


export const CREATE_ROLE = gql`
  mutation CreateRole ($role: RoleType!) {
    createRole(role: $role) {
      id
      name
    }
  }
`;

export const DELETE_ROLE = gql`
  mutation DeleteRole ($deleteRoleId: Float!) {
    deleteRole (id: $deleteRoleId) {
      name  
    }
  }
`;
