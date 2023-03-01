import "./deleteTag.scss";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { GET_ALL_TAGS } from "../../../api/tag/queries";
import { DELETE_TAG } from "../../../api/tag/mutations";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import Loader from "../../loader/Loader";

type TagByIdProps = {
  id: number
  resetExpanded: () => void
};

const DeleteTag: React.FC<TagByIdProps> = ({ id, resetExpanded }: TagByIdProps) => {
  const [loading, setLoading] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);

  // DELETE
  const [
    deleteTag, { 
      error: deleteTagError,  
    }
  ] = useMutation(DELETE_TAG, {
    onCompleted() {
      setLoading(false);
    },
    refetchQueries: [
      { query: GET_ALL_TAGS }
    ],
    onError() {
      setOpenErrorModal(true);
      setLoading(false);
    },
  });

  const handleOnDelete= (id: number) => {
    setLoading(true);
      setTimeout(() => {
        deleteTag({
          variables: { deleteTagId: id }, 
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
      {openErrorModal && <ErrorModal error={deleteTagError} onModalClose={handleModalClose} />}
    </div>
  )
}

export default DeleteTag
