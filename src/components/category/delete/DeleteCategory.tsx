//import "./deleteCategory.scss";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { GET_ALL_CATEGORIES } from "../../../api/category/queries";
import { DELETE_CATEGORY } from "../../../api/category/mutations";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import Loader from "../../loader/Loader";


type CategoryByIdProps = {
  id: number
  resetExpanded: () =>  void
};

const DeleteCategory: React.FC<CategoryByIdProps> = ({ id, resetExpanded }: CategoryByIdProps) => {
  const [loading, setLoading] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);

  // DELETE
  const [
    deleteCategory, { 
      error: deleteCategoryError,  
    }
  ] = useMutation(DELETE_CATEGORY, {
    onCompleted() {
      setLoading(false);
    },
    refetchQueries: [
      { query: GET_ALL_CATEGORIES }
    ],
    onError() {
      setOpenErrorModal(true);
      setLoading(false);
    },
  });

  const handleOnDelete= (id: number) => {
    setLoading(true);
      setTimeout(() => {
        deleteCategory({
          variables: { deleteCategoryId: id }, 
        })
        resetExpanded();
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }, 500)
  }

  return (
    <div className="delete-block">
      {loading && <Loader styleClass='delete-tag-loader' />}
      <Button onClick={() => handleOnDelete(id)}>
        <DeleteIcon className="icon-delete"  />
      </Button>
      {openErrorModal && <ErrorModal error={deleteCategoryError} onModalClose={handleModalClose} />}
    </div>
  )
}

export default DeleteCategory
