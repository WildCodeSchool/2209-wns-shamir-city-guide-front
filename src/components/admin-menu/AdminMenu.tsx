import './adminMenu.scss';
import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';

import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';

import LogoutModal from '../modal/logout/LogoutModal';
import Loader from "../loader/Loader";

import { useAppDispatch, useAppSelector } from "../../features/store";
import { logout } from '../../features/userSlice';


const AdminMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const dispatch = useAppDispatch();
  const userSelector = useAppSelector((state) => state.userReducer.user);
  

  // Logout
  const [loading, setLoading] = useState(false);
  const [openlogoutModal, setOpenLogoutModal] = useState<boolean>(false);

  const navigate = useNavigate();
  const handleLogoutModalOpen = () => {
    handleClose();
    setOpenLogoutModal(true);
  } 
    
  // function to reset the app state
  const resetState = async () => {
    dispatch(logout());
  };

  const handleLogoutModalClose = () => setOpenLogoutModal(false);

  const handleLogout = async () => { 
    setLoading(true);
    const userToken = localStorage.getItem("city-guid_token");
    setTimeout(async () => {
      if(
        (
          userToken !== null &&
          userToken.length &&
          userSelector.isLogged
        ) ||
        userToken === null || 
        !userSelector.isLogged
      ) {
        localStorage.removeItem("city-guid_token");
        localStorage.removeItem("persist:city_guid_store");
      }
      await resetState();
      navigate('/');
    }, 600);
  }


  return (
    <div className='admin-menu'>
      <Link className='globe-link' to='/'>
        <img className='globe-draw-img' src="/images/globe-purple.png" alt="globe-purple_img" />
      </Link>
      <Button
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className='user-menu'
      >
        {userSelector && <p> {userSelector.infos.username} </p>}
        <SupervisorAccountOutlinedIcon className='icon user-menu-icon' />
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleLogoutModalOpen}>
          <LogoutRoundedIcon className='logout-btn' />
          <p>Déconnexion</p>
        </MenuItem>
      </Menu>
      {openlogoutModal && <LogoutModal onLogout={handleLogout} onLogoutModalClose={handleLogoutModalClose} />}
      {loading && <Loader styleClass='logout' />} 
    </div>
  )
}

export default AdminMenu
