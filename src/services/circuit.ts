import { useQuery } from "@apollo/client";
import { 
  GET_ALL_CIRCUITS, 
  GET_CIRCUITS_BY_ID, 
  GET_CIRCUIT_BY_NAME 
} from "../api/circuit/queries";

/** By default, ApolloClient caches the results of your queries, which may result in cached results being returned instead of a new request to the server. The fetchPolicy option lets you control this behavior and specify how ApolloClient should handle caching.
To cause a query to not use the cache, you can use the network-only value for the fetchPolicy option. This will force ApolloClient to execute a request to the server each time the request is triggered, without using caching. */

export const GetAllCircuits = () => {
  const { data: allCircuits, error: circuitsError, loading: circuitsLoading } = useQuery(GET_ALL_CIRCUITS, {
    fetchPolicy: "network-only",
  });
  return { 
    allCircuits, 
    circuitsError, 
    circuitsLoading 
  };
}

export const GetCircuitsById = (id: number) => {
  const { data: circuitById, error: circuitByIdError, loading: circuitByIdLoading } = useQuery(GET_CIRCUITS_BY_ID, {
    variables: {
      id
    }
  });
  return { 
    circuitById, 
    circuitByIdError, 
    circuitByIdLoading 
  };
}

export const GetCircuitByName = (name: string) => {
  const { data: circuitByName, error: circuitByNameError, loading: circuitByNameLoading } = useQuery(GET_CIRCUIT_BY_NAME, {
    variables: {
      name
    }
  });
  return { 
    circuitByName, 
    circuitByNameError, 
    circuitByNameLoading 
  };
}