// import './updateTag.scss';
import { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";
import { ICity } from "../../../types/city";

import { UPDATE_CITY } from "../../../api/city/mutations";
import { GET_ALL_CITIES } from "../../../api/city/queries";

import Loader from "../../loader/Loader";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
// import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
// import DeleteCity from '../delete/DeleteCity';

import { validateName, validatePicture, validateLatitude, validateLongitude } from "../../../utils/validationForms/cityValidation";

import { TextField } from "@mui/material";
import Button from '@mui/material/Button';
import {
  textFielPropsStyle,
  labelTextFieldPropsStyle,
  formButtonStyle,
  disabledFormButtonStyle
} from "../../../style/customStyles";
import { IUser } from "../../../types/user";


type CityFormProps = {
  city: ICity
  user: IUser[]
  resetExpanded: () => void
};


const UpdateCity: React.FC<CityFormProps> = ({ city, user, resetExpanded }: CityFormProps) => {
  const [cityToUpdate, setCityToUpdate] = useState<ICity>({
    id: Number(city.id),
    name: city.name,
    latitude: city.latitude,
    longitude: city.longitude,
    picture: city.picture,
  });

  // const [userToUpdate, setUserToUpdate] = useState<IUser[]>(user.userName);

  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState<string>("");
  const [latitudeError, setLatitudeError] = useState<string>("");
  const [longitudeError, setLongitudeError] = useState<string>("");
  const [pictureError, setPictureError] = useState<string>("");

  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);

  // UPDATE
  const [
    updateCity, { 
      error: updateCityError, 
    }
  ] = useMutation(UPDATE_CITY, {
    refetchQueries: [
      { query: GET_ALL_CITIES }
    ],
    onCompleted() {
      setLoading(false);
      setCityToUpdate(cityToUpdate);
      resetExpanded();
    },
    onError(error) { 
      setOpenErrorModal(true);
      setLoading(false);
    },
  });

  const handleOnUpdate = async (e: FormEvent<HTMLFormElement>, cityToUpdate: ICity) => {
    e.preventDefault();
    // if (!Object.keys(icons).includes(cityToUpdate.icon)) {
    //   cityToUpdate.icon = DefaultIconsNames.CITY;
    // }
    const errorName = await validateName({ name: cityToUpdate.name });

    if (errorName) setNameError(errorName);
    if (!errorName) {
      setLoading(true);
      setTimeout(() => {
        updateCity({ 
          variables: { 
            city: cityToUpdate, 
          },
        });
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }, 500)
    } else return;
  }

  const changeName = async (value: string) => {
    setCityToUpdate({...cityToUpdate, name: value});
    const errorName = await validateName({ name: value });
    if (errorName) setNameError(errorName);
    else setNameError("");
  } 

  const changePicture = async (value : string) => {
    setCityToUpdate({...cityToUpdate, picture: value});
    const errorPicture = await validatePicture({ picture : value});
    if (errorPicture) setPictureError(errorPicture);
    else setPictureError("");
  }

  const changeLatitude = async (value : string) => {
    setCityToUpdate({...cityToUpdate, latitude : value});
    const errorLatitude = await validateLatitude({ latitude : value});
    if (errorLatitude) setLatitudeError(errorLatitude);
    else setLatitudeError("");
  }

    const changeLongitude = async (value : string) => {
    setCityToUpdate({...cityToUpdate, longitude : value});
    const errorLongitude = await validateLongitude ({ longitude : value});
    if (errorLongitude) setLongitudeError(errorLongitude);
    else setLongitudeError("");
  }

  
  return (
    <div className="update-form">
      <form 
        autoComplete="off"
        onSubmit={e => handleOnUpdate(e, cityToUpdate)}
      >
        <div className='fields'>
          <TextField  
            label="Nom" 
            variant="filled" 
            inputProps={{style: textFielPropsStyle}}
            InputLabelProps={{style: labelTextFieldPropsStyle}} 
            onChange={(e) => changeName(e.target.value)}
            className='text-field'
            value={cityToUpdate.name}
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
              value={cityToUpdate.picture}
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
              value={cityToUpdate.latitude}
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
              value={cityToUpdate.longitude}
              error={longitudeError?.length ? true : false}
              helperText={longitudeError.length ? longitudeError : ""}
            /> 
            <TextField
              label="Administrateur"
            /> 
            </div>

        <div className='buttons'>
          <div className='update-btn-loading-block'>
            <Button 
              className='update-btn'  
              style={(nameError ) ? disabledFormButtonStyle : formButtonStyle}  
              type="submit"
              variant="contained"
              disabled={(nameError ) ? true : false}
            >
              Mettre à jour
            </Button>
            {loading && <Loader styleClass='update-tag-loader' />}
          </div>
          {/* <DeleteCity id={Number(city.id)} resetExpanded={resetExpanded} /> */}
        </div>
      </form>
      {openErrorModal && <ErrorModal error={updateCityError} onModalClose={handleModalClose} />}
    </div>
  )
}

export default UpdateCity;
