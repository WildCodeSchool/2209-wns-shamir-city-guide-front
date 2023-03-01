import './login.scss';
import { FormEvent, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

import { useAppDispatch } from '../../../features/store'
import { setUser } from '../../../features/userSlice';

import { useMutation } from "@apollo/client";
import Button from '@mui/material/Button';
import { TextField } from "@mui/material";
import {
  textFielPropsStyle,
  labelTextFieldPropsStyle,
  formButtonStyle,
  disabledFormButtonStyle
} from "../../../style/customStyles";

import { AUTHENTICATION_LOGIN } from '../../../api/authentication/mutations';
import { IUserConnectionPayload } from "../../../types/user";
import { validateName, validateEmail, validatePassword } from "../../../utils/validationForms/loginValidation";
import ErrorModal from "../../../components/modal/serverError/ServerErrorModal";
import Loader from "../../../components/loader/Loader";


const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [usernameError, setUsernameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation()
  const dispatch: any = useAppDispatch();

  // we retrieve the url to get thanx to the props given by ProtectedRoutes.js
  let targetedUrl = location.state;
  const handleModalClose = () => setOpenErrorModal(false);
  
  const [
    login, { 
      error: loginError
    }
  ] = useMutation(AUTHENTICATION_LOGIN, {
    onCompleted(data) {
      localStorage.setItem("city-guid_token", data.login.token);
      setUsername("");
      setEmail("");
      setPassword("");
      const userToDispatch = { 
        id: data.login.id,
        username: data.login.username, 
        email: data.login.email,
        roles: data.login.roles  
      }
      setLoading(false);
      dispatch(setUser(userToDispatch));
      navigate(targetedUrl ? targetedUrl : "/private/dashboard");
    },
    onError() {
      setOpenErrorModal(true);
      setLoading(false);
    },
  });

  const isOneFieldIsEmpty = () => (username.length === 0 || email.length === 0 || password.length === 0);
  
  const changeUsername = async (value: string) => {
    setUsername(value);
    const errorUsername = await validateName({ username: value });
    if (errorUsername) setUsernameError(errorUsername);
    else setUsernameError("");
  } 
  const changeEmail = async (value: string) => {
    setEmail(value);
    const errorEmail = await validateEmail({ email: value });
    if (errorEmail) setEmailError(errorEmail);
    else setEmailError("");
  }
  const changePassword = async (value: string) => {
    setPassword(value);
    const errorPassword = await validatePassword({ password: value });
    if (errorPassword) setPasswordError(errorPassword);
    else setPasswordError("");
  }

  const onLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errorUsername = await validateName({ username });

    if (errorUsername) setUsernameError(errorUsername);
    const errorEmail = await validateEmail({ email });
    if (errorEmail) setEmailError(errorEmail);
    const errorPassword = await validatePassword({ password });
    if (errorPassword) setPasswordError(errorPassword);
    
    if (
      !errorUsername && 
      !errorEmail && 
      !errorPassword 
    ) {
      setLoading(true);
      setTimeout(() => {
        const userConnectionPayload: IUserConnectionPayload = { 
          username: username.toLowerCase().trim(),
          email: email.toLowerCase().trim(), 
          password: password.trim()
        }
        login({ variables: { user: userConnectionPayload }});
      }, 500)
    } else return; 
  } 

  return (
    <div className="page login-page">
      <Link to='/'>
        <img className='globe-draw-img' src="/images/globe-purple.png" alt="globe-purple_img" />
      </Link>
      <h2>Formulaire de connexion</h2>
      <form 
        onSubmit={e => onLogin(e)} 
        className="form-card"
        autoComplete="off"
      >
        <TextField  
          label="Nom" 
          variant="filled" 
          inputProps={{style: textFielPropsStyle}}
          InputLabelProps={{style: labelTextFieldPropsStyle}} 
          onChange={(e) => changeUsername(e.target.value)}
          className='text-field'
          defaultValue={username} 
          error={usernameError?.length ? true : false}
          helperText={usernameError.length ? usernameError : ""}
        />
        <TextField   
          label="Email" 
          variant="filled" 
          inputProps={{style: textFielPropsStyle,
            autoComplete: 'off'}}
          InputLabelProps={{style: labelTextFieldPropsStyle}} 
          onChange={(e) => changeEmail(e.target.value)}
          className='text-field'
          defaultValue={email} 
          error={emailError?.length ? true : false}
          helperText={emailError.length ? emailError : ""}
        />
        <TextField
          label="Password"
          type="password"
          variant="filled"
          inputProps={{style: textFielPropsStyle}}
          InputLabelProps={{style: labelTextFieldPropsStyle}}  
          onChange={(e) => changePassword(e.target.value)}
          className='text-field'
          defaultValue={password}
          error={passwordError?.length ? true : false}
          helperText={passwordError.length ? passwordError : ""}
        />
        
        <Button 
          style={(usernameError || emailError || passwordError || isOneFieldIsEmpty()) ? disabledFormButtonStyle : formButtonStyle}  
          type="submit"
          variant="contained"
          disabled={(usernameError || emailError || passwordError || isOneFieldIsEmpty()) ? true : false}
        >
          Se connecter
        </Button>

      </form>
      {openErrorModal && <ErrorModal error={loginError} onModalClose={handleModalClose} />} 
      {loading && <Loader styleClass='login' />}  
    </div>
  );
}

export default Login;
