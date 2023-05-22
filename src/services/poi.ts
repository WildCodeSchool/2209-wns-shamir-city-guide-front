import { useQuery } from "@apollo/client";
import { 
  GET_ALL_POIS, 
  GET_POI_BY_ID, 
  GET_POI_BY_NAME,
  GET_POIS_BY_CITY 
} from "../api/poi/queries";

/** By default, ApolloClient caches the results of your queries, which may result in cached results being returned instead of a new request to the server. The fetchPolicy option lets you control this behavior and specify how ApolloClient should handle caching.
To cause a query to not use the cache, you can use the network-only value for the fetchPolicy option. This will force ApolloClient to execute a request to the server each time the request is triggered, without using caching. */

export const GetAllPois = () => {
  const { data: allPois, error: poisError, loading: poisLoading } = useQuery(GET_ALL_POIS, {
    fetchPolicy: "network-only",
  });
  return { 
    allPois, 
    poisError, 
    poisLoading 
  };
}

export const GetPoiById = (id: number) => {
  const { data: poiById, error: poiByIdError, loading: poiByIdLoading } = useQuery(GET_POI_BY_ID, {
    variables: {
      id
    }
  });
  return { 
    poiById, 
    poiByIdError, 
    poiByIdLoading 
  };
}

export const GetPoiByName = (name: string) => {
  const { data: poiByName, error: poiByNameError, loading: poiByNameLoading } = useQuery(GET_POI_BY_NAME, {
    variables: {
      name
    }
  });
  return { 
    poiByName, 
    poiByNameError, 
    poiByNameLoading 
  };
}

export const GetPoisByCity = (cityId: number) => {
  const { data: poisByCity, error: poisByCityError, loading: poisByCityLoading } = useQuery(GET_POIS_BY_CITY, {
    fetchPolicy: "network-only",
    variables: {
      cityId: cityId
    }
  }); 
  return { 
    poisByCity, 
    poisByCityError, 
    poisByCityLoading 
  };
}