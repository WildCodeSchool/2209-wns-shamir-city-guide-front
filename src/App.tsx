import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import ITag from "./types/ITag";

const GET_ALL_TAGS = gql`
  query {
    getAllTags {
      name
    }
  }
`;

function App() {
  const [tags, setTags] = useState<ITag[]>([]);

  const { loading, error } = useQuery(GET_ALL_TAGS, {
    onCompleted: (data) => {
      setTags(data.getAllTags);
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log("All tags =>", tags);

  return <div className="App"></div>;
}

export default App;
