import { gql } from "@apollo/client";


export const CREATE_CITY = gql`
  mutation CreateCity ($city: CityType!) {
    createCity(city: $city) {
      id
      name
      latitude
      longitude
      picture
      user {
        id
        username
        email
      }
    }
  }
`;

export const UPDATE_CITY = gql`
  mutation UpdateCity ($city: CityType!) {
    updateCity(city: $city) {
      id
      name
      latitude
      longitude
      picture
      user {
        id
        username
        email
      }
    }
  }
`;

export const DELETE_CITY = gql`
  mutation DeleteCity ($deleteCityId: Float!) {
    deleteCity (id: $deleteCityId) {
      name  
    }
  }
`;
