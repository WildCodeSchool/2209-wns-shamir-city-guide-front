import "./createTag.scss";
import React, { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";


import { CREATE_TAG } from "../../../api/tag/mutations";
import { GET_ALL_TAGS } from "../../../api/tag/queries";

import Loader from "../../loader/Loader";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import DynamicIcon from "../../dynamicIcon/DynamicIcon";

import { validateName, validateIcon } from "../../../utils/validationForms/tagValidation";
import { DefaultIconsNames } from "../../../utils/constants";

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';

import {
  textFielPropsStyle,
  labelTextFieldPropsStyle,
  formButtonStyle,
  disabledFormButtonStyle
} from "../../../style/customStyles";


type TagFormProps = {
  icons: object
};

const CreateTag: React.FC<TagFormProps> = ({ icons }: TagFormProps) => {
  const [tagName, setTagName] = useState<string>("");
  const [tagIcon, setTagIcon] = useState<string>(DefaultIconsNames.TAG);
  const [iconDisplayed, setIconDisplayed] = useState<string>(DefaultIconsNames.TAG);

  const [onVisible, setOnVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState<string>("");
  const [iconError, setIconError] = useState<string>("");

  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);

  // CREATE
  const [
    createTag, 
    { 
      error: createdTagError, 
    }
  ] = useMutation(CREATE_TAG, {
    refetchQueries: [
      { query: GET_ALL_TAGS }
    ],
    onCompleted() {
      setLoading(false);
      handleStopOnVisible();
      setTagName("");
      setTagIcon(DefaultIconsNames.TAG);
      setIconDisplayed(DefaultIconsNames.TAG);
    },
    onError(error: Error) {
      setOpenErrorModal(true);
      setLoading(false);
    },
  });

  const handleOnCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let icon = "";
    if (!Object.keys(icons).includes(tagIcon)) {
      icon = DefaultIconsNames.TAG;
    } else icon = tagIcon;
    const errorName = await validateName({ name: tagName });
    if (errorName) setNameError(errorName);
    if (!errorName) {
      setLoading(true);
      setTimeout(() => {
        createTag(
          { 
            variables: { 
              tag: {
              name: tagName,
              icon: icon
              }
            }
          }
        );
      }, 500)
    } else return;
  }

  const changeName = async (value: string) => {
    setTagName(value);
    const errorName = await validateName({ name: value });
    if (errorName) setNameError(errorName);
    else setNameError("");
  } 
  
  const changeIcon = async (value: keyof typeof icons) => {
    setTagIcon(value);
    const errorIcon = await validateIcon({ icon: value });
    if (errorIcon) setIconError(errorIcon);
    else setIconError("");
    if(Object.keys(icons).includes(value)) {
      setIconDisplayed(value);
    } else {
      setIconDisplayed(DefaultIconsNames.TAG);
    }
  } 

  const handleOnVisible = () => setOnVisible(true);
  const handleStopOnVisible = () => setOnVisible(false);

  return (
    <div className="create-tag-block">
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
              onChange={(e) => changeName(e.target.value)}
              className='text-field'
              value={tagName}
              error={nameError?.length ? true : false}
              helperText={nameError.length ? nameError : ""}
            />
            <div className="field-icon-block">
              <TextField  
                label="Icône" 
                variant="filled" 
                inputProps={{style: textFielPropsStyle}}
                InputLabelProps={{style: labelTextFieldPropsStyle}} 
                onChange={(e) => changeIcon(e.target.value as keyof typeof icons)}
                className='text-field'
                value={tagIcon} 
                error={iconError?.length ? true : false}
                helperText={iconError.length ? iconError : ""}
              />
              <DynamicIcon iconName={iconDisplayed as keyof typeof icons} color='' />
            </div>
          </div>
          <div className="create-btn-loading-block">
            <Button   
              className="create-button"
              style={(nameError || iconError) ? disabledFormButtonStyle : formButtonStyle}  
              type="submit"
              variant="contained"
              disabled={(nameError || iconError) ? true : false}
            >
              Créer
            </Button>
            {loading && <Loader styleClass='create-tag-loader' />}
          </div>
        </form>
        {openErrorModal && <ErrorModal error={createdTagError} onModalClose={handleModalClose} />}
      </div>
    </div>
  )
}

export default CreateTag;
