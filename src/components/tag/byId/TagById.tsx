import { GetTagById } from "../../../services/tag";

type TagByIdProps = {
  id: number
};

const TagById: React.FC<TagByIdProps> = ({ id }: TagByIdProps) => {
  const { tagById, tagByIdError, tagByIdLoading } = GetTagById(id);

  if (tagByIdError) return <div>Quelque chose s'est mal passé lors du chargement du tag</div>
  if (tagByIdLoading) return <div> Chargement... </div>


  return (
    <div>
      <p>Tag by id : {tagById.getTagById.name} </p>
    </div>
  )
}

export default TagById;
