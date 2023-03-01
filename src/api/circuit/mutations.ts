import { gql } from "@apollo/client";


export const CREATE_CIRCUIT = gql`
  mutation CreateCircuit ($circuit: CircuitType!) {
    createCircuit(circuit: $circuit) {
      id
      name  
      picture
      description
      price
      category {
        id
        name
        icon
        color
      }
      pointsOfInterest {
        id
        name
        address
        latitude
        longitude
        picture
        type {
          id
          name
          logo
          color
        }
        tags {
          id
          name
          icon
        }
      }
    }
  }
`;

export const UPDATE_CIRCUIT = gql`
  mutation UpdateCircuit ($circuit: CircuitType!) {
    updateCircuit(circuit: $circuit) {
      id
      name  
      picture
      description
      price
      category {
        id
        name
        icon
        color
      }
      pointsOfInterest {
        id
        name
        address
        latitude
        longitude
        picture
        type {
          id
          name
          logo
          color
        }
        tags {
          id
          name
          icon
        }
      }
    }
  }
`;

export const DELETE_CIRCUIT = gql`
  mutation DeleteCircuit ($deleteCircuitId: Float!) {
    deleteCircuit (id: $deleteCircuitId) {
      name  
    }
  }
`;
