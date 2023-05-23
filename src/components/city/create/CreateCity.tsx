import { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";

import { CREATE_CITY } from "../../../api/city/mutations";
import { GET_ALL_CITIES } from "../../../api/city/queries";

import Loader from "../../loader/Loader";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import CustomSelectMenu from "../../selectMenu";
import ImageLink from "../../imageLink";

import { validateName, validatePicture, validateLatitude, validateLongitude } from "../../../utils/validationForms/cityValidation";
import { validateCommonId } from "../../../utils/validationForms/commonValidation";

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { TextField, SelectChangeEvent, Button } from "@mui/material";

import {
  textFielPropsStyle,
  labelTextFieldPropsStyle,
  formButtonStyle,
  disabledFormButtonStyle
} from "../../../style/customStyles";

import { cityDefaultImgUrl } from "../../../utils/constants";
import { IUser } from "../../../types/user";

type CityFormProps = {
  users: IUser[]
};

const CreateCity: React.FC<CityFormProps> = ({ users }: CityFormProps) => {
  const [cityName, setCityName] = useState<string>("");
  const [cityPicture, setCityPicture] = useState<string>("");
  const [cityLatitude, setCityLatitude] = useState<string>("");
  const [cityLongitude, setCityLongitude] = useState<string>("");
  const [cityAdmin, setCityAdmin] = useState<number | null>(null);  

  const [onVisible, setOnVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState<string>("");
  const [pictureError, setPictureError] = useState<string>("");
  const [latitudeError, setLatitudeError] = useState<string>("");
  const [longitudeError, setLongitudeError] = useState<string>("");
  const [administratorError, setAdministratorError] = useState<string>("");

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
      setCityAdmin(null);
    },
    onError() {
      setOpenErrorModal(true);
      setLoading(false);
    },
  });

  const handleOnCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isAnyInputError()) {
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
              userId: cityAdmin,
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

  const handleAdminChange = async (event: SelectChangeEvent<number>) => {
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

  const handleOnVisible = () => setOnVisible(true);
  const handleStopOnVisible = () => setOnVisible(false);

  return (
    <div className="form_block">
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
                    <ImageLink link={cityPicture} defaultPath={cityDefaultImgUrl} alt="point d'intérêt" />
                </div>
              </div>

              <div className="menu-select-block">
                  <div className="cities-select-menu"> 
                    <CustomSelectMenu
                      label="Administrateur"
                      menuSelectClassname="menu-select-cities"
                      selectValue={cityAdmin ?? 0}
                      onChange={handleAdminChange}
                      dataToList={users}
                      menuItemClassname=""
                      menuItemPropertyToDisplay="username"
                      displayImg={false}
                      propertyImgToDisplay=''
                    />
                    {administratorError.length ? administratorError : ""}
                  </div>
              </div>
            </div>
          </div>
          
          <div className="create-btn-loading-block">
            <Button   
              className="create-button"
              style={(isAnyInputError()) ? disabledFormButtonStyle : formButtonStyle}  
              type="submit"
              variant="contained"
              disabled={(isAnyInputError()) ? true : false}
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
