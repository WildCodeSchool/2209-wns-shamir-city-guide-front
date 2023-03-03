import './userRolesTransfertList.scss';

import React, { FormEvent, useEffect, useState } from 'react'
import { IRole } from '../../types/role';
import ErrorModal from "../../components/modal/serverError/ServerErrorModal";

import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { disabledFormButtonStyle, formButtonStyle } from '../../style/customStyles';
import Loader from '../loader/Loader';
import { UPDATE_USER_ROLES } from '../../api/user/mutations';
import { GET_ALL_USERS } from '../../api/user/queries';
import { useMutation } from '@apollo/client';
import { IUser } from '../../types/user';


// toutes les valeurs de l'objet a qui ne sont pas dans l'objet b sont conservées
const not= (a: readonly IRole[], b: readonly IRole[]) => {
  return a.filter((value: IRole) => !b.find((item: IRole) => item.name === value.name));
}

const intersection = (a: readonly IRole[], b: readonly IRole[]) => {
  return a.filter((value) => b.indexOf(value) !== -1);
}

type IPropsRolesTransfertList = {
  user: IUser
  allRoles: IRole[],
  actualUserRoles: IRole[]
  resetExpanded: () => void
}

const UserRolesTransfertList = ({ user,  allRoles, actualUserRoles, resetExpanded }: IPropsRolesTransfertList) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [checked, setChecked] = useState<readonly IRole[]>([]);
  const [left, setLeft] = useState<IRole[]>(not(allRoles, actualUserRoles));
  const [right, setRight] = useState<IRole[]>(actualUserRoles);
  const [rightError, setRightError] = useState<boolean>(false);

  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: IRole) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  // Update user roles
  const [
    updateUserRoles, { 
      error: updateUserRolesError, 
    }
  ] = useMutation(UPDATE_USER_ROLES, {
    refetchQueries: [
      { query: GET_ALL_USERS }
    ],
    onCompleted() {
      setLoading(false);
      resetExpanded();
    },
    onError() { 
      setOpenErrorModal(true);     
      setLoading(false);
    },
  });

  const handleOnRolesUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formattedRoles = right.map(r => {
      return {
        id: Number(r.id),
        name: r.name
      }
    })
    setTimeout(() => {
      updateUserRoles({ 
        variables: { 
          payload: {
            user: user,
            roles: formattedRoles
          }, 
        },
      });
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 500)
  }

  useEffect(() => {
    if (right.length === 0) setRightError(true);
    else setRightError(false);
  }, [right])

  const customList = (title: React.ReactNode, items: readonly IRole[]) => (
    <Card>
      <Divider />
      <List
        sx={{
          width: 150,
          height: 200,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value: IRole, index: number) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              id="row-checkbox"
              key={index}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon id="user-form-roles-checkbox">
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText className="user-form-role-name" id={labelId} primary={value.name} />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );


  return (
    <div className='roles-transfert-list'>
      <Grid id="roles-transfert-list-block" container spacing={2} justifyContent="center" alignItems="center">
        <Grid item>{customList('Rôles', left)}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
          </Grid>
        </Grid>
        <Grid item>{customList('User', right)}</Grid>
      </Grid>
      <div className='update-btn-loading-block'>
        <Button 
          onClick={(e: any) => handleOnRolesUpdate(e)}
          className='update-btn'  
          style={(rightError) ? disabledFormButtonStyle : formButtonStyle}  
          type="submit"
          variant="contained"
          disabled={(rightError) ? true : false}
        >
          Modifier les rôles
        </Button>
        {loading && <Loader styleClass='update-tag-loader' />}
      </div>
      {openErrorModal && <ErrorModal error={updateUserRolesError} onModalClose={handleModalClose} />}
    </div>
  )
}

export default UserRolesTransfertList;
