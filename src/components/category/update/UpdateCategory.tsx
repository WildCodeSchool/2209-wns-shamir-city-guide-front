//import './updateCategory.scss';
import { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";

import { UPDATE_CATEGORY } from "../../../api/category/mutations";
import { GET_ALL_CATEGORIES } from "../../../api/category/queries";

import Loader from "../../loader/Loader";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import DynamicIcon from "../../dynamicIcon/DynamicIcon";
import DeleteCategory from '../delete/DeleteCategory';

import { ICategory } from "../../../types/category";
import { validateName, validateIcon } from "../../../utils/validationForms/categoryValidation";
import { DefaultIconsNames } from "../../../utils/constants";

import { TextField, Button } from "@mui/material";
import { ColorPicker, useColor } from 'react-color-palette';

import {
  textFielPropsStyle,
  labelTextFieldPropsStyle,
  formButtonStyle,
  disabledFormButtonStyle
} from "../../../style/customStyles";

type CategoryFormProps = {
  category: ICategory
  icons: object
  color: string
  resetExpanded: () => void
};


const UpdateCategory: React.FC<CategoryFormProps> = ({ category, icons, color, resetExpanded }: CategoryFormProps) => {
  const [categoryToUpdate, setCategoryToUpdate] = useState<ICategory>({
    id: Number(category.id),
    name: category.name,
    icon: category.icon,
    color: category.color
  });
  const [categoryIconColor, setCategoryIconColor] = useColor("hex", category.color);

  const [iconDisplayed, setIconDisplayed] = useState<string>(categoryToUpdate.icon);
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState<string>("");
  const [iconError, setIconError] = useState<string>("");

  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);

  // UPDATE
  const [
    updateCategory, {
      error: updateCategoryError,
    }
  ] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: [
      { query: GET_ALL_CATEGORIES }
    ],
    onCompleted(data) {
      setLoading(false);
      const updatedCategory = data.updateCategory;
      setCategoryToUpdate({
        id: Number(updatedCategory.id),
        name: updatedCategory.name,
        icon: updatedCategory.icon,
        color: updatedCategory.color
      });
      setIconDisplayed(updatedCategory.icon);
      resetExpanded();
    },
    onError() {
      setOpenErrorModal(true);
      setLoading(false);
    },
  });

  const handleOnUpdate = async (e: FormEvent<HTMLFormElement>, categoryToUpdate: ICategory) => {
    e.preventDefault();
    if (!Object.keys(icons).includes(categoryToUpdate.icon)) {
      categoryToUpdate.icon = DefaultIconsNames.CATEGORY;
    }
    const errorName = await validateName({ name: categoryToUpdate.name });

    if (errorName) setNameError(errorName);
    if (!errorName) {
      setLoading(true);
      setTimeout(() => {
        updateCategory({
          variables: {
            category: {
              id: categoryToUpdate.id,
              name: categoryToUpdate.name,
              icon: categoryToUpdate.icon,
              color: categoryIconColor.hex
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
    setCategoryToUpdate({...categoryToUpdate, name: value});
    const errorName = await validateName({ name: value });
    if (errorName) setNameError(errorName);
    else setNameError("");
  }

  const changeIcon = async (value: keyof typeof icons) => {
    setCategoryToUpdate({...categoryToUpdate, icon: value});
    const errorIcon = await validateIcon({ icon: value });

    if (errorIcon) {
      setIconError(errorIcon);
    }
    else setIconError("");
    if(Object.keys(icons).includes(value)) {
      setIconDisplayed(value);
    } else {
      setIconDisplayed(DefaultIconsNames.CATEGORY);
    }
  }

  return (
    <div className="update-form">
      <form
      autoComplete="off"
        onSubmit={e => handleOnUpdate(e, categoryToUpdate)}
      >
        <div className='fields'>
          <TextField
            label="Nom"
            variant="filled"
            inputProps={{style: textFielPropsStyle}}
            InputLabelProps={{style: labelTextFieldPropsStyle}}
            onChange={(e) => changeName(e.target.value.trim())}
            className='text-field'
            value={categoryToUpdate.name}
            error={nameError?.length ? true : false}
            helperText={nameError.length ? nameError : ""}
          />
          <div className="field-icon-block">
            <TextField
              label="Icône"
              variant="filled"
              inputProps={{style: textFielPropsStyle}}
              InputLabelProps={{style: labelTextFieldPropsStyle}}
              onChange={(e) => changeIcon(e.target.value.trim() as keyof typeof icons)}
              className='text-field'
              value={categoryToUpdate.icon}
              error={iconError?.length ? true : false}
              helperText={iconError.length ? iconError : ""}
            />
            <DynamicIcon iconName={iconDisplayed as keyof typeof icons} color={categoryIconColor.hex} />
          </div>
        </div>
        <div className='logo-choice-color-block'>
          <p>Couleur du logo</p>
          <ColorPicker width={200} height={80} color={categoryIconColor} onChange={setCategoryIconColor} hideHEX hideRGB hideHSV dark />
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
          <DeleteCategory id={Number(category.id)} resetExpanded={resetExpanded} />
        </div>
      </form>
      {openErrorModal && <ErrorModal error={updateCategoryError} onModalClose={handleModalClose} />}
    </div>
  )
}

export default UpdateCategory;
