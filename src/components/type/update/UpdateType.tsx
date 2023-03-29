import './updateType.scss';
import { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";

import { UPDATE_TYPE } from "../../../api/type/mutations";
import { GET_ALL_TYPES } from "../../../api/type/queries";

import Loader from "../../loader/Loader";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import DynamicIcon from "../../dynamicIcon/DynamicIcon";
import DeleteType from '../delete/DeleteType';

import { validateName, validateLogo } from "../../../utils/validationForms/typeValidation";
import { DefaultIconsNames } from "../../../utils/constants";
import { IType } from "../../../types/type";

import { TextField } from "@mui/material";
import Button from '@mui/material/Button';
import { ColorPicker, useColor } from 'react-color-palette';

import {
  textFielPropsStyle,
  labelTextFieldPropsStyle,
  formButtonStyle,
  disabledFormButtonStyle
} from "../../../style/customStyles";

type TypeFormProps = {
  type: IType
  icons: object
  resetExpanded: () => void
};


const UpdateType: React.FC<TypeFormProps> = ({ type, icons, resetExpanded }: TypeFormProps) => {
  const [typeToUpdate, setTypeToUpdate] = useState<IType>({
    id: Number(type.id),
    name: type.name,
    logo: type.logo,
    color: type.color
  });
  const [typeLogoColor, setTypeLogoColor] = useColor("hex", type.color);

  const [iconDisplayed, setIconDisplayed] = useState<string>(typeToUpdate.logo);
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState<string>("");
  const [logoError, setLogoError] = useState<string>("");

  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);

  // UPDATE
  const [
    updateType, { 
      error: updateTypeError, 
    }
  ] = useMutation(UPDATE_TYPE, {
    refetchQueries: [
      { query: GET_ALL_TYPES }
    ],
    onCompleted(data) {
      setLoading(false);
      const updatedType = data.updateType;
      setTypeToUpdate({
        id: Number(updatedType.id),
        name: updatedType.name,
        logo: updatedType.logo,
        color: updatedType.color
      });
      setIconDisplayed(updatedType.logo);
      resetExpanded();
    },
    onError() {
      setOpenErrorModal(true);
      setLoading(false);
    },
  });

  const handleOnUpdate = async (e: FormEvent<HTMLFormElement>, typeToUpdate: IType) => {
    e.preventDefault();
    if (!Object.keys(icons).includes(typeToUpdate.logo)) {
      typeToUpdate.logo = DefaultIconsNames.TYPE;
    }
    const errorName = await validateName({ name: typeToUpdate.name });
    
    if (errorName) setNameError(errorName);
    if (!errorName) {
      setLoading(true);
      setTimeout(() => {
        updateType({ 
          variables: { 
            type: {
              id: typeToUpdate.id,
              name: typeToUpdate.name,
              logo: typeToUpdate.logo,
              color: typeLogoColor.hex
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
    setTypeToUpdate({...typeToUpdate, name: value});
    const errorName = await validateName({ name: value });
    if (errorName) setNameError(errorName);
    else setNameError("");
  } 

  const changeLogo = async (value: keyof typeof icons) => {
    setTypeToUpdate({...typeToUpdate, logo: value});
    const errorLogo = await validateLogo({ logo: value });
    
    if (errorLogo) {
      setLogoError(errorLogo);
    } 
    else setLogoError("");
    if(Object.keys(icons).includes(value)) {
      setIconDisplayed(value);
    } else {
      setIconDisplayed(DefaultIconsNames.TYPE);
    }
  }
  
  return (
    <div className="update-form">
      <form 
      autoComplete="off"
        onSubmit={e => handleOnUpdate(e, typeToUpdate)}
      >
        <div className='fields'>
          <TextField  
            label="Nom" 
            variant="filled" 
            inputProps={{style: textFielPropsStyle}}
            InputLabelProps={{style: labelTextFieldPropsStyle}} 
            onChange={(e) => changeName(e.target.value.trim())}
            className='text-field'
            value={typeToUpdate.name}
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
              value={typeToUpdate.logo} 
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
        <div className='buttons'>
          <div className='update-btn-loading-block'>
            <Button 
              className='update-btn'  
              style={(nameError || logoError) ? disabledFormButtonStyle : formButtonStyle}  
              type="submit"
              variant="contained"
              disabled={(nameError || logoError) ? true : false}
            >
              Mettre à jour
            </Button>
            {loading && <Loader styleClass='update-tag-loader' />}
          </div>
          <DeleteType id={Number(type.id)} resetExpanded={resetExpanded} />
        </div>
      </form>
      {openErrorModal && <ErrorModal error={updateTypeError} onModalClose={handleModalClose} />}
    </div>
  )
}

export default UpdateType
