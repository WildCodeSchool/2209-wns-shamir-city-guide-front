import { useState } from "react";
import { useMutation } from "@apollo/client";
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { GET_ALL_USERS } from "../../../api/user/queries";
import { DELETE_USER } from "../../../api/user/mutations";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import Loader from "../../loader/Loader";

type UserByIdProps = {
  id: number
  resetExpanded: () => void
};

const DeleteUser: React.FC<UserByIdProps> = ({ id, resetExpanded }: UserByIdProps) => {
  const [loading, setLoading] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);

  // DELETE
  const [
    deleteUser, { 
      error: deleteUserError,  
    }
  ] = useMutation(DELETE_USER, {
    onCompleted() {
      setLoading(false);
    },
    refetchQueries: [
      { query: GET_ALL_USERS }
    ],
    onError() {
      setOpenErrorModal(true);
      setLoading(false);
    },
  });

  const handleOnDelete= (id: number) => {
    setLoading(true);
      setTimeout(() => {
        deleteUser({
          variables: { deleteUserId: id }, 
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
      {loading && <Loader styleClass='delete-user-loader' />}
      <Button onClick={() => handleOnDelete(id)}>
        <DeleteIcon className="icon-delete"  />
      </Button>
      {openErrorModal && <ErrorModal error={deleteUserError} onModalClose={handleModalClose} />}
    </div>
  )
}

export default DeleteUser
