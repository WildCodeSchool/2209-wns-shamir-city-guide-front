import './serverErrorModal.scss';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ApolloError } from '@apollo/client';

import { logout } from '../../../features/userSlice';
import { useAppDispatch } from "../../../features/store";

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import { StatusCode, StatusCodeMessage } from '../../../utils/constants';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  outline: 'none',
  borderRadius: 10,
  boxShadow: 24,
  p: 4,
};

type ErrorModalProps = {
  error: ApolloError | undefined;
  onModalClose: () => void;
};

const ServerErrorModal: React.FC<ErrorModalProps> = ({ error, onModalClose }: ErrorModalProps) => {
  const [open] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  console.log("ERROR SERVER =>", error?.message);
  
  const handleCloseModal = () => {
    onModalClose();
  } 

  const isBadRequestErrorMessage = () => error?.message.includes("not successful") && error.message.includes("400");

  const returnToDashboardOrLoginPage = () => {
    if (/private/.test(location.pathname)) {
      handleCloseModal();
      navigate('/private/dashboard');
    } else {
      handleCloseModal();
      navigate('/login');
    }
  }

  let errorMessage: string = "";
  let emojis: any = null;
  let statusCodeMessage: any = null;
  let statusCodeError: any = null;

  const colorClass = () => {
    if (statusCodeError >= 400 && statusCodeError < 500)
      return 'client-error-color';
    else if (statusCodeError >= 500 && statusCodeError < 600)
      return 'server-error-color';
  }

  if (error && error.graphQLErrors.length > 0) {
    // First check if the user is not logged anymore, if it is the case we redirect him to the login page
    statusCodeError = error.graphQLErrors[0].extensions.statusCode;
    emojis = error.graphQLErrors[0].extensions.emoji;
    statusCodeMessage = error.graphQLErrors[0].extensions.statusCodeMessage;
    errorMessage = error.message;

    if (statusCodeError === 401 || statusCodeError === 403) {
      dispatch(logout());
      navigate('/login');
    } else if (statusCodeError === 400) {
      return <Modal
    keepMounted
    open={open}
    onClose={handleCloseModal}
  >
    <Box id='error-modal' sx={style}>
      <CancelRoundedIcon
        className='icon-cross-close' 
        data-testid="mon-svg"
        onClick={handleCloseModal}
      />
      <Typography id="modal-error-title" variant="h5" component="h3">
        Erreur client
      </Typography>
      <Typography id="modal-error-emojis" variant="h6" component="h4">
        {emojis}
      </Typography>
      <Typography id="modal-error-type">
        <span className='wording'>Type : Service indisponible</span>
      </Typography>
      <Typography id="modal-error-status-code">
        <span className='wording'>Code status :</span>
        <span
          className={colorClass()}
        >
          400
        </span>
      </Typography>
      <Typography id="modal-error-description">
        Le service que vous souhaitez utiliser est indisponible pour le moment, nous vous prions de nous excuser pour la gêne occasionnée
      </Typography>
    </Box>
  </Modal>
    }
  } else if (isBadRequestErrorMessage()) {
    statusCodeError = StatusCode.BAD_REQUEST;
    emojis = null;
    statusCodeMessage = StatusCodeMessage.BAD_REQUEST;
    errorMessage = "La requête envoyée au serveur est dans un format incorrect";
  } else {
    return <Modal
    keepMounted
    open={open}
    onClose={returnToDashboardOrLoginPage}
  >
    <Box id='error-modal' sx={style}>
      <CancelRoundedIcon
        className='icon-cross-close'
        data-testid="mon-svg"
        onClick={returnToDashboardOrLoginPage}
      />
      <Typography id="modal-error-title" variant="h5" component="h3">
        Erreur serveur
      </Typography>
      <Typography id="modal-error-emojis" variant="h6" component="h4">
        {emojis}
      </Typography>
      <Typography id="modal-error-type">
        <span className='wording'>Type : Service indisponible</span>
      </Typography>
      <Typography id="modal-error-status-code">
        <span className='wording'>Code status :</span>
        <span
          className="error-503-color"
        >
          503
        </span>
      </Typography>
      <Typography id="modal-error-description">
        Le service que vous souhaitez utiliser est indisponible pour le moment, nous vous prions de nous excuser pour la gêne occasionnée
      </Typography>
    </Box>
  </Modal>
  }
  
  return (
    <div>
      <Modal
        keepMounted
        open={open}
        onClose={handleCloseModal}
      >
        <Box id='error-modal' sx={style}>
          <CancelRoundedIcon 
            role = "cancel"
            className='icon-cross-close'
            onClick={handleCloseModal}
          />
          <Typography id="modal-error-title" variant="h5" component="h3">
            Erreur serveur 
          </Typography>
          <Typography id="modal-error-emojis" variant="h6" component="h4">
            {emojis} 
          </Typography>
          <Typography id="modal-error-type">
            <span className='wording'>Type :</span> {statusCodeMessage}
          </Typography>
          <Typography id="modal-error-status-code">
            <span className='wording'>Code status :</span> 
            <span
              className={colorClass()}
            >
              {statusCodeError}
            </span>
          </Typography>
          <Typography id="modal-error-description">
            {errorMessage}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default ServerErrorModal;