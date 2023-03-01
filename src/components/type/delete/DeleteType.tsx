import './deleteType.scss';
import { useState } from "react";
import { useMutation } from "@apollo/client";
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { GET_ALL_TYPES } from "../../../api/type/queries";
import { DELETE_TYPE } from "../../../api/type/mutations";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import Loader from "../../loader/Loader";

type TypeByIdProps = {
  id: number
  resetExpanded: () => void
};

const DeleteType: React.FC<TypeByIdProps> = ({ id, resetExpanded }: TypeByIdProps) => {
  const [loading, setLoading] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);

  // DELETE
  const [
    deleteType, { 
      error: deleteTypeError,  
    }
  ] = useMutation(DELETE_TYPE, {
    onCompleted() {
      setLoading(false);
    },
    refetchQueries: [
      { query: GET_ALL_TYPES }
    ],
    onError() {
      setOpenErrorModal(true);
      setLoading(false);
    },
  });

  const handleOnDelete= (id: number) => {
    setLoading(true);
      setTimeout(() => {
        deleteType({
          variables: { deleteTypeId: id }, 
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
      {loading && <Loader styleClass='delete-type-loader' />}
      <Button onClick={() => handleOnDelete(id)}>
        <DeleteIcon className="icon-delete"  />
      </Button>
      {openErrorModal && <ErrorModal error={deleteTypeError} onModalClose={handleModalClose} />}
    </div>
  )
}

export default DeleteType
