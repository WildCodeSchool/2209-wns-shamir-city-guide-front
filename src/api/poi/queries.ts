import { gql } from "@apollo/client";


export const GET_ALL_POIS = gql`
  query GetAllPois {
    getAllPois {
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
`;

export const GET_POI_BY_ID = gql`
  query GetPoiById ($id: Float!) {
    getPoiById (id: $id) {
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
`;

export const GET_POI_BY_NAME = gql`
  query GetPoiByName ($name: String!) {
    getPoiByName (name: $name) {
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
`;