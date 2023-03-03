import './serverErrorModal.scss';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { ApolloError } from '@apollo/client';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

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
  
  const handleCloseModal = () => {
    onModalClose();
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
    emojis = error.graphQLErrors[0].extensions.emoji;
    statusCodeMessage = error.graphQLErrors[0].extensions.statusCodeMessage;
    statusCodeError = error.graphQLErrors[0].extensions.statusCode;
    errorMessage = error.message;
  } else {
    return <Modal
    keepMounted
    open={open}
    onClose={handleCloseModal}
  >
    <Box id='error-modal' sx={style}>
      <CancelRoundedIcon 
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
        <span className='wording'>Type :</span> Service indisponible
      </Typography>
      <h2></h2>
      <Typography id="modal-error-status-code">
        <span className='wording'>Code status :</span> 
        <span
          className={colorClass()}
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