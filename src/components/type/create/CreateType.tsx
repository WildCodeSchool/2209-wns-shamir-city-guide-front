import './createType.scss';
import { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";

import { CREATE_TYPE } from "../../../api/type/mutations";
import { GET_ALL_TYPES } from "../../../api/type/queries";

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


type TypeFormProps = {
  icons: object
};

const CreateType: React.FC<TypeFormProps> = ({ icons }: TypeFormProps) => {
  const [typeName, setTypeName] = useState<string>("");
  const [typeLogo, setTypeLogo] = useState<string>(DefaultIconsNames.TYPE);
  const [iconDisplayed, setIconDisplayed] = useState<string>(DefaultIconsNames.TYPE);
  const [typeLogoColor, setTypeLogoColor] = useColor("hex", DefaultIconsColors.BLACK);
  

  const [onVisible, setOnVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState<string>("");
  const [logoError, setLogoError] = useState<string>("");

  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);

  // CREATE
  const [
    createType, 
    { 
      error: createdTypeError, 
    }
  ] = useMutation(CREATE_TYPE, {
    refetchQueries: [
      { query: GET_ALL_TYPES }
    ],
    onCompleted() {
      setLoading(false);
      handleStopOnVisible();
      setTypeName("");
      setTypeLogo(DefaultIconsNames.TYPE);
      setIconDisplayed(DefaultIconsNames.TYPE);
    },
    onError() {
      setOpenErrorModal(true);
      setLoading(false);
    },
  });

  const handleOnCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let icon = "";
    if (!Object.keys(icons).includes(typeLogo)) {
      icon = DefaultIconsNames.TYPE;
    } else icon = typeLogo;
    const errorName = await validateName({ name: typeName });
    
    if (errorName) setNameError(errorName);
    if (!errorName) {
      setLoading(true);
      setTimeout(() => {
        createType(
          { 
            variables: { 
              type: {
              name: typeName,
              logo: icon,
              color: typeLogoColor.hex
              }
            }
          }
        );
      }, 500)
    } else return;
  }

  const changeName = async (value: string) => {
    setTypeName(value);
    const errorName = await validateName({ name: value });
    if (errorName) setNameError(errorName);
    else setNameError("");
  } 

  const changeLogo = async (value: keyof typeof icons) => {
    setTypeLogo(value);
    const errorLogo = await validateLogo({ logo: value });
    if (errorLogo) setLogoError(errorLogo);
    else setLogoError("");
    if(Object.keys(icons).includes(value)) {
      setIconDisplayed(value);
    } else {
      setIconDisplayed(DefaultIconsNames.TYPE);
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
              value={typeName}
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
                value={typeLogo} 
                error={logoError?.length ? true : false}
                helperText={logoError.length ? logoError : ""}
              />
              <DynamicIcon iconName={iconDisplayed as keyof typeof icons} color={typeLogoColor.hex} />
            </div>
          </div>
          <div className='logo-choice-color-block'>
            <p>Couleur du logo</p>
            <ColorPicker width={200} height={80} color={typeLogoColor} onChange={setTypeLogoColor} hideHEX hideRGB hideHSV dark />
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
        {openErrorModal && <ErrorModal error={createdTypeError} onModalClose={handleModalClose} />}
      </div>
    </div>
  )
}

export default CreateType;
