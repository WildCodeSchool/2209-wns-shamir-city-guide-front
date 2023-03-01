import React from "react";
import { GetCategoryByName } from "../../../services/category";

type CategoryByNameProps = {
  name: string
};

const CategoryByName: React.FC<CategoryByNameProps> = ({ name }: CategoryByNameProps) => {
  const { categoryByName, categoryByNameError, categoryByNameLoading } = GetCategoryByName(name);

  if (categoryByNameError) return <div>Quelque chose s'est mal passé lors du chargement de la catégorie </div>
  if (categoryByNameLoading) return <div> Chargement... </div>


  return (
    <div>
      <p>Category by name : {categoryByName.getCategoryByName.name} </p>
    </div>
  )
}

export default CategoryByName;