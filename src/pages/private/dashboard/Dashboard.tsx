import './dashboard.scss';
import React from 'react';
import { Link } from "react-router-dom";

import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import InterestsOutlinedIcon from '@mui/icons-material/InterestsOutlined';
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';

import { useAppSelector } from "../../../features/store";
import { UserRoles } from '../../../utils/constants';


const Dashboard: React.FC = () => {
  const userData = useAppSelector((state) => state.userReducer.user);
  console.log(userData);
  
  
  return (
    <div className='page dashboard'>
      {userData.infos.roles.find(role => role.name === UserRoles.SUPER_ADMIN) &&
        <div className='admin-dashboard super-admin-dashboard'>
          <div className='link-block'>
            <Link to={'#'}>
              <PersonOutlineOutlinedIcon className='icon' />
              <p>Utilisateurs</p>
            </Link>
          </div>
          <div className='link-block'>
            <Link to={'#'}>
              <LocationCityOutlinedIcon className='icon' />
              <p>Villes</p>
            </Link>
          </div>
          <div className='link-block'>
            <Link to={'/private/tags'}>
              <SellOutlinedIcon className='icon' />
              <p>Tags</p>
            </Link>
          </div>
          <div className='link-block'>
            <Link to={'/private/types'}>
              <ClassOutlinedIcon className='icon' />
              <p>Types</p>
            </Link>
          </div>
          <div className='link-block'>
            <Link to={'/private/categories'}>
              <CategoryOutlinedIcon className='icon' />
              <p>Catégories</p>
            </Link>
          </div>
        </div>
      }

      {userData.infos.roles.find(role => role.name === UserRoles.CITY_ADMIN) &&
        <div className='admin-dashboard city-admin-dashboard'>
          <div className='link-block'>
            <Link to={'#'}>
              <InterestsOutlinedIcon className='icon' />
              <p>Points d'intérêt</p>
            </Link>
          </div>
          <div className='link-block'>
            <Link to={'#'}>
              <TravelExploreOutlinedIcon className='icon' />
              <p>Circuits</p>
            </Link>
          </div>
        </div>
      }
    </div>
  )
}

export default Dashboard;
