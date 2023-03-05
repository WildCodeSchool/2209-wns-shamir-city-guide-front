//import './createType.scss';
import { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";

import { CREATE_CITY } from "../../../api/city/mutations";
import { GET_ALL_CITIES } from "../../../api/city/queries";

import Loader from "../../loader/Loader";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import DynamicIcon from "../../dynamicIcon/DynamicIcon";

import { validateName, validateLogo } from "../../../utils/validationForms/typeValidation";
import { DefaultIconsNames, DefaultIconsColors } from "../../../utils/constants";

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { ColorPicker, useColor } from "react-color-palette";
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
  const [iconDisplayed, setIconDisplayed] = useState<string>(DefaultIconsNames.TYPE);
  const [cityLogoColor, setCityLogoColor] = useColor("hex", DefaultIconsColors.BLACK);
  
  // ajouter Picture
  const [cityPicture, setCityPicture] = useState<string>(DefaultIconsNames.CITY);


  const [onVisible, setOnVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState<string>("");
  const [logoError, setLogoError] = useState<string>("");
  const [pictureError, setPictureError] = useState<string>("");

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
      setIconDisplayed(DefaultIconsNames.CITY);
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
              type: {
              name: cityName,
              logo: icon,
              // color: typeLogoColor.hex
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

  const changeLogo = async (value: keyof typeof icons) => {
    setCityLogo(value);
    const errorLogo = await validateLogo({ logo: value });
    if (errorLogo) setLogoError(errorLogo);
    else setLogoError("");
    if(Object.keys(icons).includes(value)) {
      setIconDisplayed(value);
    } else {
      setIconDisplayed(DefaultIconsNames.CITY);
    }
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
            <div className="field-icon-block">
              <TextField  
                label="Logo" 
                variant="filled" 
                inputProps={{style: textFielPropsStyle}}
                InputLabelProps={{style: labelTextFieldPropsStyle}} 
                onChange={(e) => changeLogo(e.target.value.trim() as keyof typeof icons)}
                className='text-field'
                value={cityLogo} 
                error={logoError?.length ? true : false}
                helperText={logoError.length ? logoError : ""}
              />
              <DynamicIcon iconName={iconDisplayed as keyof typeof icons} color={cityLogoColor.hex} />
            </div>
          </div>
          <div className='logo-choice-color-block'>
            <p>Couleur du logo</p>
            <ColorPicker width={200} height={80} color={cityLogoColor} onChange={setCityLogoColor} hideHEX hideRGB hideHSV dark />
          </div>
          <div className="create-btn-loading-block">
            <Button   
              className="create-button"
              style={(nameError || logoError) ? disabledFormButtonStyle : formButtonStyle}  
              type="submit"
              variant="contained"
              disabled={(nameError || logoError) ? true : false}
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
