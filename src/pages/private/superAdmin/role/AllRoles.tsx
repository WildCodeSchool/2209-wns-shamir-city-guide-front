import './allRoles.scss';
import React, { useState, useEffect } from "react";

import Typography from '@mui/material/Typography';
import * as icons from "@mui/icons-material";

import { IRole } from "../../../../types/role";
import { GetAllRoles } from "../../../../services/role";

import Loader from "../../../../components/loader/Loader";
import DynamicIcon from "../../../../components/dynamicIcon/DynamicIcon";
import ErrorModal from "../../../../components/modal/serverError/ServerErrorModal";
import UseFilteredSearch from "../../../../components/useFilteredSearch/UseFilteredSearch";

import { DefaultIconsNames, Colors } from "../../../../utils/constants";

const AllRoles: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);

  // GET ALL
  const { allRoles, rolesError, rolesLoading } = GetAllRoles();

  // Active types Loader during 0.4 second
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }, [allRoles]);

  // Filtered search
  const [filteredRoles, setFilteredRoles] = useState<IRole[]>();
  const handleFilteredRoles = (roles: IRole[]) => {
    setFilteredRoles(roles);
  } 

  useEffect(() => {
    if (allRoles?.getAllRoles) {
      handleFilteredRoles(allRoles?.getAllRoles);
    } 
  }, [allRoles?.getAllRoles]);
  
  if (rolesError) return <ErrorModal error={rolesError} onModalClose={handleModalClose} />

  const ActiveLoaderRoles: React.FC = () => (
    <div className="page all-roles">
      <div className="loader-all-items">
        <Loader styleClass="loader" />
        <DynamicIcon iconName={DefaultIconsNames.ROLE as keyof typeof icons} color='' />
        <h4>Chargement des roles utilisateur...</h4> 
      </div>
    </div> 
  )

  if (rolesLoading) {
    return <ActiveLoaderRoles />
 }

  return (
    <div className="page all-roles" >
      {loading ? (
        <ActiveLoaderRoles />
      ) : (
        <div className="content">
          <UseFilteredSearch dataToFilter={allRoles.getAllRoles} searchKey={"name"} setItems={handleFilteredRoles} />
          {
            filteredRoles && 
            filteredRoles.map(
              (role: IRole, index: number) => {
                return (
                  <div className="role-section" key={role.id}>
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                      <DynamicIcon iconName={DefaultIconsNames.ROLE} color={Colors.BLUEGREEN} />
                    </Typography>
                    <Typography id="role-name-column" className='name-section-color' sx={{ color: 'text.secondary' }}>{role.name}</Typography>
                  </div>
                )
              }
            )
          }
          {openErrorModal && <ErrorModal error={rolesError} onModalClose={handleModalClose} />}
        </div>
      )}
    </div>
  )
}

export default AllRoles
