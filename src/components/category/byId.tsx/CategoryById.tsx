import { GetCategoryById } from "../../../services/category";

type CategoryByIdProps = {
  id: number
};

const CategoryById: React.FC<CategoryByIdProps> = ({ id }: CategoryByIdProps) => {
  const { categoryById, categoryByIdError, categoryByIdLoading } = GetCategoryById(id);

  if (categoryByIdError) return <div> Quelque chose s'est mal passé lors du chargement des catégories</div>
  if (categoryByIdLoading) return <div> Chargement... </div>


  return (
    <div>
      <p>Category by id : {categoryById.getCategoryById.name} </p>
    </div>
  )
}

export default CategoryById;
