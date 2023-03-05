import './allUsers.scss';
import React, { useState, useEffect } from "react";

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as icons from "@mui/icons-material";

import { IAuthenticatedUser } from "../../../../types/user";
import { GetAllUsers } from "../../../../services/user";
import { GetAllRoles } from "../../../../services/role";

import UpdateUser from "../../../../components/user/update/UpdateUser";

import Loader from "../../../../components/loader/Loader";
import DynamicIcon from "../../../../components/dynamicIcon/DynamicIcon";
import ErrorModal from "../../../../components/modal/serverError/ServerErrorModal";
import UseFilteredSearch from "../../../../components/useFilteredSearch/UseFilteredSearch";

import { DefaultIconsNames, Colors } from "../../../../utils/constants";

const AllUsers: React.FC = () => {
  // Accordion state
  const [expanded, setExpanded] = useState<string | false>(false);
  const [loading, setLoading] = useState(true);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);
  
  // GET ALL
  const { allUsers, usersError, usersLoading } = GetAllUsers();
  const { allRoles } = GetAllRoles();

  // Active types Loader during 0.4 second
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setExpanded(false);
    }, 400);
  }, [allUsers]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
  };

  const resetExpanded = () => setExpanded(false);

  // Filtered search
  const [filteredUsers, setFilteredUsers] = useState<IAuthenticatedUser[]>();
  const handleFilteredUsers = (users: IAuthenticatedUser[]) => {
    setFilteredUsers(users);
  } 

  useEffect(() => {
    if (allUsers?.getAllUsers) {
      handleFilteredUsers(allUsers?.getAllUsers);
    } 
  }, [allUsers?.getAllUsers]);
  
  if (usersError) return <ErrorModal error={usersError} onModalClose={handleModalClose} />

  const ActiveLoaderUsers: React.FC = () => (
    <div className="page all-users">
      <div className="loader-all-items">
        <Loader styleClass="loader" />
        <DynamicIcon iconName={DefaultIconsNames.USER as keyof typeof icons} color='' />
        <h4>Chargement des utilisateurs...</h4> 
      </div>
    </div> 
  )

  if (usersLoading) {
     return <ActiveLoaderUsers />
  }

  return (
    <div className="page all-tags" >
      {loading ? (
        <ActiveLoaderUsers />
      ) : (
        <div className="content">
          <h2 className="page-title">Les utilisateurs</h2>
          <UseFilteredSearch dataToFilter={allUsers.getAllUsers} searchKey={"username"} setItems={handleFilteredUsers} />
          {
            filteredUsers && 
            filteredUsers.map(
              (user: IAuthenticatedUser, index: number) => {
                return (
                  <div className="tag-section" key={user.id}>
                    <Accordion expanded={expanded === "panel" + (index + 1)} onChange={handleChange("panel" + (index + 1))}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon className="icon-blue-light" />}
                        aria-controls={`panel${index + 1}bh-content`}
                      >
                      <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        <DynamicIcon iconName={DefaultIconsNames.USER} color={Colors.BLUEGREEN} />
                      </Typography>
                      <Typography className='name-section-color' sx={{ color: 'text.secondary' }}>{user.username}</Typography>
                      </AccordionSummary>
                      <AccordionDetails id={`section-${index}`}>
                        <UpdateUser user={user} allRoles={allRoles.getAllRoles} resetExpanded={resetExpanded} />
                      </AccordionDetails>
                    </Accordion>
                  </div>
                )
              }
            )
          }
          {openErrorModal && <ErrorModal error={usersError} onModalClose={handleModalClose} />}
        </div>
      )}
    </div>
  )
}

export default AllUsers;
