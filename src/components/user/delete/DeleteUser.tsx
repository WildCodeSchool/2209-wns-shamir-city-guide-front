import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useAppSelector } from "../../../features/store";
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { GET_ALL_USERS } from "../../../api/user/queries";
import { DELETE_USER } from "../../../api/user/mutations";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import Loader from "../../loader/Loader";
import { disabledFormButtonStyle } from "../../../style/customStyles";

type UserByIdProps = {
  id: number
  username: string
  resetExpanded: () => void
};

const DeleteUser: React.FC<UserByIdProps> = ({ id, username, resetExpanded }: UserByIdProps) => {
  const [loading, setLoading] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);
  const userSelector = useAppSelector((state) => state.userReducer.user);
  const selectorUsername = userSelector.infos.username;


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
    <div className={username === selectorUsername ? "delete-block-disabled " : "delete-block"}>
      <Button 
        disabled={username === selectorUsername ? true : false} 
        onClick={() => handleOnDelete(id)}
      >
        <DeleteIcon  className="icon-delete"  />
      </Button>
      {loading && <Loader styleClass='delete-user-loader' />}
      {openErrorModal && <ErrorModal error={deleteUserError} onModalClose={handleModalClose} />}
    </div>
  )
}

export default DeleteUser
