import { gql } from "@apollo/client";


export const CREATE_POI = gql`
  mutation CreatePoi ($poi: PoiType!) {
    createPoi(poi: $poi) {
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

export const UPDATE_POI = gql`
  mutation UpdatePoi ($poi: PoiType!) {
    updatePoi(poi: $poi) {
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

export const DELETE_POI = gql`
  mutation DeletePoi ($deletePoiId: Float!) {
    deletePoi (id: $deletePoiId) {
      name  
    }
  }
`;
