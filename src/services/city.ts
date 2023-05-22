import { useQuery } from "@apollo/client";
import { 
  GET_ALL_CITIES, 
  GET_CITY_BY_ID, 
  GET_CITY_BY_NAME,

} from "../api/city/qGET_CITIES_BY_USERNAMEueries";


export const GetAllCities = () => {
  const { data: allCities, error: citiesError, loading: citiesLoading } = useQuery(GET_ALL_CITIES);
  return { 
    allCities, 
    citiesError, 
    citiesLoading 
  };
}

export const GetCityById = (id: number) => {
  const { data: cityById, error: cityByIdError, loading: cityByIdLoading } = useQuery(GET_CITY_BY_ID, {
    variables: {
      id
    }
  });
  return { 
    cityById, 
    cityByIdError, 
    cityByIdLoading 
  };
}

export const GetCityByName = (name: string) => {
  const { data: cityByName, error: cityByNameError, loading: cityByNameLoading } = useQuery(GET_CITY_BY_NAME, {
    variables: {
      name
    }
  });
  return { 
    cityByName, 
    cityByNameError, 
    cityByNameLoading 
  };
}

export const GetCitiesByUsername = (username: string) => {
    const { data: citiesByUsername, error: citiesByUsernameError, loading: citiesByUsernameLoading } = useQuery(GET_CITIES_BY_USERNAME, {
      variables: {
        username
      }
    });
    return {
      citiesByUsername,
      citiesByUsernameError,
      citiesByUsernameLoading
    };
}