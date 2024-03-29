import React, { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";

import { UPDATE_USER } from "../../../api/user/mutations";
import { GET_ALL_USERS } from "../../../api/user/queries";

import UserRolesTransfertList from "../../userRolesTransfertList/UserRolesTransfertList";
import DeleteUser from "../delete/DeleteUser";
import Loader from "../../loader/Loader";
import ErrorModal from "../../modal/serverError/ServerErrorModal";

import { 
  validateUsername, 
  validateEmail
} from "../../../utils/validationForms/userValidation";
import { IAuthenticatedUser, IUser } from "../../../types/user";

import { TextField } from "@mui/material";
import Button from '@mui/material/Button';

import {
  textFielPropsStyle,
  labelTextFieldPropsStyle,
  formButtonStyle,
  disabledFormButtonStyle
} from "../../../style/customStyles";
import { IRole } from "../../../types/role";

type TypeFormProps = {
  user: IAuthenticatedUser
  allRoles: IRole[]
  resetExpanded: () => void
};

const UpdateUser: React.FC<TypeFormProps> = ({ user, allRoles, resetExpanded }: TypeFormProps) => {  
  const [userToUpdate, setUserToUpdate] = useState<IUser>({
    id: Number(user.id),
    username: user.username,
    email: user.email
  });
  
  const [roleToUpdate] = useState<IRole[]>(user.roles);

  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);

  // Update user username and email
  const [
    updateUser, { 
      error: updateUserError, 
    }
  ] = useMutation(UPDATE_USER, {
    refetchQueries: [
      { query: GET_ALL_USERS }
    ],
    onCompleted() {
      setLoading(false);
      resetExpanded();
    },
    onError() {      
      setOpenErrorModal(true);
      setLoading(false);
    },
  });

  const handleOnUpdate = async (e: FormEvent<HTMLFormElement>, userToUpdate: IUser) => {
    e.preventDefault();

    if (!isThereAnyError()) {
      setLoading(true);
      setTimeout(() => {
        updateUser({ 
          variables: { 
            user: userToUpdate, 
          },
        });
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }, 500)
    } else return;
  }

  const changeUsername = async (value: string) => {
    setUserToUpdate({...userToUpdate, username: value});
    const errorUsername = await validateUsername({ username: value });
    if (errorUsername) setUsernameError(errorUsername);
    else setUsernameError("");
  } 

  const changeEmail = async (value: string) => {
    setUserToUpdate({...userToUpdate, email: value});
    const errorEmail = await validateEmail({ email: value });
    
    if (errorEmail) {
      setEmailError(errorEmail);
    } 
    else setEmailError("");
  }

  const isThereAnyError = () => (
    userToUpdate.username.length === 0 ||
    userToUpdate.email.length === 0 ||
    usernameError || 
    emailError
  );  

  return (
    <div className="update-form">
      <form 
        autoComplete="off"
        onSubmit={e => handleOnUpdate(e, userToUpdate)}
      >
        <div className='fields'>
          <TextField  
            label="Username" 
            variant="filled" 
            inputProps={{style: textFielPropsStyle}}
            InputLabelProps={{style: labelTextFieldPropsStyle}} 
            onChange={(e) => changeUsername(e.target.value.trim())}
            className='text-field'
            value={userToUpdate.username}
            error={usernameError?.length ? true : false}
            helperText={usernameError.length ? usernameError : ""}
          />
          <TextField  
            label="Email" 
            variant="filled" 
            inputProps={{style: textFielPropsStyle}}
            InputLabelProps={{style: labelTextFieldPropsStyle}} 
            onChange={(e) => changeEmail(e.target.value.trim())}
            className='text-field'
            value={userToUpdate.email} 
            error={emailError?.length ? true : false}
            helperText={emailError.length ? emailError : ""}
          />
          </div>
          <div className='button-user-update'>
            <div className='update-btn-loading-block'>
              <Button 
                className='update-btn'  
                style={isThereAnyError() ? disabledFormButtonStyle : formButtonStyle}  
                type="submit"
                variant="contained"
                disabled={isThereAnyError() ? true : false}
              >
                Mettre à jour
              </Button>
              {loading && <Loader styleClass='update-tag-loader' />}
            </div>
        </div>
      </form>
      <UserRolesTransfertList userId={userToUpdate.id} allRoles={allRoles} actualUserRoles={roleToUpdate} resetExpanded={resetExpanded} />
      {openErrorModal && <ErrorModal error={updateUserError} onModalClose={handleModalClose} />}
      <DeleteUser id={Number(user.id)} username={user.username} resetExpanded={resetExpanded} />
    </div>
  )
}

export default UpdateUser;
