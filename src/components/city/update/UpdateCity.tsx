import { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";
import { ICity } from "../../../types/city";

import { UPDATE_CITY } from "../../../api/city/mutations";
import { GET_ALL_CITIES } from "../../../api/city/queries";

import Loader from "../../loader/Loader";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import CustomSelectMenu from "../../selectMenu";
import ImageLink from "../../imageLink";
import DeleteCity from '../delete/deleteCity';

import { validateCommonId } from "../../../utils/validationForms/commonValidation";

import { TextField, SelectChangeEvent } from "@mui/material";

import { 
  validateName, 
  validatePicture, 
  validateLatitude, 
  validateLongitude 
} from "../../../utils/validationForms/cityValidation";

import Button from '@mui/material/Button';
import {
  textFielPropsStyle,
  labelTextFieldPropsStyle,
  formButtonStyle,
  disabledFormButtonStyle
} from "../../../style/customStyles";
import { IUser } from "../../../types/user";

import { cityDefaultImgUrl } from "../../../utils/constants";


type CityFormProps = {
  city: ICity
  users: IUser[]
  resetExpanded: () => void
};


const UpdateCity: React.FC<CityFormProps> = ({ city, users, resetExpanded }: CityFormProps) => {
  const [cityId] = useState<number | undefined>(city.id);
  const [cityName, setCityName] = useState<string>(city.name);
  const [cityPicture, setCityPicture] = useState<string>(city.picture);
  const [cityLatitude, setCityLatitude] = useState<string>(city.latitude);
  const [cityLongitude, setCityLongitude] = useState<string>(city.longitude);
  const [cityAdmin, setCityAdmin] = useState<number | null |undefined>((city.user?.id));  
   
  const [loading, setLoading] = useState(false);

  const [pictureError, setPictureError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [latitudeError, setLatitudeError] = useState<string>("");
  const [longitudeError, setLongitudeError] = useState<string>("");
  const [administratorError, setAdministratorError] = useState<string>("");

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
      resetExpanded();
    },
    onError() { 
      setOpenErrorModal(true);
      setLoading(false);
    },
  });

  const handleOnUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let cityIdToParse: number;
    if (typeof cityId === "string") cityIdToParse = parseInt(cityId);
  
    if (!isAnyInputError()) {
      setLoading(true);
      setTimeout(() => {
        updateCity({ 
          variables: { 
            city: {
              id: cityIdToParse ?? cityIdToParse,
              name: cityName,
              latitude: cityLatitude,
              longitude: cityLongitude,
              picture: cityPicture,
              userId: cityAdmin
            }
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
    setCityName(value);
    const errorName = await validateName({ name: value });
    if (errorName) setNameError(errorName);
    else setNameError("");
  } 

  const changePicture = async (value : string) => {
    setCityPicture(value);
    const errorPicture = await validatePicture({ picture : value});
    if (errorPicture) setPictureError(errorPicture);
    else setPictureError("");
  }

  const changeLatitude = async (value : string) => {
    setCityLatitude(value);
    const errorLatitude = await validateLatitude({ latitude : value});
    if (errorLatitude) setLatitudeError(errorLatitude);
    else setLatitudeError("");
  }

    const changeLongitude = async (value : string) => {
    setCityLongitude(value);
    const errorLongitude = await validateLongitude ({ longitude : value});
    if (errorLongitude) setLongitudeError(errorLongitude);
    else setLongitudeError("");
  }

  const handleCityAdminChange = async (event: SelectChangeEvent<number>) => {
    const cityAdminId = parseInt(event.target.value as string);
    setCityAdmin(cityAdminId);

    const cityAdminError = await validateCommonId({ id: cityAdminId ? cityAdminId : 0 }); 
    if (cityAdminError) setAdministratorError(cityAdminError);
    else setAdministratorError("");
  };

  const isAnyInputError = () => (
    cityName.length === 0 ||
    cityLatitude.length === 0 ||
    cityLongitude.length === 0 ||
    cityPicture.length === 0 ||
    !cityAdmin ||
    nameError ||
    latitudeError ||
    longitudeError ||
    pictureError ||
    administratorError
  );

  return (
    <div className="form_block">
      <div className="create-form">
        <form 
          autoComplete="off"
          onSubmit={e => handleOnUpdate(e)}
        >
          <div className='fields'>
            <TextField  
              label="Nom" 
              variant="filled" 
              inputProps={{style: textFielPropsStyle}}
              InputLabelProps={{style: labelTextFieldPropsStyle}} 
              onChange={(e) => changeName(e.target.value)}
              className='text-field'
              value={cityName}
              error={nameError?.length ? true : false}
              helperText={nameError.length ? nameError : ""}
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
              
            <div className="container-select-image-checkbox">
              <div className="image-field_block">
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
                <div className="image_block">
                  <ImageLink link={cityPicture} defaultPath={cityDefaultImgUrl} alt="ville" />
                </div>
              </div>

              <div className="menu-select-block">
                <div className="cities-select-menu">
                  <CustomSelectMenu
                    label="Administrateur"
                    menuSelectClassname="menu-select-cities"
                    selectValue={cityAdmin ?? 0}
                    onChange={handleCityAdminChange}
                    dataToList={users}
                    menuItemClassname=""
                    menuItemPropertyToDisplay="username"
                    displayImg={false}
                    propertyImgToDisplay=''
                  />
                </div>
              </div>
            </div>
            </div>

          <div className='buttons'>
            <div className='update-btn-loading-block'>
              <Button 
                className='update-btn'  
                style={isAnyInputError() ? disabledFormButtonStyle : formButtonStyle}  
                type="submit"
                variant="contained"
                disabled={isAnyInputError() ? true : false}
              >
                Mettre à jour
              </Button>
              {loading && <Loader styleClass='update-tag-loader' />}
            </div>
            <DeleteCity id={Number(city.id)} resetExpanded={resetExpanded} />
          </div>
        </form>
        {openErrorModal && <ErrorModal error={updateCityError} onModalClose={handleModalClose} />}
      </div>
    </div>
  )
}

export default UpdateCity;

export const update = "update";