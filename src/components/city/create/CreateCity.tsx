//import './createType.scss';
import { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";

import { CREATE_CITY } from "../../../api/city/mutations";
import { GET_ALL_CITIES } from "../../../api/city/queries";

import Loader from "../../loader/Loader";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
// import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';

import { validateName, validatePicture, validateLatitude, validateLongitude } from "../../../utils/validationForms/cityValidation";
import { DefaultIconsNames } from "../../../utils/constants";

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
// import { useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";

import {
  textFielPropsStyle,
  labelTextFieldPropsStyle,
  formButtonStyle,
  disabledFormButtonStyle
} from "../../../style/customStyles";


type CityFormProps = {
  icons: object
};

const CreateCity: React.FC<CityFormProps> = ({ icons }: CityFormProps) => {
  const [cityName, setCityName] = useState<string>("");
  const [cityLogo, setCityLogo] = useState<string>(DefaultIconsNames.CITY);
  // const [cityLogoColor, setCityLogoColor] = useColor("hex", DefaultIconsColors.BLACK);
  const [cityPicture, setCityPicture] = useState<string>("");
  const [cityLatitude, setCityLatitude] = useState<string>("");
  const [cityLongitude, setCityLongitude] = useState<string>("");

  const [onVisible, setOnVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState<string>("");
  // const [logoError, setLogoError] = useState<string>("");
  const [pictureError, setPictureError] = useState<string>("");
  const [latitudeError, setLatitudeError] = useState<string>("");
  const [longitudeError, setLongitudeError] = useState<string>("");

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
      setCityLogo(DefaultIconsNames.CITY);
      setCityPicture("");
      setCityLatitude("");
      setCityLongitude("");
    },
    onError() {
      setOpenErrorModal(true);
      setLoading(false);
    },
  });

  const handleOnCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let icon = "";
    if (!Object.keys(icons).includes(cityLogo)) {
      icon = DefaultIconsNames.TYPE;
    } else icon = cityLogo;
    const errorName = await validateName({ name: cityName });
    if (errorName) setNameError(errorName);
    if (!errorName) {
      setLoading(true);
      setTimeout(() => {
        createCity(
          { 
            variables: { 
              city: {
              name: cityName,
              logo: icon,
              picture: cityPicture,
              latitude: cityLatitude,
              longitude: cityLongitude,
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
            <TextField
              label="Administrateur"
            /> 
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
