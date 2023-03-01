import { gql } from "@apollo/client";


export const CREATE_TYPE = gql`
  mutation CreateType($type: TypeType!) {
    createType(type: $type) {
      id
      name
      logo
      color
    }
  }
`;

export const UPDATE_TYPE = gql`
  mutation UpdateType($type: TypeType!) {
    updateType(type: $type) {
      id 
      name
      logo
      color
    }
  }
`;

export const DELETE_TYPE = gql`
  mutation DeleteType($deleteTypeId: Float!) {
    deleteType (id: $deleteTypeId) {
        name  
        logo
        color 
    }
  }
`;