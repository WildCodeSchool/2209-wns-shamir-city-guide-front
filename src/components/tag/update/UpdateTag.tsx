import './updateTag.scss';
import { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";
import { ITag } from "../../../types/tag";

import { UPDATE_TAG } from "../../../api/tag/mutations";
import { GET_ALL_TAGS } from "../../../api/tag/queries";

import Loader from "../../loader/Loader";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import DynamicIcon from "../../dynamicIcon/DynamicIcon";
import DeleteTag from '../delete/DeleteTag';

import { validateName, validateIcon } from "../../../utils/validationForms/tagValidation";
import { DefaultIconsNames } from "../../../utils/constants";

import { TextField, Button } from "@mui/material";
import {
  textFielPropsStyle,
  labelTextFieldPropsStyle,
  formButtonStyle,
  disabledFormButtonStyle
} from "../../../style/customStyles";


type TagFormProps = {
  tag: ITag
  icons: object
  resetExpanded: () => void
};


const UpdateTag: React.FC<TagFormProps> = ({ tag, icons, resetExpanded }: TagFormProps) => {
  const [tagToUpdate, setTagToUpdate] = useState<ITag>({
    id: Number(tag.id),
    name: tag.name,
    icon: tag.icon
  });

  const [iconDisplayed, setIconDisplayed] = useState<string>(tagToUpdate.icon);
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState<string>("");
  const [iconError, setIconError] = useState<string>("");

  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);

  // UPDATE
  const [
    updateTag, { 
      error: updateTagError, 
    }
  ] = useMutation(UPDATE_TAG, {
    refetchQueries: [
      { query: GET_ALL_TAGS }
    ],
    onCompleted() {
      setLoading(false);
      setTagToUpdate(tagToUpdate);
      resetExpanded();
    },
    onError(error) { 
      setOpenErrorModal(true);
      setLoading(false);
    },
  });

  const handleOnUpdate = async (e: FormEvent<HTMLFormElement>, tagToUpdate: ITag) => {
    e.preventDefault();
    if (!Object.keys(icons).includes(tagToUpdate.icon)) {
      tagToUpdate.icon = DefaultIconsNames.TAG;
    }
    const errorName = await validateName({ name: tagToUpdate.name });

    if (errorName) setNameError(errorName);
    if (!errorName) {
      setLoading(true);
      setTimeout(() => {
        updateTag({ 
          variables: { 
            tag: tagToUpdate, 
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
    setTagToUpdate({...tagToUpdate, name: value});
    const errorName = await validateName({ name: value });
    if (errorName) setNameError(errorName);
    else setNameError("");
  } 

  const changeIcon = async (value: keyof typeof icons) => {
    setTagToUpdate({...tagToUpdate, icon: value});
    const errorIcon = await validateIcon({ icon: value });
    
    if (errorIcon) {
      setIconError(errorIcon);
    } 
    else setIconError("");
    if(Object.keys(icons).includes(value)) {
      setIconDisplayed(value);
    } else {
      setIconDisplayed(DefaultIconsNames.TAG);
    }
  }
  
  return (
    <div className="update-form">
      <form 
      autoComplete="off"
        onSubmit={e => handleOnUpdate(e, tagToUpdate)}
      >
        <div className='fields'>
          <TextField  
            label="Nom" 
            variant="filled" 
            inputProps={{style: textFielPropsStyle}}
            InputLabelProps={{style: labelTextFieldPropsStyle}} 
            onChange={(e) => changeName(e.target.value)}
            className='text-field'
            value={tagToUpdate.name}
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
              value={tagToUpdate.icon} 
              error={iconError?.length ? true : false}
              helperText={iconError.length ? iconError : ""}
            />
            <DynamicIcon iconName={iconDisplayed as keyof typeof icons} color='' />
          </div>
        </div>
        <div className='buttons'>
          <div className='update-btn-loading-block'>
            <Button 
              className='update-btn'  
              style={(nameError || iconError) ? disabledFormButtonStyle : formButtonStyle}  
              type="submit"
              variant="contained"
              disabled={(nameError || iconError) ? true : false}
            >
              Mettre à jour
            </Button>
            {loading && <Loader styleClass='update-tag-loader' />}
          </div>
          <DeleteTag id={Number(tag.id)} resetExpanded={resetExpanded} />
        </div>
      </form>
      {openErrorModal && <ErrorModal error={updateTagError} onModalClose={handleModalClose} />}
    </div>
  )
}

export default UpdateTag;
