import { gql } from "@apollo/client";


export const GET_ALL_CIRCUITS = gql`
  query GetAllCircuits {
    getAllCircuits {
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

export const GET_CIRCUITS_BY_ID = gql`
  query GetCircuitById ($id: Float!) {
    getCircuitById (id: $id) {
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

export const GET_CIRCUIT_BY_NAME = gql`
  query GetCircuitByName ($name: String!) {
    getCircuitByName (name: $name) {
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