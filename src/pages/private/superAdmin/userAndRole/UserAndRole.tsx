import './userAndRole.scss';
import { useState, SyntheticEvent } from 'react';
import { Link, Outlet, useLocation } from "react-router-dom";
import AllUsers from '../user/AllUsers';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Colors } from '../../../../utils/constants';

const UserAndRole = () => {
  const location = useLocation();
  const [value, setValue] = useState('one');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  

  return (
    <div>
      <nav className='user-role-nav'>
        <Box sx={{ width: '100%' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="secondary tabs example"
          >
            <Tab 
              value="one" 
              label="Utilisateurs" 
              component={Link} 
              to="/private/users" 
            />
            <Tab 
              value="two" 
              label="Roles" 
              component={Link} 
              to="/private/users/roles" 
            />
          </Tabs>
        </Box>
        
      </nav>
      {location.pathname === `/private/users` ? (
        <AllUsers />
      ) : (
        <Outlet /> 
      )}
    </div>
  )
}

export default UserAndRole
