import './logoutModal.scss';
import { useState } from 'react';
import { Box, Modal, Typography } from '@mui/material';


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
  zIndex: 100
};

type LogoutModalProps = {
  onLogout: () => void;
  onLogoutModalClose: () => void;
};

const LogoutModal: React.FC<LogoutModalProps> = ({ onLogout, onLogoutModalClose }: LogoutModalProps) => {
  const [open] = useState(true);

  return (
    <div>
      <Modal
        keepMounted
        open={open}
        onClose={onLogoutModalClose}
      >
        <Box
          className='modal-logout'
          sx={style}
        >
          <Typography variant="h5" component="h4">
            Déconnexion
          </Typography>
          <p id="modal-logout-question">
            Êtes-vous certain de vouloir vous déconnecter?
          </p>
          <div className='buttons'>
            <button onClick={onLogout}>Oui</button>
            <button onClick={onLogoutModalClose}>Non</button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default LogoutModal;
