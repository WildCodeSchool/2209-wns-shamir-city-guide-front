import { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";
import { ITag } from "../../../types/tag";

import { TextField } from "@mui/material";
import Button from '@mui/material/Button';

import { UPDATE_TAG } from "../../../api/tag/mutations";
import {
  textFielPropsStyle,
  labelTextFieldPropsStyle,
  formButtonStyle,
  disabledFormButtonStyle
} from "../../../style/customStyles";
import { validateName, validateIcon } from "../../../utils/validationForms/tagValidation";
import { DefaultIconsNames } from "../../../utils/constants";
import Loader from "../../loader/Loader";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import { GET_ALL_TAGS } from "../../../api/tag/queries";
import DynamicIcon from "../../dynamicIcon/DynamicIcon";


type TagFormProps = {
  tag: ITag
  icons: object
};


const UpdateTag: React.FC<TagFormProps> = ({ tag, icons }: TagFormProps) => {
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
    },
    onError() {
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
    if (errorIcon) setNameError(errorIcon);
    else setIconError("");
    if(Object.keys(icons).includes(value)) {
      setIconDisplayed(value);
    } else {
      setIconDisplayed(DefaultIconsNames.TAG);
    }
  }

  return (
    <>
      <form 
      autoComplete="off"
        onSubmit={e => handleOnUpdate(e, tagToUpdate)}
      >
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
        <DynamicIcon iconName={iconDisplayed as keyof typeof icons} />
        <Button   
          style={(nameError || iconError) ? disabledFormButtonStyle : formButtonStyle}  
          type="submit"
          variant="contained"
          disabled={(nameError || iconError) ? true : false}
        >
          Mettre à jour
        </Button>
      </form>
      {openErrorModal && <ErrorModal error={updateTagError} onModalClose={handleModalClose} />}
      {loading && <Loader styleClass='update-tag-loader' />}
    </>
  )
}

export default UpdateTag;
