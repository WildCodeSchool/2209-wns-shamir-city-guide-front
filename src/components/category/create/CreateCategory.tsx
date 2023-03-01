import "./createCategory.scss";
import { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";

//lien des icones de material UI de Category
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';

import { CREATE_CATEGORY} from "../../../api/category/mutations";
import {
  textFielPropsStyle,
  labelTextFieldPropsStyle,
  formButtonStyle,
  disabledFormButtonStyle
} from "../../../style/customStyles";
import { validateName, validateIcon, validateColor } from "../../../utils/validationForms/categoryValidation";
import { DefaultIconsNames, Colors } from "../../../utils/constants";
import Loader from "../../loader/Loader";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import { GET_ALL_CATEGORIES } from "../../../api/category/queries";
import DynamicIcon from "../../dynamicIcon/DynamicIcon";
//import { firstLetterToUppercase } from "../../../utils/utils";


type CategoryFormProps = {
  icons: object,
  color: string,
};

const CreateCategory: React.FC<CategoryFormProps> = ({ icons, color }: CategoryFormProps) => {
  const [categoryName, setCategoryName] = useState<string>("");
  const [categoryIcon, setCategoryIcon] = useState<string>(DefaultIconsNames.CATEGORY);
  const [iconDisplayed, setIconDisplayed] = useState<string>(DefaultIconsNames.CATEGORY);
  const [categoryColor, setCategoryColor] = useState<string>(Colors.CATEGORY);

  const [onVisible, setOnVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState<string>("");
  const [iconError, setIconError] = useState<string>("");
  const [colorError, setColorError] = useState<string>("");

  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);

  // CREATE
  const [
    createCategory, 
    { 
      error: createdCategoryError, 
    }
  ] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [
      { query: GET_ALL_CATEGORIES }
    ],
    onCompleted() {
      setLoading(false);
      handleStopOnVisible();
      setCategoryName("");
      setCategoryIcon(DefaultIconsNames.CATEGORY);
      setCategoryColor(Colors.CATEGORY);
    },
    onError() {
      setOpenErrorModal(true);
      setLoading(false);
    },
  });

  const handleOnCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let icon = "";
    if (!Object.keys(icons).includes(categoryIcon)) {
      icon = DefaultIconsNames.CATEGORY;
    } else icon = categoryIcon;
    const errorName = await validateName({ name: categoryName });
    if (errorName) setNameError(errorName);
    if (!errorName) {
      setLoading(true);
      setTimeout(() => {
        createCategory(
          { 
            variables: { 
              category: {
              name: categoryName,
              icon: icon,
              color: color,
              }
            }
          }
        );
      }, 500)
    } else return;
  }

  const changeName = async (value: string) => {
    setCategoryName(value);
    const errorName = await validateName({ name: value });
    if (errorName) setNameError(errorName);
    else setNameError("");
  } 
  const changeIcon = async (value: keyof typeof icons) => {
    setCategoryIcon(value);
    const errorIcon = await validateIcon({ icon: value });
    if (errorIcon) setIconError(errorIcon);
    else setIconError("");
    if(Object.keys(icons).includes(value)) {
      setIconDisplayed(value);
    } else {
      setIconDisplayed(DefaultIconsNames.CATEGORY);
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
              value={categoryName}
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
                value={categoryIcon} 
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
        {openErrorModal && <ErrorModal error={createdCategoryError} onModalClose={handleModalClose} />}
      </div>
    </div>
  )
}

export default CreateCategory;
