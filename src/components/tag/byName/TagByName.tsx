import React from "react";
import { GetTagByName } from "../../../services/tag";

type TagByNameProps = {
  name: string
};

const TagById: React.FC<TagByNameProps> = ({ name }: TagByNameProps) => {
  const { tagByName, tagByNameError, tagByNameLoading } = GetTagByName(name);

  if (tagByNameError) return <div>Quelque chose s'est mal passé lors du chargement du tag</div>
  if (tagByNameLoading) return <div> Chargement... </div>


  return (
    <div>
      <p>Tag by name : {tagByName.getTagByName.name} </p>
    </div>
  )
}

export default TagById;