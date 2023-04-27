//import './createType.scss';
import { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";

import { CREATE_CITY } from "../../../api/city/mutations";
import { GET_ALL_CITIES } from "../../../api/city/queries";

import Loader from "../../loader/Loader";
import ErrorModal from "../../modal/serverError/ServerErrorModal";

import { validateName, validatePicture, validateLatitude, validateLongitude } from "../../../utils/validationForms/cityValidation";

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { FormControl, TextField, MenuItem, Select, SelectChangeEvent, InputLabel, Button } from "@mui/material";

import {
  textFielPropsStyle,
  labelTextFieldPropsStyle,
  formButtonStyle,
  disabledFormButtonStyle
} from "../../../style/customStyles";
import { IUser } from "../../../types/user";

type CityFormProps = {
  users: IUser[]
};

const CreateCity: React.FC<CityFormProps> = ({ users }: CityFormProps) => {
  const [cityName, setCityName] = useState<string>("");
  const [cityPicture, setCityPicture] = useState<string>("");
  const [cityLatitude, setCityLatitude] = useState<string>("");
  const [cityLongitude, setCityLongitude] = useState<string>("");
  const [cityAdmin, setCityAdmin] = useState<IUser>();  

  const [onVisible, setOnVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState<string>("");
  const [pictureError, setPictureError] = useState<string>("");
  const [latitudeError, setLatitudeError] = useState<string>("");
  const [longitudeError, setLongitudeError] = useState<string>("");
  const [administrateurError, setAdministrateurError] = useState<string>("");

  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);

  // CREATE
  const [
    createCity, 
    { 
      error: createdCityError, 
    }
  ] = useMutation(CREATE_CITY, {
    refetchQueries: [
      { query: GET_ALL_CITIES }
    ],
    onCompleted() {
      setLoading(false);
      handleStopOnVisible();
      setCityName("");
      setCityPicture("");
      setCityLatitude("");
      setCityLongitude("");
      setCityAdmin(undefined);
    },
    onError() {
      setOpenErrorModal(true);
      setLoading(false);
    },
  });

  const handleOnCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errorName = await validateName({ name: cityName });
    if (errorName) setNameError(errorName);
    const errorPicture = await validatePicture({picture: cityPicture});
    if (errorPicture) setPictureError(errorPicture);
    const errorLatitude = await validateLatitude({latitude: cityLatitude})
    if (errorLatitude) setLatitudeError(errorLatitude);
    const errorLongitude = await validateLongitude({longitude: cityLongitude});
    if (errorLongitude) setLongitudeError(errorLongitude);
  

    if (!errorName) {
      setLoading(true);
      setTimeout(() => {
        createCity(
          { 
            variables: { 
              city: {
              name: cityName,
              picture: cityPicture,
              latitude: cityLatitude,
              longitude: cityLongitude,
              user: cityAdmin,
              }
            }
          }
        );
      }, 500)
    } else return;
  }

  const changeName = async (value: string) => {
    setCityName(value);
    const errorName = await validateName({ name: value });
    if (errorName) setNameError(errorName);
    else setNameError("");
  } 

  const changePicture = async (value: string) => {
    setCityPicture(value);
    const errorPicture = await validatePicture({ picture: value});
    if (errorPicture) setPictureError(errorPicture);
    else setPictureError("");
  }

  const changeLatitude = async (value: string) => {
    setCityLatitude(value);
    const errorLatitude = await validateLatitude({ latitude: value});
    if (errorLatitude) setLatitudeError(errorLatitude);
    else setLatitudeError("");
  }

   const changeLongitude = async (value: string) => {
    setCityLongitude(value);
    const errorLongitude = await validateLongitude({ longitude: value });
    if (errorLongitude)
      setLongitudeError(errorLongitude);
    else
      setLongitudeError("");
  }

  const handleUserChange = (event: SelectChangeEvent<IUser>) => {
    setCityAdmin(event.target.value as IUser);
  };

  const handleOnVisible = () => setOnVisible(true);
  const handleStopOnVisible = () => setOnVisible(false);

  return (
    <div className="create-type-block">
      <Button 
        onClick={handleOnVisible}
        disabled={onVisible ? true : false} 
      >
        <AddOutlinedIcon
          className={onVisible ? '' : 'icon-add'}
        />
      </Button>
      <Button 
        className={onVisible ? "visible" : "not-visible"}
        onClick={handleStopOnVisible} 
      >
        <CloseIcon className="close-icon-blue" />
      </Button>
      <div className={onVisible ? "form-appear create-form" : "form-not-visible create-form"} >
        <form 
          autoComplete="off"
          onSubmit={e => handleOnCreate(e)}
        >
          <div className="fields">
            <TextField  
              label="Nom" 
              variant="filled" 
              inputProps={{style: textFielPropsStyle}}
              InputLabelProps={{style: labelTextFieldPropsStyle}} 
              onChange={(e) => changeName(e.target.value.trim())}
              className='text-field'
              value={cityName}
              error={nameError?.length ? true : false}
              helperText={nameError.length ? nameError : ""}
            />
            <TextField
              label="Photo"
              variant="filled" 
              inputProps={{style: textFielPropsStyle}}
              InputLabelProps={{style: labelTextFieldPropsStyle}} 
              onChange={(e) => changePicture(e.target.value.trim())}
              className='text-field'
              value={cityPicture}
              error={pictureError?.length ? true : false}
              helperText={pictureError.length ? pictureError : ""}
            />
            <TextField
              label="Latitude"
              variant="filled" 
              inputProps={{style: textFielPropsStyle}}
              InputLabelProps={{style: labelTextFieldPropsStyle}} 
              onChange={(e) => changeLatitude(e.target.value.trim())}
              className='text-field'
              value={cityLatitude}
              error={latitudeError?.length ? true : false}
              helperText={latitudeError.length ? latitudeError : ""}
            />
            <TextField
              label="Longitude"
              variant="filled" 
              inputProps={{style: textFielPropsStyle}}
              InputLabelProps={{style: labelTextFieldPropsStyle}} 
              onChange={(e) => changeLongitude(e.target.value.trim())}
              className='text-field'
              value={cityLongitude}
              error={longitudeError?.length ? true : false}
              helperText={longitudeError.length ? longitudeError : ""}
            /> 
          <FormControl sx={{width:220}}>
            <InputLabel id="custom-select-label">Administrateur</InputLabel>  
            <Select
              labelId="custom-select-label"
              label="Administrateur"
              value={cityAdmin ?? ""}
              onChange={handleUserChange}
              error={administrateurError?.length ? true : false}

              >
                
                {users &&
                  users.map((cityAdministrator: any) => {
                    return (
                      <MenuItem value={cityAdministrator} key={cityAdministrator.id}>
                        {cityAdministrator.username}
                      </MenuItem>
                    )})}

              </Select>
              {
              administrateurError.length ? administrateurError : ""

              }
          </FormControl>
          </div>
          
          <div className="create-btn-loading-block">
            <Button   
              className="create-button"
              style={nameError? disabledFormButtonStyle : formButtonStyle}  
              type="submit"
              variant="contained"
              disabled={nameError? true : false}
            >
              Créer
            </Button>
            {loading && <Loader styleClass='create-type-loader' />}
          </div>
        </form>
        {openErrorModal && <ErrorModal error={createdCityError} onModalClose={handleModalClose} />}
      </div>
    </div>
  )
}

export default CreateCity;
