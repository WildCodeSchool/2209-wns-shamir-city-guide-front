import "./createCategory.scss";
import { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";

import { CREATE_CATEGORY} from "../../../api/category/mutations";
import { GET_ALL_CATEGORIES } from "../../../api/category/queries";

import Loader from "../../loader/Loader";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import DynamicIcon from "../../dynamicIcon/DynamicIcon";

import { validateName, validateIcon } from "../../../utils/validationForms/categoryValidation";
import { DefaultIconsColors, DefaultIconsNames } from "../../../utils/constants";

//lien des icones de material UI de Category
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


type CategoryFormProps = {
  icons: object
};

const CreateCategory: React.FC<CategoryFormProps> = ({ icons }: CategoryFormProps) => {
  const [categoryName, setCategoryName] = useState<string>("");
  const [categoryIcon, setCategoryIcon] = useState<string>(DefaultIconsNames.CATEGORY);
  const [iconDisplayed, setIconDisplayed] = useState<string>(DefaultIconsNames.CATEGORY);
  const [categoryIconColor, setCategoryIconColor] = useColor("hex", DefaultIconsColors.BLACK);


  const [onVisible, setOnVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState<string>("");
  const [iconError, setIconError] = useState<string>("");

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
      setIconDisplayed(DefaultIconsNames.CATEGORY);
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
                color: categoryIconColor.hex,
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
              <DynamicIcon iconName={iconDisplayed as keyof typeof icons} color={categoryIconColor.hex} />
            </div>
          </div>
          <div className='logo-choice-color-block'>
            <p>Couleur de l'icône</p>
            <ColorPicker width={200} height={80} color={categoryIconColor} onChange={setCategoryIconColor} hideHEX hideRGB hideHSV dark />
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
            {loading && <Loader styleClass='create-category-loader' />}
          </div>
        </form>
        {openErrorModal && <ErrorModal error={createdCategoryError} onModalClose={handleModalClose} />}
      </div>
    </div>
  )
}

export default CreateCategory;
