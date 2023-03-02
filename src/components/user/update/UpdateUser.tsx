import React, { FormEvent, useState } from "react";
import { ApolloError, useMutation } from "@apollo/client";

import { UPDATE_USER } from "../../../api/user/mutations";
import { GET_ALL_USERS } from "../../../api/user/queries";

import { GetAllRoles } from "../../../services/role";

import DeleteUser from "../delete/DeleteUser";
import Loader from "../../loader/Loader";
import ErrorModal from "../../modal/serverError/ServerErrorModal";

import { 
  validateUsername, 
  validateEmail, 
  validateRolesArray 
} from "../../../utils/validationForms/userValidation";
import { IAuthenticatedUser } from "../../../types/user";
import { Colors } from "../../../utils/constants";

import { TextField } from "@mui/material";
import Button from '@mui/material/Button';

import {
  textFielPropsStyle,
  labelTextFieldPropsStyle,
  formButtonStyle,
  disabledFormButtonStyle
} from "../../../style/customStyles";

type TypeFormProps = {
  user: IAuthenticatedUser
  resetExpanded: () => void
};

const UpdateUser: React.FC<TypeFormProps> = ({ user, resetExpanded }: TypeFormProps) => {
  const [userToUpdate, setUserToUpdate] = useState<IAuthenticatedUser>({
    id: Number(user.id),
    username: user.username,
    email: user.email,
    roles: user.roles
  });

  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);

  // UPDATE
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
      setUserToUpdate(userToUpdate);
      resetExpanded();
    },
    onError(error) {
      console.log("update user error:", error);
      setOpenErrorModal(true);
      setLoading(false);
    },
  });

  const handleOnUpdate = async (e: FormEvent<HTMLFormElement>, userToUpdate: IAuthenticatedUser) => {
    e.preventDefault();
    const errorUsername = await validateUsername({ username: userToUpdate.username });

    if (errorUsername) setUsernameError(errorUsername);
    if (!errorUsername) {
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
          <div className="field-icon-block">
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
        </div>
        <div className='buttons'>
          <div className='update-btn-loading-block'>
            <Button 
              className='update-btn'  
              style={(usernameError || emailError) ? disabledFormButtonStyle : formButtonStyle}  
              type="submit"
              variant="contained"
              disabled={(usernameError || emailError) ? true : false}
            >
              Mettre à jour
            </Button>
            {loading && <Loader styleClass='update-tag-loader' />}
          </div>
          <DeleteUser id={Number(user.id)} resetExpanded={resetExpanded} />
        </div>
      </form>
      {openErrorModal && <ErrorModal error={updateUserError} onModalClose={handleModalClose} />}
    </div>
  )
}


export default UpdateUser;
